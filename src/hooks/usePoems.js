import { useState, useEffect } from 'react';
import { fetchPoems } from '../lib/fetchPoems';

export const usePoems = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPoems = async () => {
      try {
        const data = await fetchPoems();
        setPoems(data);
      } catch (error) {
        console.error('Error fetching poems:', error);
      } finally {
        setLoading(false);
      }
    };

    getPoems();
  }, []);

  return { poems, loading };
};
