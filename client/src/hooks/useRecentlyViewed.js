import { useState, useEffect } from 'react';

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    }
  }, []);

  const addToRecentlyViewed = (product) => {
    const updated = [
      product,
      ...recentlyViewed.filter(p => p.id !== product.id)
    ].slice(0, 10);
    
    setRecentlyViewed(updated);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  return { recentlyViewed, addToRecentlyViewed };
};
