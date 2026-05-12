import { useState } from 'react';
import { Outlet } from 'react-router';

import { Loader, Search, CardList, ThrowErrorButton } from '../../components';
import { ErrorDisplay } from '../../components/error-display/error-display';
import { useAppState } from '../../utils/hooks/use-app-state';
import { useDetalisation } from '../../utils/hooks/use-detalisation';
import { PRODUCTS_PER_PAGE } from '../../constants';

import styles from './products-page.module.scss';

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
                <p className={styles.pageInfo}>
                    Page: {page} from {detailsId}
                    {total ? Math.ceil(total / PRODUCTS_PER_PAGE) : 'all products'}
                </p>

                <div
                    className={`${styles.resultsBlock} ${isDetailsOpen ? styles.resultsBlockWithOutlet : ''
                        }`}
                >

                    {error ? (
                        <ErrorDisplay error={error} />
                    ) : isLoading ? (
                        <Loader />
                    ) : (<div className={styles.cardsBlock}>
                        <CardList
                            data={data}
                            onCardClick={(id) => openDetails(String(id))}
                            isTwoColumns={isDetailsOpen}
                        />
                    </div>)}

                    {detailsId && (
                        <div className={styles.outletBlock}>
                            <Outlet context={{ closeDetails }} />
                        </div>
                    )}
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