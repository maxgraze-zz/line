import { useCallback, useEffect, useState } from 'react';
import { csv } from 'd3';

export const useCsv = (url, formatRows, transformResponse) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await csv(url, formatRows);
      setData(transformResponse ? transformResponse(response) : response);
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  }, [url, formatRows, transformResponse]);

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, data };
};
