import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { goodsSeed } from './seed-data';

const assetsDirectory = resolve(
  __dirname,
  '../../../frontend/public/assets/goods',
);

const errors: string[] = [];
const seenIds = new Set<number>();
const seenTitles = new Set<string>();

if (goodsSeed.length !== 32) {
  errors.push(`Ожидалось 32 товара, найдено ${goodsSeed.length}`);
}

for (const good of goodsSeed) {
  if (seenIds.has(good.id)) {
    errors.push(`Повторяющийся идентификатор товара: ${good.id}`);
  }
  seenIds.add(good.id);

  if (seenTitles.has(good.title)) {
    errors.push(`Повторяющееся название товара: ${good.title}`);
  }
  seenTitles.add(good.title);

  if (!good.title.trim() || !good.description.trim()) {
    errors.push(`У товара ${good.id} не заполнены название или описание`);
  }

  if (!Number.isInteger(good.price) || good.price <= 0) {
    errors.push(`У товара ${good.id} некорректная цена`);
  }

  if (!Number.isFinite(good.rating) || good.rating < 1 || good.rating > 5) {
    errors.push(`У товара ${good.id} рейтинг вне диапазона 1–5`);
  }

  if (!good.category.trim() || !good.color.trim()) {
    errors.push(`У товара ${good.id} не заполнены категория или цвет`);
  }

  if (Object.keys(good.specs).length < 3) {
    errors.push(`У товара ${good.id} меньше трех характеристик`);
  }

  const imagePath = resolve(assetsDirectory, `image_${good.id}.png`);
  if (!existsSync(imagePath)) {
    errors.push(`Не найдено изображение для товара ${good.id}: ${imagePath}`);
  }

  if (good.imageUrl !== `/assets/goods/image_${good.id}.png`) {
    errors.push(`У товара ${good.id} неверный путь к изображению`);
  }
}

if (errors.length > 0) {
  console.error('Проверка каталога не пройдена:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Проверка каталога пройдена: ${goodsSeed.length} уникальных товаров, все изображения на месте.`,
);
