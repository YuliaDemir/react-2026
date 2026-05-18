import { PRODUCTS_PER_PAGE } from "@const";
import { OpenCloseDetailsLink } from "@components";
import styles from './pagination.module.scss';
import classNames from "classnames";

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
            className={classNames(styles.paginationButton, {
                [styles.disabled]: isFirstPage,
            })}
            page={Math.max(page - 1, 1)}
        >
            Previous
        </OpenCloseDetailsLink>

        <p className={styles.pageInfo}>
            Page: {page} from {total ? maxPage : 'all products'}
        </p>

        <OpenCloseDetailsLink
            className={classNames(styles.paginationButton, {
                [styles.disabled]: isLastPage,
            })}
            page={Math.min(page + 1, maxPage)}
        >
            Next
        </OpenCloseDetailsLink>
    </>)
}