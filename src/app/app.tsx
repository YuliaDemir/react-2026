import './App.css';

import { Link, Navigate, Route, Routes } from 'react-router';
import { ProductsPage } from '../pages/products-page/products-page';
import { AboutPage } from '../pages/about-page/about-page';
import { NotFoundPage } from '../pages/not-found-page/not-found-page';

export const App = () => {
  return (
    <>
      <nav>
        <Link to="/products">Products</Link>
        {" | "}
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};
