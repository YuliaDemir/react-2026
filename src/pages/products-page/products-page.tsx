import { useState } from 'react';
import { Outlet } from 'react-router';

import { Search, CardList, ThrowErrorButton } from '../../components';
import { useAppState } from '../../utils/hooks/use-app-state';
import { useDetalisation } from '../../utils/hooks/use-detalisation';
import { PRODUCTS_PER_PAGE } from '../../constants';

import styles from './products-page.module.scss';
import { ContentState } from '../../components/content-state/content-state';

export const ProductsPage = () => {
    const [query, setQuery] = useState<string>('');
    const { detailsId, openDetails, closeDetails } = useDetalisation();

    const { data, isLoading, error, fatalError, setFatalError, page, setPage, total } =
        useAppState(query);

    if (fatalError) {
        throw fatalError;
    }

    const handleSearch = (value: string) => {
        setPage(1);
        setQuery(value);
    };

    const isDetailsOpen = Boolean(detailsId);

    return (
        <div className={styles.page}>
            <Search onSearch={handleSearch} />

            <>
                {!error && !isLoading && <p className={styles.pageInfo}>
                    Page: {page} from {total ? Math.ceil(total / PRODUCTS_PER_PAGE) : 'all products'}
                </p>}

                <div
                    className={`${styles.resultsBlock} ${isDetailsOpen ? styles.resultsBlockWithOutlet : ''
                        }`}
                >

                    <ContentState error={error} isLoading={isLoading}>
                        <CardList
                            data={data}
                            onCardClick={openDetails}
                            isTwoColumns={isDetailsOpen}
                        />
                    </ContentState>

                    <div className={styles.outletBlock}>
                        <Outlet context={{ closeDetails }} />
                    </div>

                </div>
            </>


            <div className={styles.actions}>
                <button
                    onMouseDown={(event) => event.stopPropagation()}
                    className={styles.paginationButton}
                    onClick={() => setPage(Math.max(page - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <ThrowErrorButton handleClick={() => setFatalError(new Error('Simulated fatal error'))} />

                <button
                    onMouseDown={(event) => event.stopPropagation()}
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