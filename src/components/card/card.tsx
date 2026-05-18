import type { Product } from '../../types/interfaces';

import styles from './card.module.scss';

type Props = Pick<Product, 'title' | 'description' | 'image'>;;

export const Card = ({ title, description, image }: Props) => {

  return (
    <div className={styles.card}>
      <img className={styles.image} src={image} alt={title} />

      <div className={styles.title}>{title}</div>

      <div className={styles.description}>{description}</div>
    </div>
  );
};
