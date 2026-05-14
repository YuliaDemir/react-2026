import { PRODUCTS_PER_PAGE } from "../../constants";
import { useAppState } from "../../utils/hooks/use-app-state";
import styles from './pagination.module.scss';

export const Pagination = ({ query }: { query: string }) => {
    const { data, isLoading, error, page, total, setPage } = useAppState(query);

    return (<>
        <button
            className={styles.paginationButton}
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
        >
            Previous
        </button>

        {!error && !isLoading && <p className={styles.pageInfo}>
            Page: {page} from {total ? Math.ceil(total / PRODUCTS_PER_PAGE) : 'all products'}
        </p>}

        <button
            className={styles.paginationButton}
            onClick={() => setPage(page + 1)}
            disabled={data.length < 10}
        >
            Next
        </button>
    </>)
}