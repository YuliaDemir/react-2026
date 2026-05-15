import { Link, Navigate, Route, Routes } from 'react-router';


import styles from './app.module.scss';
import { AboutPage, NotFoundPage, ProductsPage } from '../pages';
import { SideCard } from '../components/side-card/side-card';
import { LINKS } from '../constants';
import { ProductInfo } from '../components/product-info/product-info';
import { ThrowErrorButton } from '../components';

export const App = () => {
  return (
    <div className={styles.app}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.navLink} to={LINKS.home}>
          Products
        </Link>

        <Link className={styles.navLink} to={LINKS.about}>
          About
        </Link>

        <ThrowErrorButton />
      </nav>

      <main className={styles.shell}>
        <Routes>
          <Route path="/" element={<Navigate to={LINKS.home} replace />} />

          <Route path="/products" element={<ProductsPage />}>
            <Route index element={
              <SideCard>
                <ProductInfo />
              </SideCard>
            } />
          </Route>

          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};