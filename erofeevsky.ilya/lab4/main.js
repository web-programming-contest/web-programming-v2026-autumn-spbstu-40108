import {Game} from './model.js';

export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const STORAGE_KEY = 'games_date';

export function loadGames() {
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) {
    return [
      new Game('The Witcher 3', 2015, ['PC', 'PS4', 'Xbox One']),
      new Game('Portal 2', 2011, ['PC']),
    ];
  }

  const parsed = JSON.parse(rawData);
  return parsed.map(
    (item) => new Game(item.title, item.releaseYear, item.platforms),
  );
}

export function saveGames(games) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

let games = loadGames();

export async function addGameAsync(title, releaseYear, platforms = []) {
  await delay(300);
  const newGame = new Game(title, releaseYear, platforms);
  games.push(newGame);
  saveGames(games);
  return newGame;
}

export async function removeGameAsync(title) {
  await delay(300);
  games = games.filter((game) => game.title !== title);
  saveGames(games);
  return games;
}

export async function addPlatformToGameAsync(gameTitle, platform) {
  await delay(300);
  const game = games.find((g) => g.title === gameTitle);
  if (game) {
    game.addPlatform(platform);
    saveGames(games);
  }
  return game;
}

export async function removePlatformFromGameAsync(gameTitle, platform) {
  await delay(300);
  const game = games.find((g) => g.title === gameTitle);
  if (game) {
    game.removePlatform(platform);
    saveGames(games);
  }
  return game;
}

export function getGames() {
  return games;
}

window.addEventListener('beforeunload', () => saveGames(games));

const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');

function render() {
  list.innerHTML = '';

  games.forEach((game) => {
    const card = document.createElement('article');
    card.className = 'game-card';
    card.dataset.title = game.title;

    const platformsHtml = game.platforms
      .map(
        (plat) => `
        <li class="platform-item">
          <span>${plat}</span>
          <button type="button" class="btn-remove-platform" data-platform="${plat}">✕</button>
        </li>
      `,
      )
      .join('');

    card.innerHTML = `
      <h3>${game.title}</h3>
      <p><strong>Год выпуска:</strong> ${game.releaseYear}</p>
      <p><strong>Количество платформ:</strong> ${game.platformCount}</p>

      <div class="platforms-section">
        <strong>Платформы:</strong>
        <ul>${platformsHtml || '<li>Платформы не указаны</li>'}</ul>

        <div class="add-platform-block">
          <input type="text" placeholder="Новая платформа" class="input-new-platform" />
          <button type="button" class="btn-add-platform">Добавить платформу</button>
        </div>
      </div>

      <button type="button" class="btn-delete-game">Удалить игру</button>
    `;

    list.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const title = formData.get('title')?.toString().trim();
  const year = Number(formData.get('releaseYear'));

  if (!title || !year) {
    alert('Пожалуйста, укажите название и корректный год выпуска!');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  try {
    await addGameAsync(title, year);
    form.reset();
    render();
  } finally {
    submitBtn.disabled = false;
  }
});

list.addEventListener('click', async (event) => {
  const target = event.target;
  const card = target.closest('.game-card');
  if (!card) {return;}

  const gameTitle = card.dataset.title;

  if (target.classList.contains('btn-delete-game')) {
    target.disabled = true;
    await removeGameAsync(gameTitle);
    render();
  }

  if (target.classList.contains('btn-remove-platform')) {
    const platform = target.dataset.platform;
    target.disabled = true;
    await removePlatformFromGameAsync(gameTitle, platform);
    render();
  }

  if (target.classList.contains('btn-add-platform')) {
    const input = card.querySelector('.input-new-platform');
    const newPlatform = input.value.trim();

    if (!newPlatform) {return;}

    target.disabled = true;
    await addPlatformToGameAsync(gameTitle, newPlatform);
    render();
  }
});

render();
