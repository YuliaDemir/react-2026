import { useState } from 'react';
import { useLocalStorage } from '../../utils/hooks/use-local-storage-hook';
import { SEARCH_PLACEHOLDER } from '../../constants';


// Адекватный ли по тупости компонент? Или надо делать еще тупее?

export const Search = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useLocalStorage('query');
  const [value, setValue] = useState(query);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = value.trim().toLowerCase();

    if (trimmedQuery === query) {
      return;
    }

    if (!trimmedQuery) {
      return;
    }

    setQuery(trimmedQuery);
    onSearch(trimmedQuery);
  }

  return (
    <form className="search-panel" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        value={value}
        placeholder={SEARCH_PLACEHOLDER}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        className="search-button"
        type="submit"
      >
        Search
      </button>
    </form>
  );
}
