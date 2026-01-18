import React, { useState, useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Menu, Search, Heart, Star, Clock, Navigation, TrendingUp, UserPlus, X, ExternalLink, Tag, Crown } from 'lucide-react';
import { useShops } from './hooks/useShops';
import ShopDetail from './pages/ShopDetail';

// Twitterアバター画像URLを生成
const getAvatarUrl = (twitterId) => {
  if (!twitterId) return 'https://placehold.co/400x400/1a1a1a/666666?text=No+Image';
  const cleanId = twitterId.replace('@', '');
  return `https://unavatar.io/twitter/${cleanId}`;
};

// 店舗カードコンポーネント
const ShopCard = ({ shop }) => {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const tags = shop.seo_tags || [];
  const avatarUrl = imgError ? 'https://placehold.co/400x400/1a1a1a/666666?text=No+Image' : getAvatarUrl(shop.twitter_id);

  return (
    <Link
      to={`/shops/${shop.id}`}
      className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] border border-white/10 block"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* 画像 */}
      <div className="relative aspect-square overflow-hidden bg-neutral-900">
        <img
          src={avatarUrl}
          alt={shop.shop_name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {/* お気に入りボタン */}
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors border border-white/20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-pink-500 text-pink-500' : 'text-white/70'}`} />
        </button>
      </div>

      {/* コンテンツ */}
      <div className="p-3">
        {/* 店名 */}
        <h3 className="font-bold text-sm text-white leading-tight mb-1 line-clamp-1">
          {shop.shop_name}
        </h3>

        {/* エリア */}
        <div className="flex items-center text-xs text-amber-400 mb-2">
          <MapPin className="w-3 h-3 mr-0.5" />
          {shop.area_name}
        </div>

        {/* コンセプト */}
        {shop.main_concept && (
          <p className="text-xs text-neutral-400 mb-2 line-clamp-2">
            {shop.main_concept}
          </p>
        )}

        {/* タグ */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] bg-pink-500/20 text-pink-400 rounded-full px-1.5 py-0.5 border border-pink-500/30">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* リンクボタン */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {shop.twitter_id && (
            <span
              className="inline-flex items-center text-[10px] text-neutral-400 bg-white/10 px-2 py-1 rounded-md border border-white/10"
            >
              X
            </span>
          )}
          {shop.website_url && (
            <span
              className="inline-flex items-center gap-0.5 text-[10px] px-2 py-1 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium"
            >
              公式
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

// タグフィルターコンポーネント
const TagFilter = ({ tags, selectedTag, onTagChange }) => (
  <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
    <button
      onClick={() => onTagChange(null)}
      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 border ${
        selectedTag === null
          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]'
          : 'bg-transparent text-pink-400 border-pink-500/50 hover:bg-pink-500/20'
      }`}
    >
      <Tag className="w-3 h-3" />
      すべて
    </button>
    {tags.map((tag) => (
      <button
        key={tag}
        onClick={() => onTagChange(tag)}
        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
          selectedTag === tag
            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]'
            : 'bg-transparent text-pink-400 border-pink-500/50 hover:bg-pink-500/20'
        }`}
      >
        #{tag}
      </button>
    ))}
  </div>
);

// ヘッダーコンポーネント
const Header = ({ onMenuClick, areas, selectedArea, onAreaChange, allTags, selectedTag, onTagChange }) => (
  <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{ background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(20px)' }}>
    <div className="flex items-center justify-between px-4 py-3">
      {/* ロゴ */}
      <Link to="/" className="flex items-center">
        <Crown className="w-6 h-6 text-amber-400 mr-1" />
        <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
          esthe-now
        </span>
      </Link>

      {/* 右側アイコン */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Search className="w-5 h-5 text-neutral-400" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
          <MapPin className="w-5 h-5 text-neutral-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5 text-neutral-400" />
        </button>
      </div>
    </div>

    {/* エリアフィルター */}
    <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onAreaChange('all')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
          selectedArea === 'all'
            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-amber-500 shadow-[0_0_20px_rgba(212,175,55,0.5)]'
            : 'bg-transparent text-amber-400 border-amber-500/50 hover:bg-amber-500/20'
        }`}
      >
        すべて
      </button>
      {areas.map((area) => {
        const hasData = ['akihabara', 'ikebukuro', 'gotanda', 'shinjuku', 'ueno', 'shinbashi', 'shibuya'].includes(area.slug);
        return (
          <button
            key={area.slug}
            onClick={() => hasData ? onAreaChange(area.slug) : null}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border relative ${
              selectedArea === area.slug
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-amber-500 shadow-[0_0_20px_rgba(212,175,55,0.5)]'
                : hasData
                  ? 'bg-transparent text-amber-400 border-amber-500/50 hover:bg-amber-500/20'
                  : 'bg-transparent text-neutral-600 border-neutral-700 cursor-not-allowed'
            }`}
            disabled={!hasData}
          >
            {area.name}
            {!hasData && (
              <span className="ml-1 text-[8px] text-neutral-500">準備中</span>
            )}
          </button>
        );
      })}
    </div>

    {/* タグフィルター */}
    {allTags.length > 0 && (
      <TagFilter tags={allTags} selectedTag={selectedTag} onTagChange={onTagChange} />
    )}
  </header>
);

