import { PRODUCTS_PER_PAGE } from "../../constants";
import { useAppState } from "../../utils/hooks/use-app-state";
import { OpenCloseDetailsLink } from "../open-close-link/open-close-link";
import styles from './pagination.module.scss';

export const Pagination = ({ query }: { query: string }) => {
    const { isLoading, error, page, total } = useAppState(query);

    return (<>
        <OpenCloseDetailsLink
            className={styles.paginationButton}
            page={Math.max(page - 1, 1)}
        >
            Previous
        </OpenCloseDetailsLink>

        {!error && !isLoading && <p className={styles.pageInfo}>
            Page: {page} from {total ? Math.ceil(total / PRODUCTS_PER_PAGE) : 'all products'}
        </p>}

        <OpenCloseDetailsLink
            className={styles.paginationButton}
            page={page + 1}
        >
            Next
        </OpenCloseDetailsLink>
    </>)
}