import type { Product } from '../../types';
import styles from './card-list.module.scss';
import { ProductSectionCard } from '../product-section-card/product-section-card';

export type Props = {
  data: Product[];
}

export const CardList = ({
  data,
}: Props) => {

  return (
    <ul className={styles.list}>
      {data.map((product) => {
        return (
          <li className={styles.item} key={product.id} data-testid="card">
            <ProductSectionCard product={product} />
          </li>
        );
      })}
    </ul>
  );
};