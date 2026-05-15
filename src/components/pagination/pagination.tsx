import { PRODUCTS_PER_PAGE } from "../../constants";
import { OpenCloseDetailsLink } from "../open-close-link/open-close-link";
import styles from './pagination.module.scss';

type Props = {
    page: number,
    total: number,
}
export const Pagination = ({ page, total }: Props) => {
    const maxPage = Math.ceil(total / PRODUCTS_PER_PAGE);
    const isFirstPage = page <= 1;
    const isLastPage = page >= maxPage;

    return (<>
        <OpenCloseDetailsLink
            className={`${styles.paginationButton} ${isFirstPage && styles.disabled}`}
            page={Math.max(page - 1, 1)}
        >
            Previous
        </OpenCloseDetailsLink>

        <p className={styles.pageInfo}>
            Page: {page} from {total ? maxPage : 'all products'}
        </p>

        <OpenCloseDetailsLink
            className={`${styles.paginationButton} ${isLastPage && styles.disabled}`}
            page={Math.min(page + 1, maxPage)}
        >
            Next
        </OpenCloseDetailsLink>
    </>)
}