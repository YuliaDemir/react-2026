import type { Product } from '../../types';

import styles from './card.module.scss';

type Props = {
  product: Product,
  Checkbox?: React.ReactNode
};

export const Card = ({ product, Checkbox }: Props) => {

  return (
    <div className={styles.card}>
      {Checkbox && (<div className={styles.checkbox}>
        {Checkbox}
      </div>)}
      <img className={styles.image} src={product.image} alt={product.title} />

      <div className={styles.title}>{product.title}</div>

      <div className={styles.description}>{product.description}</div>
    </div>
  );
};
