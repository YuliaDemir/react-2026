import type { Product } from '../../types/interfaces';
import { Card } from '../card/card';
import { OpenCloseDetailsLink } from '../open-close-link/open-close-link';

import styles from './card-list.module.scss';

export type Props = {
  data: Product[];
  isTwoColumns?: boolean;
}

export const CardList = ({
  data,
  isTwoColumns = false,
}: Props) => {
  const listClassName = [
    styles.list,
    isTwoColumns ? styles.listTwoColumns : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ul className={listClassName}>
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