import { useNavigate } from 'react-router-dom';
import { ProductCarousel } from '../components/home/ProductCarousel';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import type { Good } from '../types';

const advantages = [
  {
    title: 'Утром заказали, вечером получили',
    icon: '/assets/icons/benefit-rocket.svg',
  },
  {
    title: 'С товаром что-то не так? Вернем деньги',
    icon: '/assets/icons/benefit-refund.svg',
  },
  {
    title: 'Только оригинальные товары',
    icon: '/assets/icons/benefit-original.svg',
  },
];

export function HomePage(): JSX.Element {
  const { goods, isLoading, error, reload } = useProducts();
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const newProducts = goods.filter((product) => product.isNew);
  const bestsellers = goods.filter((product) => product.isBestseller);

  const handleProductClick = (product: Good): void => {
    if (isAuthLoading) {
      navigate(`/catalog?product=${product.id}`);
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    navigate(`/catalog?product=${product.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-[1288px] px-6 pb-24">
      <img
        src="/assets/home/banner.png"
        alt="Супер распродажа: умный робот-друг Red solution Reddy Air"
        className="block w-full"
      />

      <ProductCarousel
        id="bestsellers"
        title="Хиты продаж"
        description="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
        products={bestsellers}
        accent="hit"
        isLoading={isLoading}
        error={error}
        onRetry={() => {
          void reload();
        }}
        onProductClick={handleProductClick}
      />

      <ProductCarousel
        id="new-products"
        title="Новинки"
        description="Их только произвели — они уже у нас! Все самое новое и свежее на рынке электроники."
        products={newProducts}
        accent="new"
        isLoading={isLoading}
        error={error}
        onRetry={() => {
          void reload();
        }}
        onProductClick={handleProductClick}
      />

      <section aria-labelledby="advantages-title" className="mt-20">
        <h2
          id="advantages-title"
          className="text-[32px] font-bold leading-tight text-ink"
        >
          Преимущества
        </h2>
        <div className="mt-8 grid grid-cols-3 gap-8">
          {advantages.map((advantage) => (
            <article
              key={advantage.title}
              className="min-h-[306px] rounded-[20px] bg-[#F4F4F4] p-10 transition-colors hover:bg-[#ECEFF3]"
            >
              <img
                src={advantage.icon}
                alt=""
                aria-hidden="true"
                className="h-[72px] w-[72px] object-contain"
              />
              <h3 className="mt-10 max-w-[280px] text-2xl font-semibold leading-tight text-ink">
                {advantage.title}
              </h3>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="contacts-title" className="mt-20">
        <h2
          id="contacts-title"
          className="text-[32px] font-bold leading-tight text-ink"
        >
          Работаем 24/7
        </h2>

        <div className="mt-10 grid grid-cols-3 gap-8">
          <a
            href="tel:88006783424"
            className="flex items-center gap-4 rounded-lg text-2xl font-medium text-ink transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src="/assets/icons/phone.svg"
              alt=""
              aria-hidden="true"
              className="h-10 w-10 shrink-0"
            />
            8 (800) 678-34-24
          </a>

          <a
            href="mailto:gadget@hub.ru"
            className="flex items-center gap-4 rounded-lg text-2xl font-medium text-ink transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src="/assets/icons/email.svg"
              alt=""
              aria-hidden="true"
              className="h-10 w-10 shrink-0"
            />
            gadget@hub.ru
          </a>

          <div className="flex items-start gap-4 text-2xl font-medium leading-7 text-ink">
            <img
              src="/assets/icons/map-pin.svg"
              alt=""
              aria-hidden="true"
              className="h-10 w-10 shrink-0"
            />
            Санкт-Петербург, ул. Барочная, д. 7, корпус 2
          </div>
        </div>
      </section>
    </div>
  );
}
