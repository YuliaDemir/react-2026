import { useState } from 'react';
import { useLocalStorage } from '../../utils/hooks/use-local-storage-hook';
import { searchPlaceholder } from '../../constants';

export const Search = () => {
  const [query, setQuery] = useLocalStorage('query');
  const [value, setValue] = useState(query);

  return (
    <form className="search-panel">
      <input
        className="search-input"
        type="text"
        value={value}
        placeholder={searchPlaceholder}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        className="search-button"
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          setQuery(value);
        }}
      >
        Search
      </button>
    </form>
  );
}
