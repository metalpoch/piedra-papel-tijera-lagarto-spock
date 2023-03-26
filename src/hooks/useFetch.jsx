import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    if (url) {
      fetch(url, { signal: abortController.signal })
        .then((res) => res.json())
        .then((res) => setData(res))
        .finally(() => setLoading(false))
        .catch((error) => {
          if (error.name === "AbortError") {
            console.warn("Aborted Request");
          } else {
            setError(error);
          }
        });
    } else {
      setLoading(false);
      return;
    }

    return () => abortController.abort();
  }, [url]);

  return { data, error, loading };
};

export default useFetch;
