import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useShop(id) {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchShop() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from('v_shops_with_area')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        setShop(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching shop:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchShop();
  }, [id]);

  return { shop, loading, error };
}
