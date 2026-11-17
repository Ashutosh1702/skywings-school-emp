import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useApiQuery - Dynamic React Hook for Axios GET API queries
 * 
 * Provides:
 * - data: Extracted response from MongoDB / Express via Axios
 * - loading: Initial and query loading states
 * - error: Detailed error object if API call fails
 * - refetch: Function to dynamically invalidate and refresh data
 * - isRefetching: State indicating background refresh
 */
export const useApiQuery = (queryFn, dependencies = [], options = {}) => {
  const { enabled = true, initialData = null, onSuccess, onError } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const executeFetch = useCallback(
    async (isBackground = false) => {
      if (!isMountedRef.current) return;

      if (isBackground) {
        setIsRefetching(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await queryFn();
        if (!isMountedRef.current) return;

        // Extract payload
        const payload = response?.data !== undefined ? response.data : response;
        setData(payload);

        if (onSuccess) onSuccess(payload);
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err);
        if (onError) onError(err);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setIsRefetching(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...dependencies]
  );

  useEffect(() => {
    if (enabled) {
      executeFetch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...dependencies]);

  const refetch = useCallback(() => {
    return executeFetch(true);
  }, [executeFetch]);

  return {
    data,
    loading,
    isRefetching,
    error,
    refetch,
    setData,
  };
};

export default useApiQuery;

