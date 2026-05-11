import { useState } from 'react';

import './App.css';

import { Loader, Search, CardList, ThrowErrorButton } from '..';
import { ErrorDisplay } from '../error-display/error-display';
import { useAppState } from '../../utils/hooks/use-app-state';

export const App = () => {
  const [query, setQuery] = useState<string>('');
  const { data, isLoading, error, fatalError, setFatalError, page, setPage } = useAppState(query);

  if (fatalError) {
    throw fatalError;
  }

  const handleSearch = (value: string) => {
    setPage(1);
    setQuery(value);
  };

  return (
    <div className="container">
      <Search onSearch={handleSearch} />
      {error ? <ErrorDisplay error={error} /> : isLoading ? <Loader /> : <CardList data={data} />}
      <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} >Previous</button>
      <ThrowErrorButton handleClick = {() => setFatalError(new Error("Simulated fatal error"))}/>
      <button onClick={() => setPage((prev) => prev + 1)} disabled={data.length < 10} >Next</button>
    </div>
  );
}

