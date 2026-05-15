import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router';

import { Search, CardList } from '../../components';
import { useAppState } from '../../utils/hooks/use-app-state';
import { useDetalisation } from '../../utils/hooks/use-detalisation';

import styles from './products-page.module.scss';
import { ContentState } from '../../components/content-state/content-state';
import { Pagination } from '../../components/pagination/pagination';
import { useLocalStorage } from '../../utils/hooks/use-local-storage-hook';
import { LOCAL_STORAGE_KEY } from '../../constants';
import { getToForLink } from '../../utils/get-to-for-link';

export const ProductsPage = () => {
    const [lsValue, setLSValue] = useLocalStorage(LOCAL_STORAGE_KEY);
    const [query, setQuery] = useState<string>(lsValue);

    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);

    const { detailsId } = useDetalisation();
    const navigate = useNavigate();
    const to = getToForLink(undefined, 1);

    const { data, isLoading, error, total } =
        useAppState(query, page);

    const handleSearch = (value: string) => {
        navigate(to);
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

            <div
                className={`${styles.resultsBlock} ${isDetailsOpen ? styles.resultsBlockWithOutlet : ''}`}
            >
                <ContentState error={error} isLoading={isLoading}>
                    <CardList
                        data={data}
                    />
                </ContentState>

                {isDetailsOpen && <Outlet context={{ detailsId }} />}
            </div>

            <div className={styles.actions}>
                {!error && !isLoading && <Pagination page={page} total={total} />}
            </div>
        </div>
    );
};