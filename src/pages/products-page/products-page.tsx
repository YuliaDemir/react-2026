import { useState } from 'react';
import { Outlet } from 'react-router';

import { Search, CardList, ThrowErrorButton } from '../../components';
import { useAppState } from '../../utils/hooks/use-app-state';
import { useDetalisation } from '../../utils/hooks/use-detalisation';

import styles from './products-page.module.scss';
import { ContentState } from '../../components/content-state/content-state';
import { Pagination } from '../../components/pagination/pagination';

export const ProductsPage = () => {
    const [query, setQuery] = useState<string>('');
    const { detailsId } = useDetalisation();

    const { data, isLoading, error, fatalError, setFatalError, setPage } =
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
            <ThrowErrorButton handleClick={() => setFatalError(new Error('Simulated fatal error'))} />

            <div
                className={`${styles.resultsBlock} ${isDetailsOpen ? styles.resultsBlockWithOutlet : ''}`}
            >
                <ContentState error={error} isLoading={isLoading}>
                    <CardList
                        data={data}
                        isTwoColumns={isDetailsOpen}
                    />
                </ContentState>

                {isDetailsOpen && <Outlet context={{ detailsId }} />}
            </div>

            <div className={styles.actions}>
                <Pagination query={query} />
            </div>
        </div>
    );
};