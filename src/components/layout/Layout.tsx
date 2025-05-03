import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ThemeProvider } from './ThemeContext';
import { usePrefetchCommonPages } from '../../utils/prefetch';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Prefetch common pages for faster navigation
  usePrefetchCommonPages();
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
