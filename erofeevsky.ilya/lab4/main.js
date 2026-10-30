import {Game} from './model.js';

export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const STORAGE_KEY = 'games_data';

export function loadGames() {
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) {
    return [
      new Game('The Witcher 3', ['PC', 'PS4', 'Xbox One'], 2015),
      new Game('Portal 2', ['PC'], 2011),
    ];
  }

  const parsed = JSON.parse(rawData);
  return parsed.map(
    (item) => new Game(item.title, item.platforms, item.releaseYear),
  );
}

export function saveGames(dataToSave) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

let games = loadGames();

export async function addGameAsync(title, releaseYear, platforms = []) {
  await delay(300);
  const newGame = new Game(title, platforms, releaseYear);
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

window.addEventListener('beforeunload', () => {
  saveGames(games);
});

const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');

export function render() {
  if (!list) {
    return;
  }
  list.innerHTML = '';

  games.forEach((game) => {
    const card = document.createElement('article');
    card.setAttribute('data-testid', 'entity-card');
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
      <p>Год выпуска: ${game.releaseYear}</p>
      <p>Количество платформ: ${game.platformCount}</p>
      <div class="platforms-section">
        <strong>Платформы:</strong>
        <ul>${platformsHtml}</ul>
        <div class="add-platform-block">
          <input type="text" placeholder="Новая платформа" class="input-new-platform" />
          <button type="button" class="btn-add-platform">Добавить платформу</button>
        </div>
      </div>

      <button type="button" class="btn-delete-game" data-action="delete" data-testid="entity-delete">Удалить</button>
    `;

    list.appendChild(card);
  });
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const title = formData.get('title')?.toString().trim();
    const releaseYear = Number(formData.get('releaseYear'));

    if (!title || !releaseYear) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      await addGameAsync(title, releaseYear, []);
      form.reset();
      render();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
}

if (list) {
  list.addEventListener('click', async (event) => {
    const target = event.target;
    const card = target.closest('[data-testid="entity-card"]');
    if (!card) {
      return;
    }

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
      const platform = input ? input.value.trim() : '';
      if (!platform) {
        return;
      }

      target.disabled = true;
      await addPlatformToGameAsync(gameTitle, platform);
      render();
    }
  });
}

render();
