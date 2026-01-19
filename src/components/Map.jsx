// components/Map.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ExternalLink } from 'lucide-react';

// Leaflet アイコンの画像パス問題を修正
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// カスタムゴールドマーカーアイコン（esthe-nowのテーマに合わせる）
const goldIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path fill="#d4af37" stroke="#b8960c" stroke-width="1" d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24C24 5.4 18.6 0 12 0z"/>
      <circle fill="#FFF" cx="12" cy="12" r="5"/>
    </svg>
  `),
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

export default function Map({ shops, center = [35.6762, 139.6503], zoom = 12 }) {
  // 有効な位置情報を持つ店舗のみフィルタリング（安全対策）
  const validShops = shops.filter(
    (shop) => shop.lat != null && shop.lng != null &&
              !isNaN(shop.lat) && !isNaN(shop.lng)
  );

  // 店舗がある場合、最初の店舗を中心に
  const mapCenter = validShops.length > 0
    ? [validShops[0].lat, validShops[0].lng]
    : center;

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full rounded-2xl"
      style={{ minHeight: '500px' }}
    >
      {/* OpenStreetMap タイル */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 店舗マーカー */}
      {validShops.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.lat, shop.lng]}
          icon={goldIcon}
        >
          <Popup>
            <div className="min-w-[200px] p-1">
              {/* 店名 */}
              <h3 className="font-bold text-gray-800 text-base mb-1">
                {shop.shop_name}
              </h3>

              {/* エリア */}
              {shop.area_name && (
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  {shop.area_name}
                </div>
              )}

              {/* コンセプト */}
              {shop.main_concept && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {shop.main_concept}
                </p>
              )}

              {/* 詳細リンク */}
              <a
                href={`/shops/${shop.id}`}
                className="block w-full text-center py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-sm font-medium rounded-lg hover:from-amber-400 hover:to-yellow-400 transition-all"
              >
                詳細を見る
              </a>

              {/* 公式サイトリンク */}
              {shop.website_url && (
                <a
                  href={shop.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 mt-2 text-xs text-amber-600 hover:text-amber-700"
                >
                  <ExternalLink className="w-3 h-3" />
                  公式サイト
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
