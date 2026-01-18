/**
 * 動的サイトマップ生成スクリプト
 * 
 * ビルド時にSupabaseから店舗データを取得し、sitemap.xmlを生成
 * 
 * 使用方法:
 *   node scripts/generate-sitemap.js
 * 
 * 環境変数:
 *   VITE_SUPABASE_URL - Supabase プロジェクトURL
 *   VITE_SUPABASE_ANON_KEY - Supabase Anon Key
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// 設定
const CONFIG = {
  BASE_URL: 'https://esthe-now.jp',
  OUTPUT_DIR: 'dist',        // Viteのビルド出力先
  OUTPUT_FILE: 'sitemap.xml',
};

// __dirname の代替（ESモジュール用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabaseクライアント初期化
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が設定されていません: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 現在の日付をW3C Datetime形式で取得
 */
function getW3CDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * XMLをエスケープ
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * サイトマップXMLを生成
 */
function generateSitemapXml(shops, areas) {
  const today = getW3CDate();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- トップページ -->
  <url>
    <loc>${CONFIG.BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // エリアページ（将来的に実装予定の場合）
  // areas.forEach(area => {
  //   xml += `
  // <url>
  //   <loc>${CONFIG.BASE_URL}/area/${escapeXml(area.slug)}</loc>
  //   <lastmod>${today}</lastmod>
  //   <changefreq>weekly</changefreq>
  //   <priority>0.8</priority>
  // </url>`;
  // });

  // 店舗詳細ページ
  shops.forEach(shop => {
    const lastmod = shop.updated_at 
      ? new Date(shop.updated_at).toISOString().split('T')[0]
      : today;

    xml += `
  <url>
    <loc>${CONFIG.BASE_URL}/shops/${escapeXml(shop.id)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

/**
 * robots.txt を生成
 */
function generateRobotsTxt() {
  return `# robots.txt for esthe-now.jp
User-agent: *
Allow: /

# Sitemap
Sitemap: ${CONFIG.BASE_URL}/sitemap.xml

# Crawl-delay (optional)
Crawl-delay: 1
`;
}

/**
 * メイン処理
 */
async function main() {
  console.log('🗺️  サイトマップ生成を開始します...');
  console.log(`📍 BASE_URL: ${CONFIG.BASE_URL}`);
  console.log('');

  // 店舗データを取得
  console.log('📋 店舗データを取得中...');
  const { data: shops, error: shopsError } = await supabase
    .from('v_shops_with_area')
    .select('id, updated_at, area_slug')
    .order('created_at', { ascending: false });

  if (shopsError) {
    console.error('❌ 店舗データの取得に失敗:', shopsError.message);
    process.exit(1);
  }

  // エリアデータを取得
  console.log('📋 エリアデータを取得中...');
  const { data: areas, error: areasError } = await supabase
    .from('areas')
    .select('slug, name')
    .eq('is_active', true)
    .order('sort_order');

  if (areasError) {
    console.error('❌ エリアデータの取得に失敗:', areasError.message);
    process.exit(1);
  }

  console.log(`✅ 店舗: ${shops.length}件, エリア: ${areas.length}件`);
  console.log('');

  // 出力ディレクトリを作成
  const outputDir = resolve(__dirname, '..', CONFIG.OUTPUT_DIR);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
    console.log(`📁 ディレクトリを作成: ${outputDir}`);
  }

  // sitemap.xml を生成
  const sitemapXml = generateSitemapXml(shops, areas);
  const sitemapPath = resolve(outputDir, CONFIG.OUTPUT_FILE);
  writeFileSync(sitemapPath, sitemapXml, 'utf-8');
  console.log(`✅ sitemap.xml を生成: ${sitemapPath}`);

  // robots.txt を生成
  const robotsTxt = generateRobotsTxt();
  const robotsPath = resolve(outputDir, 'robots.txt');
  writeFileSync(robotsPath, robotsTxt, 'utf-8');
  console.log(`✅ robots.txt を生成: ${robotsPath}`);

  // 統計情報
  console.log('');
  console.log('='.repeat(50));
  console.log('📊 生成結果');
  console.log('='.repeat(50));
  console.log(`📄 URL数: ${shops.length + 1} (トップ + 店舗${shops.length}件)`);
  console.log(`📁 出力先: ${outputDir}`);
  console.log('');
  console.log('✨ サイトマップ生成完了!');
}

// 実行
main().catch((error) => {
  console.error('❌ 予期せぬエラー:', error);
  process.exit(1);
});
