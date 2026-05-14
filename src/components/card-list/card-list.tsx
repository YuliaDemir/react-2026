import type { ListProps } from '../../types/props';
import { Card } from '../card/card';

import styles from './card-list.module.scss';

export const CardList = ({
  data,
  onCardClick,
  isTwoColumns = false,
}: ListProps) => {
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
              className={styles.cardButton}
              type="button"
              onClick={() => onCardClick(card.id)}
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