import type { ListProps } from '../../types/props';
import { Card } from '../card/card';

import styles from './card-list.module.scss';

export const CardList = ({ data }: ListProps) => {
  return (
    <div className={styles.main}>
      <ul className={styles.list}>
        {data.map((card) => {
          return (
            <li className={styles.item} key={card.id} data-testid="card">
              <Card
                id={card.id}
                title={card.title}
                description={card.description}
                images={card.images}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};