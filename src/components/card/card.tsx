import type { CardProps } from '../../types/props';

import styles from './card.module.scss';

export const Card = (data: CardProps) => {
  return (
    <div className={styles.card}>
      <img className={styles.image} src={data.images[0]} alt={data.title} />

      <div className={styles.title}>{data.title}</div>

      <div className={styles.description}>{data.description}</div>
    </div>
  );
};
