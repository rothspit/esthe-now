import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, ExternalLink, Crown, Tag } from 'lucide-react';
import { useShop } from '../hooks/useShop';

// Twitterアバター画像URLを生成
const getAvatarUrl = (twitterId) => {
  if (!twitterId) return 'https://placehold.co/400x400/1a1a1a/666666?text=No+Image';
  const cleanId = twitterId.replace('@', '');
  return `https://unavatar.io/twitter/${cleanId}`;
};

export default function ShopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shop, loading, error } = useShop(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <p className="text-neutral-400 mb-4">店舗が見つかりませんでした</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-amber-500 text-black rounded-full font-medium"
        >
          トップに戻る
        </button>
      </div>
    );
  }

  const tags = shop.seo_tags || [];
  const avatarUrl = getAvatarUrl(shop.twitter_id);
  const pageTitle = `${shop.shop_name}｜${shop.area_name}メンズエステ`;
  const pageDescription = shop.main_concept
    ? `${shop.shop_name}は${shop.area_name}エリアのメンズエステ。${shop.main_concept}`
    : `${shop.shop_name}は${shop.area_name}エリアのメンズエステ店です。`;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* SEO メタタグ */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      {/* ヘッダー */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
        style={{ background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <Link to="/" className="flex items-center">
            <Crown className="w-6 h-6 text-amber-400 mr-1" />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              esthe-now
            </span>
          </Link>
          <div className="w-10" /> {/* スペーサー */}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="pt-16 pb-8 px-4">
        {/* メインビジュアル */}
        <div className="flex flex-col items-center pt-8 pb-6">
          <div
            className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_40px_rgba(212,175,55,0.3)]"
          >
            <img
              src={avatarUrl}
              alt={shop.shop_name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://placehold.co/400x400/1a1a1a/666666?text=No+Image'; }}
            />
          </div>
        </div>

        {/* 店舗情報カード */}
        <div
          className="rounded-2xl p-6 mb-6 border border-white/10"
          style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}
        >
          {/* 店名 */}
          <h1 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
            {shop.shop_name}
          </h1>

          {/* エリア */}
          <div className="flex items-center justify-center text-amber-400 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{shop.area_name}エリア</span>
          </div>

          {/* コンセプト */}
          {shop.main_concept && (
            <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-neutral-200 text-center leading-relaxed">
                {shop.main_concept}
              </p>
            </div>
          )}

          {/* タグ */}
          {tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-1 mb-3 text-neutral-400">
                <Tag className="w-4 h-4" />
                <span className="text-sm">タグ</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-pink-500/20 text-pink-400 rounded-full text-sm font-medium border border-pink-500/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col gap-4">
          {shop.website_url && (
            <a
              href={shop.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.5)] text-lg flex items-center justify-center gap-2 hover:from-amber-400 hover:to-yellow-400 transition-all active:scale-[0.98]"
            >
              <ExternalLink className="w-5 h-5" />
              公式サイトで予約
            </a>
          )}

          {shop.twitter_id && (
            <a
              href={`https://x.com/${shop.twitter_id.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] text-lg flex items-center justify-center gap-2 hover:from-blue-400 hover:to-blue-500 transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xで詳細を見る
            </a>
          )}

          {/* トップに戻るボタン */}
          <Link
            to="/"
            className="w-full py-4 bg-white/10 text-white font-medium rounded-2xl text-lg flex items-center justify-center gap-2 border border-white/20 hover:bg-white/20 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5" />
            店舗一覧に戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
