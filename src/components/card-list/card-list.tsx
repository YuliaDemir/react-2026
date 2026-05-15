import type { Product } from '../../types/interfaces';
import { Card } from '../card/card';
import { OpenCloseDetailsLink } from '../open-close-link/open-close-link';

import styles from './card-list.module.scss';

export type Props = {
  data: Product[];
}

export const CardList = ({
  data,
}: Props) => {
  return (
    <ul className={styles.list}>
      {data.map((card) => {
        return (
          <li className={styles.item} key={card.id} data-testid="card">
            <OpenCloseDetailsLink
              data-product-card
              className={styles.cardButton}
              id={card.id}
            >
              <Card
                title={card.title}
                description={card.description}
                images={card.images}
              />
            </OpenCloseDetailsLink>
          </li>
        );
      })}
    </ul>
  );
};