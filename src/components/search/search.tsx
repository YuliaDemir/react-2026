import { useState } from 'react';
import { useLocalStorage } from '../../utils/hooks/use-local-storage-hook';
import { SEARCH_PLACEHOLDER } from '../../constants';

import styles from './search.module.scss';

export const Search = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useLocalStorage('query');
  const [value, setValue] = useState(query);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = value.trim().toLowerCase();

    if (trimmedQuery === query) {
      return;
    }

    setQuery(trimmedQuery);
    onSearch(trimmedQuery);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} >
      <input
        className={styles.input}
        type="text"
        value={value}
        placeholder={SEARCH_PLACEHOLDER}
        onChange={(e) => setValue(e.target.value)}
      />

      <button className={styles.button} type="submit">
        Search
      </button>
    </form>
  );
};