import type { Product } from '../../types/interfaces';

import styles from './card.module.scss';

type Props = Pick<Product, 'title' | 'description' | 'images'>;;

export const Card = ({ title, description, images }: Props) => {

  return (
    <div className={styles.card}>
      <img className={styles.image} src={images[0]} alt={title} />

      <div className={styles.title}>{title}</div>

      <div className={styles.description}>{description}</div>
    </div>
  );
};
