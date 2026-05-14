import type { Product } from '../../types/interfaces';
import { Card } from '../card/card';

import styles from './card-list.module.scss';

export type Props = {
  data: Product[];
  onCardClick: (id: number) => void;
  isTwoColumns?: boolean;
}

export const CardList = ({
  data,
  onCardClick,
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
            <button
              data-product-card
              className={styles.cardButton}
              type="button"
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();
                onCardClick(card.id);
              }}
            >
              <Card
                title={card.title}
                description={card.description}
                images={card.images}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
};