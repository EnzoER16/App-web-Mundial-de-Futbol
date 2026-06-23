import { useState, useEffect, useCallback } from "react";

export function useFetch(fetchFn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Ocurrió un error al consultar la API"
            );
        } finally {
            setLoading(false);
        }

    }, deps);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData, setData };
}

export default useFetch;