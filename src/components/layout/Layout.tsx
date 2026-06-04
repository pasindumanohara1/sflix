import { type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LoginModal from '../common/LoginModal';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="site-wrapper">
      <Header />
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <LoginModal />

      <style>{`
        .site-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          padding-top: 60px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
