import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { Search, CardList, ThrowErrorButton } from '../../components';
import { useAppState } from '../../utils/hooks/use-app-state';
import { useDetalisation } from '../../utils/hooks/use-detalisation';

import styles from './products-page.module.scss';
import { ContentState } from '../../components/content-state/content-state';
import { Pagination } from '../../components/pagination/pagination';
import { useLocalStorage } from '../../utils/hooks/use-local-storage-hook';
import { LOCAL_STORAGE_KEY } from '../../constants';

export const ProductsPage = () => {
    const [lsValue, setLSValue] = useLocalStorage(LOCAL_STORAGE_KEY);
    const [query, setQuery] = useState<string>(lsValue);
    const { detailsId } = useDetalisation();

    const { data, isLoading, error, fatalError, setFatalError, setPage } =
        useAppState(query);

    if (fatalError) {
        throw fatalError;
    }

    const handleSearch = (value: string) => {
        setPage(1);
        setQuery(value);
        setLSValue(value);
    };

    const isDetailsOpen = Boolean(detailsId);

    useEffect(() => {
        handleSearch(query);
    }, []);

    return (
        <div className={styles.page}>
            <Search onSearch={handleSearch} query={lsValue} />
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