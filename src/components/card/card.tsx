import type { Product } from '../../types/interfaces';
import { SelectCheckbox } from '../select-checkbox/select-checkbox';

import styles from './card.module.scss';

type Props = { product: Product };

export const Card = ({ product }: Props) => {

  return (
    <div className={styles.card}>
      <div className={styles.checkbox}>
        <SelectCheckbox product={product} />
      </div>
      <img className={styles.image} src={product.image} alt={product.title} />

      <div className={styles.title}>{product.title}</div>

      <div className={styles.description}>{product.description}</div>
    </div>
  );
};
