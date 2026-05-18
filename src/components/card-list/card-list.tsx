import type { Product } from '../../types/interfaces';
import { Card, OpenCloseDetailsLink } from '@components';

import styles from './card-list.module.scss';

export type Props = {
  data: Product[];
}

export const CardList = ({
  data,
}: Props) => {
  return (
    <ul className={styles.list}>
      {data.map((product) => {
        return (
          <li className={styles.item} key={product.id} data-testid="card">
            <OpenCloseDetailsLink
              data-product-card
              className={styles.cardButton}
              id={product.id}
            >
              <Card
                product={product}
              />
            </OpenCloseDetailsLink>
          </li>
        );
      })}
    </ul>
  );
};