import { useCallback, useEffect, useState } from "react";

export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    let ignore = false;
    // Set loading asynchronously
    Promise.resolve().then(() => {
      if (!ignore) {
        setLoading(true);
        setError(null);
      }
    });

    fetcher()
      .then((res) => {
        if (!ignore) setData(res);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetcher()
      .then((res) => setData(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [fetcher]);

  return { data, loading, error, reload };
}
