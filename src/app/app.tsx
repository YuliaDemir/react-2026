import { Link, Navigate, Route, Routes } from 'react-router';


import styles from './app.module.scss';
import { AboutPage, NotFoundPage, ProductsPage } from '../pages';
import { ProductDetails } from '../components/product-detail/product-detail';

export const App = () => {
  return (
    <div className={styles.app}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.navLink} to="/products?page=1">
          Products
        </Link>

        <Link className={styles.navLink} to="/about">
          About
        </Link>
      </nav>

      <main className={styles.shell}>
        <Routes>
          <Route path="/" element={<Navigate to="/products?page=1" replace />} />

          <Route path="/products" element={<ProductsPage />}>
            <Route index element={<ProductDetails />} />
          </Route>

          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};