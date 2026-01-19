// components/ViewToggle.jsx
import { useState, lazy, Suspense } from 'react';
import { List, Map as MapIcon } from 'lucide-react';

// 地図コンポーネントを遅延読み込み
const Map = lazy(() => import('./Map'));

export default function ViewToggle({ shops, children }) {
  const [viewMode, setViewMode] = useState('list');

  // 位置情報がある店舗のみ抽出（null/undefined/NaN をすべて除外）
  const shopsWithLocation = shops.filter(
    (shop) => shop.lat != null && shop.lng != null &&
              !isNaN(shop.lat) && !isNaN(shop.lng)
  );

  return (
    <div>
      {/* 表示切替ボタン */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            viewMode === 'list'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md'
              : 'bg-white/10 text-amber-400 border border-amber-500/50 hover:bg-amber-500/20'
          }`}
        >
          <List className="w-4 h-4" />
          リスト
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            viewMode === 'map'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md'
              : 'bg-white/10 text-amber-400 border border-amber-500/50 hover:bg-amber-500/20'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          地図
          {shopsWithLocation.length > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              viewMode === 'map' ? 'bg-black/20' : 'bg-amber-500/30 text-amber-400'
            }`}>
              {shopsWithLocation.length}
            </span>
          )}
        </button>
      </div>

      {/* コンテンツ表示 */}
      {viewMode === 'list' ? (
        // リスト表示（children として渡されたグリッド）
        children
      ) : (
        // 地図表示
        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          {shopsWithLocation.length > 0 ? (
            <Suspense fallback={
              <div className="h-[500px] flex items-center justify-center bg-neutral-900">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-neutral-400 text-sm">地図を読み込み中...</p>
                </div>
              </div>
            }>
              <div className="h-[500px]">
                <Map shops={shopsWithLocation} />
              </div>
            </Suspense>
          ) : (
            <div className="h-[500px] flex items-center justify-center bg-neutral-900">
              <div className="text-center">
                <MapIcon className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400">位置情報のある店舗がありません</p>
                <p className="text-sm text-neutral-500 mt-2">リスト表示でご確認ください</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
