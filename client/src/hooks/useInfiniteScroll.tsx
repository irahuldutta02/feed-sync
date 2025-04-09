
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  initialPage?: number;
  delay?: number;
}

export function useInfiniteScroll({
  threshold = 200,
  initialPage = 1,
  delay = 500,
}: UseInfiniteScrollOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      loadingRef.current = true;
      setLoading(true);
      
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set a timeout to prevent too many rapid increments
      timerRef.current = setTimeout(() => {
        setPage(prevPage => prevPage + 1);
        setLoading(false);
        loadingRef.current = false;
      }, delay);
    }
  }, [hasMore, delay]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      loadMore();
    }
  }, [loadMore, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleScroll]);

  return {
    page,
    loading,
    setLoading,
    hasMore,
    setHasMore,
    loadMore,
    setPage,
  };
}