// フッターコンポーネント
const Footer = ({ activeTab, setActiveTab }) => (
  <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 pb-safe" style={{ background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(20px)' }}>
    <div className="flex items-center justify-around px-4 py-2">
      <button
        className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'nearby' ? 'text-amber-400' : 'text-neutral-500'}`}
        onClick={() => setActiveTab('nearby')}
      >
        <Navigation className="w-5 h-5" />
        <span className="text-xs mt-1">現在地</span>
      </button>

      <button
        className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'ranking' ? 'text-amber-400' : 'text-neutral-500'}`}
        onClick={() => setActiveTab('ranking')}
      >
        <TrendingUp className="w-5 h-5" />
        <span className="text-xs mt-1">ランキング</span>
      </button>

      {/* FAB */}
      <button className="relative -top-4 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:shadow-[0_0_40px_rgba(212,175,55,0.8)] transition-all hover:scale-105">
        <Search className="w-6 h-6 text-black" />
      </button>

      <button
        className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'new' ? 'text-amber-400' : 'text-neutral-500'}`}
        onClick={() => setActiveTab('new')}
      >
        <UserPlus className="w-5 h-5" />
        <span className="text-xs mt-1">新着</span>
      </button>

      <button
        className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'favorite' ? 'text-amber-400' : 'text-neutral-500'}`}
        onClick={() => setActiveTab('favorite')}
      >
        <Heart className="w-5 h-5" />
        <span className="text-xs mt-1">お気に入り</span>
      </button>
    </div>
  </footer>
);

// サイドメニュー
const SideMenu = ({ isOpen, onClose }) => (
  <>
    {/* オーバーレイ */}
    <div
      className={`fixed inset-0 bg-black/70 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    />

    {/* メニュー */}
    <div
      className={`fixed top-0 right-0 bottom-0 w-72 z-50 transform transition-transform border-l border-white/10 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ background: 'rgba(18, 18, 18, 0.95)', backdropFilter: 'blur(20px)' }}
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <span className="font-bold text-lg text-white">メニュー</span>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <X className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      <nav className="p-4">
        {[
          { icon: Search, label: '店舗検索' },
          { icon: MapPin, label: 'エリアから探す' },
          { icon: TrendingUp, label: '人気ランキング' },
          { icon: Clock, label: '新着店舗' },
          { icon: Heart, label: 'お気に入り' },
          { icon: Star, label: 'レビュー' },
        ].map((item, i) => (
          <button
            key={i}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 transition-colors text-left"
          >
            <item.icon className="w-5 h-5 text-amber-400" />
            <span className="text-neutral-300">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
          店舗様ログイン
        </button>
      </div>
    </div>
  </>
);

// トップページコンポーネント
function TopPage() {
  const [activeTab, setActiveTab] = useState('nearby');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);

  const { shops, areas, loading, error } = useShops(selectedArea);

  // 全店舗からユニークなタグを抽出
  const allTags = useMemo(() => {
    const tagSet = new Set();
    shops.forEach(shop => {
      if (shop.seo_tags) {
        shop.seo_tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [shops]);

  // タグでフィルタリングされた店舗
  const filteredShops = useMemo(() => {
    if (!selectedTag) return shops;
    return shops.filter(shop =>
      shop.seo_tags && shop.seo_tags.includes(selectedTag)
    );
  }, [shops, selectedTag]);

  // タグフィルターの高さに応じてヘッダーのパディングを調整
  const headerPadding = allTags.length > 0 ? 'pt-36' : 'pt-28';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* SEO メタタグ */}
      <Helmet>
        <title>東京メンズエステ厳選まとめ｜可愛い子・コンセプト店検索</title>
        <meta name="description" content="秋葉原・池袋・新宿など、東京の厳選メンズエステ店の写真、Twitter、コンセプトを掲載。可愛い子が見つかる検索サイト。" />
        <meta property="og:title" content="東京メンズエステ厳選まとめ｜可愛い子・コンセプト店検索" />
        <meta property="og:description" content="秋葉原・池袋・新宿など、東京の厳選メンズエステ店の写真、Twitter、コンセプトを掲載。" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="東京メンズエステ厳選まとめ｜可愛い子・コンセプト店検索" />
        <meta name="twitter:description" content="秋葉原・池袋・新宿など、東京の厳選メンズエステ店の写真、Twitter、コンセプトを掲載。" />
      </Helmet>

      <Header
        onMenuClick={() => setMenuOpen(true)}
        areas={areas}
        selectedArea={selectedArea}
        onAreaChange={(area) => {
          setSelectedArea(area);
          setSelectedTag(null);
        }}
        allTags={allTags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      />

      {/* メインコンテンツ */}
      <main className={`${headerPadding} pb-24 px-3`}>
        {/* セクションヘッダー */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Crown className="w-5 h-5 text-amber-400 mr-1" />
            厳選店舗
          </h2>
          <span className="text-xs text-neutral-500">{filteredShops.length}件</span>
        </div>

        {/* ローディング */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="text-center py-12 text-neutral-500">
            データの取得に失敗しました
          </div>
        )}

        {/* グリッドレイアウト */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredShops.map((shop, index) => (
              <ShopCard
                key={shop.id || shop.twitter_id || index}
                shop={shop}
              />
            ))}
          </div>
        )}

        {/* 結果なし */}
        {!loading && !error && filteredShops.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            店舗が見つかりませんでした
          </div>
        )}
      </main>

      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}

// メインアプリ（ルーティング）
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/shops/:id" element={<ShopDetail />} />
    </Routes>
  );
}
