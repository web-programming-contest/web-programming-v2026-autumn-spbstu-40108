import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export function AppLayout(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
