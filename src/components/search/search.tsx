import { useState } from 'react';

import styles from './search.module.scss';

const SEARCH_PLACEHOLDER = "Search items by name (e.g., Mascara, Lipstick, etc.)...";

type Props = {
  onSearch: (query: string) => void;
  query: string;
}

export const Search = ({ onSearch, query }: Props) => {
  const [value, setValue] = useState(query);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = value.trim().toLowerCase();

    if (trimmedQuery === query) {
      return;
    }

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