import { useEffect, useState } from 'react';

import './App.css';

import type { ApiResponse, AppState } from '../../types/interfaces';
import { Loader, Search, CardList, ThrowErrorButton } from '..';
import { getAllProductsPerPage, searchProductsByName } from '../../utils/fetch-data';
import { ErrorDisplay } from '../error-display/error-display';



export const App = () => {
  const [state, setState] = useState<'' | 'error' | 'loading' | 'success'>('');
  const [data, setData] = useState<AppState['data']>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      setState('loading');

      try {
        const data: ApiResponse = query
          ? await searchProductsByName(query)
          : await getAllProductsPerPage(1);

        setData(data.products);
        setState('success');
      } catch (err) {
        console.log(err);//errorHandler(err);
        setState('error');
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="container">
      <Search onSearch={setQuery} />
      {state === 'error' ? <ErrorDisplay /> : state === 'loading' ? <Loader /> : <CardList data={data} />}
      <ThrowErrorButton />
    </div>
  );
}

