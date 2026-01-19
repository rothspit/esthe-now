/**
 * リンク切れ自動検知スクリプト
 * 
 * 全店舗のURLをチェックし、リンク切れの店舗を非表示にする
 * 
 * 使用方法:
 *   node scripts/check-links.js
 * 
 * 環境変数:
 *   SUPABASE_URL - Supabase プロジェクトURL
 *   SUPABASE_SERVICE_ROLE_KEY - Supabase サービスロールキー
 */

import { createClient } from '@supabase/supabase-js';

// 設定
const CONFIG = {
  TIMEOUT_MS: 8000,           // リクエストタイムアウト（8秒）
  CONCURRENT_REQUESTS: 5,     // 同時リクエスト数
  RETRY_COUNT: 2,             // リトライ回数
  RETRY_DELAY_MS: 1000,       // リトライ間隔（1秒）
};

// Supabaseクライアント初期化
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が設定されていません: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * URLの有効性をチェック
 * @param {string} url - チェックするURL
 * @returns {Promise<{ok: boolean, status: number|null, error: string|null}>}
 */
async function checkUrl(url, retryCount = 0) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0; +https://esthe-now.jp)',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    // 2xx, 3xx は成功とみなす
    if (response.ok || (response.status >= 300 && response.status < 400)) {
      return { ok: true, status: response.status, error: null };
    }

    // HEADメソッドが405の場合はGETで再試行
    if (response.status === 405) {
      return await checkUrlWithGet(url);
    }

    return { ok: false, status: response.status, error: `HTTP ${response.status}` };

  } catch (error) {
    clearTimeout(timeoutId);

    // リトライ
    if (retryCount < CONFIG.RETRY_COUNT) {
      await sleep(CONFIG.RETRY_DELAY_MS);
      return checkUrl(url, retryCount + 1);
    }

    const errorMessage = error.name === 'AbortError' 
      ? 'タイムアウト' 
      : error.message || '接続エラー';

    return { ok: false, status: null, error: errorMessage };
  }
}

/**
 * GETメソッドでURLをチェック（HEADが使えない場合のフォールバック）
 */
async function checkUrlWithGet(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0; +https://esthe-now.jp)',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { ok: true, status: response.status, error: null };
    }

    return { ok: false, status: response.status, error: `HTTP ${response.status}` };

  } catch (error) {
    clearTimeout(timeoutId);
    return { ok: false, status: null, error: error.message || '接続エラー' };
  }
}

/**
 * スリープ関数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 配列を指定サイズのチャンクに分割
 */
function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * メイン処理
 */
async function main() {
  console.log('🔍 リンク切れチェックを開始します...');
  console.log(`⚙️ タイムアウト: ${CONFIG.TIMEOUT_MS}ms, 同時リクエスト: ${CONFIG.CONCURRENT_REQUESTS}`);
  console.log('');

  // アクティブな店舗を取得
  const { data: shops, error: fetchError } = await supabase
    .from('shops')
    .select('id, name, website_url')
    .eq('is_active', true)
    .not('website_url', 'is', null);

  if (fetchError) {
    console.error('❌ 店舗データの取得に失敗:', fetchError.message);
    process.exit(1);
  }

  console.log(`📋 チェック対象: ${shops.length} 店舗`);
  console.log('');

  const brokenLinks = [];
  const validLinks = [];
  let processed = 0;

  // チャンクに分けて並列処理
  const shopChunks = chunk(shops, CONFIG.CONCURRENT_REQUESTS);

  for (const shopChunk of shopChunks) {
    const results = await Promise.all(
      shopChunk.map(async (shop) => {
        const result = await checkUrl(shop.website_url);
        processed++;

        if (result.ok) {
          console.log(`✅ [${processed}/${shops.length}] ${shop.name}`);
          return { shop, result, isBroken: false };
        } else {
          console.log(`❌ [${processed}/${shops.length}] ${shop.name} - ${result.error}`);
          return { shop, result, isBroken: true };
        }
      })
    );

    for (const { shop, result, isBroken } of results) {
      if (isBroken) {
        brokenLinks.push({ ...shop, error: result.error, status: result.status });
      } else {
        validLinks.push(shop);
      }
    }

    // レート制限対策のための待機
    await sleep(500);
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('📊 チェック結果');
  console.log('='.repeat(50));
  console.log(`✅ 正常: ${validLinks.length} 店舗`);
  console.log(`❌ リンク切れ: ${brokenLinks.length} 店舗`);
  console.log('');

  // リンク切れの店舗を非表示に
  if (brokenLinks.length > 0) {
    console.log('⚠️ 削除機能は現在OFFです');
    console.log('📝 リンク切れ店舗一覧（更新はスキップ）:');
    for (const shop of brokenLinks) {
      console.log(`   - ${shop.name} (${shop.error})`);
      console.log(`     URL: ${shop.website_url}`);
    }
    console.log('');

    // ========================================
    // 削除処理は現在コメントアウト中
    // ========================================
    // const brokenIds = brokenLinks.map(shop => shop.id);
    //
    // const { error: updateError } = await supabase
    //   .from('shops')
    //   .update({ is_active: false, updated_at: new Date().toISOString() })
    //   .in('id', brokenIds);
    //
    // if (updateError) {
    //   console.error('❌ 更新に失敗:', updateError.message);
    //   process.exit(1);
    // }
    //
    // console.log('📝 非表示にした店舗一覧:');
    // for (const shop of brokenLinks) {
    //   console.log(`   - ${shop.name} (${shop.error})`);
    //   console.log(`     URL: ${shop.website_url}`);
    // }
    // console.log('');
  }

  // サマリー出力（GitHub Actions用）
  const summary = {
    timestamp: new Date().toISOString(),
    totalChecked: shops.length,
    validCount: validLinks.length,
    brokenCount: brokenLinks.length,
    brokenShops: brokenLinks.map(s => ({ id: s.id, name: s.name, url: s.website_url, error: s.error })),
  };

  console.log('📄 実行サマリー (JSON):');
  console.log(JSON.stringify(summary, null, 2));

  // GitHub Actions の出力として設定
  if (process.env.GITHUB_OUTPUT) {
    const fs = await import('fs');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `broken_count=${brokenLinks.length}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `valid_count=${validLinks.length}\n`);
  }

  console.log('');
  console.log('✨ リンク切れチェック完了!');
}

// 実行
main().catch((error) => {
  console.error('❌ 予期せぬエラー:', error);
  process.exit(1);
});
