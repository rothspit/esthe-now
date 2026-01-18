import React, { useState } from 'react';
import { MapPin, Menu, Search, Heart, Star, Clock, Sparkles, Navigation, TrendingUp, UserPlus, X, ExternalLink } from 'lucide-react';
import { useShops } from './hooks/useShops';

// 店舗カードコンポーネント
const ShopCard = ({ shop, onClick }) => {
  const [liked, setLiked] = useState(false);

  // SEOタグ（PostgreSQL配列型）
  const tags = shop.seo_tags || [];

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(shop)}
    >
      <div className="p-4">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-800 leading-tight">
            {shop.shop_name}
          </h3>
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-rose-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* エリア */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-1 text-rose-400" />
          {shop.area_name}
        </div>

        {/* コンセプト */}
        {shop.main_concept && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {shop.main_concept}
          </p>
        )}

        {/* タグ */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="text-xs bg-rose-50 text-rose-500 rounded-full px-2 py-0.5">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Xリンク */}
        {shop.twitter_id && (
          <a
            href={`https://x.com/${shop.twitter_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-gray-500 hover:text-rose-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            @{shop.twitter_id}
          </a>
        )}
      </div>
    </div>
  );
};

// ヘッダーコンポーネント
const Header = ({ onMenuClick, areas, selectedArea, onAreaChange }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
    <div className="flex items-center justify-between px-4 py-3">
      {/* ロゴ */}
      <div className="flex items-center">
        <Sparkles className="w-6 h-6 text-rose-400 mr-1" />
        <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent">
          esthe-now
        </span>
      </div>

      {/* 右側アイコン */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
          <MapPin className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>

    {/* エリアフィルター */}
    <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onAreaChange('all')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
          selectedArea === 'all'
            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        すべて
      </button>
      {areas.map((area) => (
        <button
          key={area.slug}
          onClick={() => onAreaChange(area.slug)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            selectedArea === area.slug
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {area.name}
        </button>
      ))}
    </div>
  </header>
);

// フッターコンポーネント
const Footer = ({ activeTab, setActiveTab }) => (
  <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100 pb-safe">
    <div className="flex items-center justify-around px-4 py-2">
      <button 
        className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'nearby' ? 'text-rose-500' : 'text-gray-400'}`}
        onClick={() => setActiveTab('nearby')}
      >
        <Navigation className="w-5 h-5" />
        <span className="text-xs mt-1">現在地</span>
      </button>
      
      <button 
        className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'ranking' ? 'text-rose-500' : 'text-gray-400'}`}
        onClick={() => setActiveTab('ranking')}
      >
        <TrendingUp className="w-5 h-5" />
        <span className="text-xs mt-1">ランキング</span>
      </button>
      
      {/* FAB */}
      <button className="relative -top-4 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-300/50 hover:shadow-xl hover:shadow-rose-400/50 transition-all hover:scale-105">
        <Search className="w-6 h-6 text-white" />
      </button>
      
      <button 
        className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'new' ? 'text-rose-500' : 'text-gray-400'}`}
        onClick={() => setActiveTab('new')}
      >
        <UserPlus className="w-5 h-5" />
        <span className="text-xs mt-1">新着</span>
      </button>
      
      <button 
        className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'favorite' ? 'text-rose-500' : 'text-gray-400'}`}
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
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    />
    
    {/* メニュー */}
    <div className={`fixed top-0 right-0 bottom-0 w-72 bg-white z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <span className="font-bold text-lg">メニュー</span>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="p-4">
        {[
          { icon: Search, label: 'セラピスト検索' },
          { icon: MapPin, label: 'エリアから探す' },
          { icon: TrendingUp, label: '人気ランキング' },
          { icon: Clock, label: '今すぐ呼べる' },
          { icon: Heart, label: 'お気に入り' },
          { icon: Star, label: 'レビュー' },
        ].map((item, i) => (
          <button 
            key={i}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <item.icon className="w-5 h-5 text-rose-400" />
            <span className="text-gray-700">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <button className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-md">
          店舗様ログイン
        </button>
      </div>
    </div>
  </>
);

// モーダル（店舗詳細）
const ShopModal = ({ shop, onClose }) => {
  if (!shop) return null;

  const tags = shop.seo_tags || [];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-bold text-lg">{shop.shop_name}</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{shop.shop_name}</h2>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {shop.area_name}エリア
              </div>
            </div>
          </div>

          {shop.main_concept && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-700">{shop.main_concept}</p>
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-full text-sm font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {shop.twitter_id && (
            <a
              href={`https://x.com/${shop.twitter_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-300/50 text-lg flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Xで詳細を見る
            </a>
          )}
        </div>
      </div>
    </>
  );
};

// メインアプリ
export default function EstheNow() {
  const [activeTab, setActiveTab] = useState('nearby');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedArea, setSelectedArea] = useState('all');

  const { shops, areas, loading, error } = useShops(selectedArea);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuClick={() => setMenuOpen(true)}
        areas={areas}
        selectedArea={selectedArea}
        onAreaChange={setSelectedArea}
      />

      {/* メインコンテンツ */}
      <main className="pt-28 pb-24 px-3">
        {/* セクションヘッダー */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Sparkles className="w-5 h-5 text-rose-500 mr-1" />
            店舗一覧
          </h2>
          <span className="text-xs text-gray-500">{shops.length}件</span>
        </div>

        {/* ローディング */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="text-center py-12 text-gray-500">
            データの取得に失敗しました
          </div>
        )}

        {/* グリッドレイアウト */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-3">
            {shops.map((shop, index) => (
              <ShopCard
                key={shop.twitter_id || index}
                shop={shop}
                onClick={setSelectedShop}
              />
            ))}
          </div>
        )}

        {/* 結果なし */}
        {!loading && !error && shops.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            店舗が見つかりませんでした
          </div>
        )}
      </main>

      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <ShopModal shop={selectedShop} onClose={() => setSelectedShop(null)} />
      
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
