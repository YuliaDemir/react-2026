import { useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router';

import { Search, CardList, ContentState, Pagination } from '@components';
import { useDetalisation } from '@/utils/hooks/use-detalisation';

import styles from './products-page.module.scss';
import { useLocalStorage } from '@/utils/hooks/use-local-storage-hook';
import { EMPTY_PRODUCTS, LOCAL_STORAGE_KEY } from '@const';
import { getToForLink } from '@/utils/get-to-for-link';
import classNames from 'classnames';
import { SelectedItemsBlock } from '@/components/selected-items-flyout/selected-items-flyout';
import { useTheme } from '@/dark-light-theme/use-theme';
import { useApiRequest } from '@/utils/hooks/use-api-request';

export const ProductsPage = () => {
    const [lsValue, setLSValue] = useLocalStorage(LOCAL_STORAGE_KEY);
    const [query, setQuery] = useState<string>(lsValue);

    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);

    const { detailsId } = useDetalisation();
    const navigate = useNavigate();
    const to = getToForLink(undefined, 1);

    const { data: { products, total } = EMPTY_PRODUCTS, isFetching: isLoading, error } =
        useApiRequest(query, page);

    const handleSearch = (value: string) => {
        navigate(to);
        setQuery(value);
        setLSValue(value);
    };

    const isDetailsOpen = Boolean(detailsId);

    const { theme } = useTheme();

    return (<>
        <div className={classNames(styles.page, theme === 'dark' && 'dark')}>
            <Search onSearch={handleSearch} query={lsValue} />

            <div
                className={classNames(styles.resultsBlock, {
                    [styles.resultsBlockWithOutlet]: isDetailsOpen,
                })}
            >
                <ContentState error={error} isLoading={isLoading}>
                    <div className={styles.listBlock}>
                        <CardList data={products} />
                    </div>

                    {isDetailsOpen && (
                        <div className={styles.outletBlock}>
                            <Outlet context={{ detailsId }} />
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Pagination page={page} total={total} />
                    </div>
                </ContentState>
            </div>
        </div>
        <SelectedItemsBlock />
    </>
    );
};