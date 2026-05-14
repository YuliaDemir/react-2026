import type { Product } from '../../types/interfaces';

import styles from './card.module.scss';

type Props = Pick<Product, 'title' | 'description' | 'images'>;;

export const Card = (data: Props) => {
  
  return (
    <div className={styles.card}>
      <img className={styles.image} src={data.images[0]} alt={data.title} />

      <div className={styles.title}>{data.title}</div>

      <div className={styles.description}>{data.description}</div>
    </div>
  );
};
