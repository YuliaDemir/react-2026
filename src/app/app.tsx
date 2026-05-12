import { Link, Navigate, Route, Routes } from 'react-router';

import { ProductsPage } from '../pages/products-page/products-page';
import { AboutPage } from '../pages/about-page/about-page';
import { NotFoundPage } from '../pages/not-found-page/not-found-page';

import styles from './app.module.scss';

export const App = () => {
  return (
    <div className={styles.app}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.navLink} to="/products">
          Products
        </Link>

        <Link className={styles.navLink} to="/about">
          About
        </Link>
      </nav>

      <main className={styles.shell}>
        <Routes>
          <Route path="/" element={<Navigate to="/products?page=1" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};