import { Navigate, Route, Routes } from 'react-router';


import styles from './app.module.scss';
import { AboutPage, NotFoundPage, ProductsPage } from '@pages';
import { ProductInfo, SideCard, ThrowErrorButton } from '@components';
import { LINKS } from '@const';
import { ThemeSwitcher } from '@/components/theme-switcher/theme-switcher';
import { ButtonOrLink } from '@/components/button/button';

export const App = () => {
  return (
    <div className={styles.app}>
      <nav className={styles.nav} aria-label="Main navigation">
        <ThemeSwitcher />
        <ButtonOrLink variant="secondary" border="round" to={LINKS.home}>
          Products
        </ButtonOrLink>

        <ButtonOrLink variant="secondary" border="round" to={LINKS.about}>
          About
        </ButtonOrLink>

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