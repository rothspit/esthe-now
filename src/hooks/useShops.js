import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useShops(areaSlug = null) {
  const [shops, setShops] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areasWithData, setAreasWithData] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 全店舗からデータがあるエリアを取得
  useEffect(() => {
    async function fetchAreasWithData() {
      try {
        const { data, error: fetchError } = await supabase
          .from('v_shops_with_area')
          .select('area_slug');

        if (fetchError) throw fetchError;

        const slugs = new Set(data?.map(s => s.area_slug).filter(Boolean) || []);
        setAreasWithData(slugs);
      } catch (err) {
        console.error('Error fetching areas with data:', err);
      }
    }

    fetchAreasWithData();
  }, []);

  useEffect(() => {
    async function fetchShops() {
      try {
        setLoading(true);

        // v_shops_with_area ビューは既に is_active = true でフィルタリング済み
        // 万が一ビューが変更された場合に備えて、直接テーブルから取得する場合は
        // .eq('is_active', true) を追加すること
        let query = supabase
          .from('v_shops_with_area')
          .select('*');

        if (areaSlug && areaSlug !== 'all') {
          query = query.eq('area_slug', areaSlug);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        setShops(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching shops:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, [areaSlug]);

  useEffect(() => {
    async function fetchAreas() {
      try {
        // アクティブなエリアのみ取得
        const { data, error: fetchError } = await supabase
          .from('areas')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (fetchError) throw fetchError;

        setAreas(data || []);
      } catch (err) {
        console.error('Error fetching areas:', err);
      }
    }

    fetchAreas();
  }, []);

  return { shops, areas, areasWithData, loading, error };
}
