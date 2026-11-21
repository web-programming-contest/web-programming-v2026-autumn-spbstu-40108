import { Mail, MapPin, Phone } from 'lucide-react';

const socialLinks = [
  {
    href: 'https://vk.com',
    label: 'ВКонтакте',
    icon: '/assets/social/vk.png',
  },
  {
    href: 'https://t.me',
    label: 'Telegram',
    icon: '/assets/social/telegram.png',
  },
  {
    href: 'https://wa.me/78006783424',
    label: 'WhatsApp',
    icon: '/assets/social/whatsapp.png',
  },
];

export function Footer(): JSX.Element {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto max-w-[1288px] px-6 py-10">
        <div className="flex items-start justify-between gap-10">
          <div className="max-w-[280px]">
            <img
              src="/assets/logo-light.png"
              alt="Gadget Hub"
              className="h-7 w-auto"
            />
            <p className="mt-3 text-sm text-white/70">
              Магазин надежных гаджетов
            </p>
            <p className="mt-4 text-sm text-white/70">
              Работаем круглосуточно, без выходных
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href="tel:88006783424"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-80 active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              8 (800) 678-34-24
            </a>
            <a
              href="tel:+78126783424"
              className="inline-flex items-center gap-2 text-white/80 transition-opacity hover:opacity-80 active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              8 (812) 678-34-24
            </a>
            <a
              href="mailto:gadget@hub.ru"
              className="inline-flex items-center gap-2 text-white/80 transition-opacity hover:opacity-80 active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              gadget@hub.ru
            </a>
            <span className="inline-flex items-center gap-2 text-white/80">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              Санкт-Петербург, ул. Барочная, д. 7, корпус 2
            </span>
          </div>

          <div>
            <p className="text-sm font-medium">Мы в социальных сетях</p>
            <div className="mt-3 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-80 active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
                >
                  <img
                    src={social.icon}
                    alt={social.label}
                    className="h-10 w-10"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-6 text-xs text-white/60">
          © 2026 ООО «Гаджет Хаб». Все права защищены.
        </div>
      </div>
    </footer>
  );
}
