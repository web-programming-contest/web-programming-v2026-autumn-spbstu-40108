import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { buttonStyles } from '../ui/Button';
import { cn } from '../../utils/cn';

const navLinkStyles = ({ isActive }: { isActive: boolean }): string =>
  cn(
    'inline-flex h-12 items-center gap-2 rounded-lg px-4 text-base font-medium text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    isActive
      ? 'bg-primary-soft hover:bg-primary-soft active:bg-[#DCE7FF]'
      : 'hover:bg-surface active:bg-surfaceAlt',
  );

export function Header(): JSX.Element {
  const { user, isLoading, logout } = useAuth();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      navigate('/', { replace: true });
    }
  };

  const cartBadge =
    totalQuantity > 0 ? (
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-pink px-1.5 text-xs font-semibold leading-none text-white">
        {totalQuantity > 99 ? '99+' : totalQuantity}
      </span>
    ) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-20 max-w-[1288px] items-center justify-between px-6">
        <Link
          to="/"
          aria-label="Gadget Hub — перейти на главную страницу"
          className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <img
            src="/assets/logo.png"
            alt="Gadget Hub"
            className="h-7 w-auto"
          />
        </Link>

        <nav
          aria-label="Основная навигация"
          className="flex items-center gap-2"
        >
          <NavLink to="/catalog" className={navLinkStyles}>
            <img
              src="/assets/icons/catalog.svg"
              alt=""
              aria-hidden="true"
              className="h-4 w-4"
            />
            <span>Каталог</span>
          </NavLink>

          {isLoading ? (
            <div
              aria-hidden="true"
              className="ml-1 h-12 w-32 rounded-lg bg-surface"
            />
          ) : user ? (
            <>
              <NavLink to="/cart" className={navLinkStyles}>
                <img
                  src="/assets/icons/card.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                <span>Корзина</span>
                {cartBadge}
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={buttonStyles({
                  variant: 'ghost',
                  size: 'lg',
                  className: 'ml-1 px-3',
                })}
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                <span>{isLoggingOut ? 'Выходим...' : 'Выйти'}</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navLinkStyles}>
              <img
                src="/assets/icons/profile.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
              />
              <span>Войти</span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
