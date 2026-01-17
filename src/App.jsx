import React, { useState } from 'react';
import { MapPin, Menu, Search, Heart, Star, Clock, Sparkles, Navigation, TrendingUp, UserPlus, X } from 'lucide-react';

// ダミーデータ
const therapists = [
  {
    id: 1,
    name: 'あいり',
    age: 24,
    area: '渋谷',
    status: 'now',
    statusText: '今すぐOK',
    tags: ['#スレンダー', '#清楚'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=533&fit=crop&crop=face',
    rating: 4.9,
    reviewCount: 128
  },
  {
    id: 2,
    name: 'みく',
    age: 22,
    area: '新宿',
    status: 'last',
    statusText: '残り1枠',
    tags: ['#癒し系', '#巨乳'],
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=533&fit=crop&crop=face',
    rating: 4.8,
    reviewCount: 95
  },
  {
    id: 3,
    name: 'りな',
    age: 26,
    area: '池袋',
    status: 'now',
    statusText: '今すぐOK',
    tags: ['#美脚', '#大人系'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=533&fit=crop&crop=face',
    rating: 4.7,
    reviewCount: 203
  },
  {
    id: 4,
    name: 'ゆあ',
    age: 21,
    area: '恵比寿',
    status: 'soon',
    statusText: '18:00〜',
    tags: ['#ロリ系', '#愛嬌◎'],
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=533&fit=crop&crop=face',
    rating: 4.9,
    reviewCount: 67
  },
  {
    id: 5,
    name: 'さくら',
    age: 25,
    area: '六本木',
    status: 'now',
    statusText: '今すぐOK',
    tags: ['#モデル系', '#美肌'],
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=533&fit=crop&crop=face',
    rating: 5.0,
    reviewCount: 312
  },
  {
    id: 6,
    name: 'ひなた',
    age: 23,
    area: '銀座',
    status: 'last',
    statusText: '残り1枠',
    tags: ['#Eカップ', '#笑顔'],
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=533&fit=crop&crop=face',
    rating: 4.6,
    reviewCount: 89
  },
  {
    id: 7,
    name: 'まお',
    age: 27,
    area: '品川',
    status: 'now',
    statusText: '今すぐOK',
    tags: ['#お姉さん', '#テク◎'],
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=533&fit=crop&crop=face',
    rating: 4.8,
    reviewCount: 445
  },
  {
    id: 8,
    name: 'えみ',
    age: 20,
    area: '渋谷',
    status: 'soon',
    statusText: '19:00〜',
    tags: ['#新人', '#敏感'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=533&fit=crop&crop=face',
    rating: 4.5,
    reviewCount: 23
  }
];

// ステータスバッジコンポーネント
const StatusBadge = ({ status, text }) => {
  const styles = {
    now: 'bg-gradient-to-r from-rose-500 to-pink-500 animate-pulse',
    last: 'bg-gradient-to-r from-amber-500 to-orange-500',
    soon: 'bg-gradient-to-r from-slate-500 to-slate-600'
  };
  
  return (
    <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded-full shadow-lg ${styles[status]}`}>
      {status === 'now' && <Clock className="inline w-3 h-3 mr-1" />}
      {text}
    </span>
  );
};

// セラピストカードコンポーネント
const TherapistCard = ({ therapist, onClick }) => {
  const [liked, setLiked] = useState(false);
  
  return (
    <div 
      className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(therapist)}
    >
      {/* 画像コンテナ */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={therapist.image} 
          alt={therapist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* ステータスバッジ */}
        <StatusBadge status={therapist.status} text={therapist.statusText} />
        
        {/* お気に入りボタン */}
        <button 
          className="absolute top-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </button>
        
        {/* 下部情報 */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-lg tracking-wide">
              {therapist.name}
              <span className="text-sm font-normal opacity-90 ml-1">({therapist.age})</span>
            </h3>
            <div className="flex items-center text-xs bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-0.5" />
              {therapist.rating}
            </div>
          </div>
          
          <div className="flex items-center text-xs opacity-90 mb-1.5">
            <MapPin className="w-3 h-3 mr-0.5" />
            {therapist.area}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {therapist.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ヘッダーコンポーネント
const Header = ({ onMenuClick }) => (
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
      {['すべて', '渋谷', '新宿', '池袋', '六本木', '銀座', '恵比寿', '品川'].map((area, i) => (
        <button 
          key={area}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            i === 0 
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {area}
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

// モーダル（セラピスト詳細）
const TherapistModal = ({ therapist, onClose }) => {
  if (!therapist) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-bold text-lg">{therapist.name}のプロフィール</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <img 
            src={therapist.image} 
            alt={therapist.name}
            className="w-full aspect-[3/4] object-cover rounded-2xl mb-4"
          />
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{therapist.name} <span className="text-lg font-normal text-gray-500">({therapist.age})</span></h2>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {therapist.area}エリア
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-amber-500">
                <Star className="w-5 h-5 fill-amber-400" />
                <span className="text-xl font-bold ml-1">{therapist.rating}</span>
              </div>
              <span className="text-xs text-gray-400">{therapist.reviewCount}件のレビュー</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {therapist.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
          
          <button className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-300/50 text-lg">
            {therapist.status === 'now' ? '📞 今すぐ予約する' : '🕐 予約リクエスト'}
          </button>
        </div>
      </div>
    </>
  );
};

// メインアプリ
export default function EstheNow() {
  const [activeTab, setActiveTab] = useState('nearby');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setMenuOpen(true)} />
      
      {/* メインコンテンツ */}
      <main className="pt-28 pb-24 px-3">
        {/* 今すぐOKセクション */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Clock className="w-5 h-5 text-rose-500 mr-1" />
            今すぐ呼べる
          </h2>
          <span className="text-xs text-rose-500 font-medium">もっと見る →</span>
        </div>
        
        {/* グリッドレイアウト */}
        <div className="grid grid-cols-2 gap-3">
          {therapists.map(therapist => (
            <TherapistCard 
              key={therapist.id} 
              therapist={therapist}
              onClick={setSelectedTherapist}
            />
          ))}
        </div>
      </main>
      
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <TherapistModal therapist={selectedTherapist} onClose={() => setSelectedTherapist(null)} />
      
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
