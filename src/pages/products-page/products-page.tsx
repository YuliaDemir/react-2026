import { useState } from 'react';

import { Loader, Search, CardList, ThrowErrorButton } from '../../components';
import { ErrorDisplay } from '../../components/error-display/error-display';
import { useAppState } from '../../utils/hooks/use-app-state';

import styles from './products-page.module.scss';
import { PRODUCTS_PER_PAGE } from '../../constants';

export const ProductsPage = () => {
    const [query, setQuery] = useState<string>('');

    const { data, isLoading, error, fatalError, setFatalError, page, setPage, total } = useAppState(query);

    if (fatalError) {
        throw fatalError;
    }

    const handleSearch = (value: string) => {
        setPage(1);
        setQuery(value);
    };

    return (
        <div className={styles.page}>
            <Search onSearch={handleSearch} />

            {error ? <ErrorDisplay error={error} /> : isLoading ? <Loader /> :
                <>
                    <p className={styles.pageInfo}>
                        Page: {page} from{' '}
                        {total ? Math.ceil(total / PRODUCTS_PER_PAGE) : 'all products'}
                    </p>
                    <CardList data={data} />
                </>
            }

            <div className={styles.actions}>
                <button
                    className={styles.paginationButton}
                    onClick={() => setPage(Math.max(page - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <ThrowErrorButton handleClick={() => setFatalError(new Error('Simulated fatal error'))} />

                <button
                    className={styles.paginationButton}
                    onClick={() => setPage(page + 1)}
                    disabled={data.length < 10}
                >
                    Next
                </button>
            </div>
        </div>
    );
};