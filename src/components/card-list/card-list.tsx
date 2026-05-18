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
      {data.map(({ id, title, image, description }) => {
        return (
          <li className={styles.item} key={id} data-testid="card">
            <OpenCloseDetailsLink
              data-product-card
              className={styles.cardButton}
              id={id}
            >
              <Card
                title={title}
                description={description}
                image={image}
              />
            </OpenCloseDetailsLink>
          </li>
        );
      })}
    </ul>
  );
};