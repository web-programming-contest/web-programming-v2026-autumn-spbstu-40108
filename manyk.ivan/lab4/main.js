import {
  Channel,
  groupChannelsBySubscriberCount,
  getUniqueSubscribers,
  findChannelsBySubscriber,
  groupSubscribersByChannel,
  findLargestChannels,
} from './model.js';

const storageKey = 'variant20-channels';
const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');
const template = document.querySelector('#channel-template');
const message = document.querySelector('#message');
const searchForm = document.querySelector('#subscriber-search');
let channels = [];
let busy = false;

// После JSON.parse восстанавливаем экземпляры класса и его методы
function restoreChannels(items) {
  if (!Array.isArray(items)) {
    throw new Error('Неверный формат списка каналов.');
  }
  const restored = items.map(
    (item) => new Channel(item.id, item.name, item.subscribers),
  );
  if (new Set(restored.map((item) => item.id)).size !== restored.length) {
    throw new Error('ID каналов должны быть уникальными.');
  }
  return restored;
}

// сообщение после блока добавления
function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}

// вывод канала
function channelLabel(item) {
  return `${item.name} (ID: ${item.id})`;
}

// добавление в селектор строки
function renderLines(selector, lines, emptyText) {
  const result = document.querySelector(selector);
  result.replaceChildren();
  for (const text of lines.length ? lines : [emptyText]) {
    const row = document.createElement('li');
    row.textContent = text;
    result.append(row);
  }
}

// Поиск каналов по имени подписчика.
function renderSubscriberSearch() {
  const name = searchForm.elements.subscriber.value.trim();
  const found = name ? findChannelsBySubscriber(channels, name) : [];
  renderLines(
    '#subscriber-channels',
    found.map(channelLabel),
    name
      ? 'Каналы с таким подписчиком не найдены.'
      : 'Введите имя подписчика для поиска.',
  );
}

// результаты
function renderCollectionResults() {
  const byCount = groupChannelsBySubscriberCount(channels);
  renderLines(
    '#channels-by-count',
    [...byCount].map(
      ([count, items]) =>
        `Подписчиков: ${count} - ${items.map(channelLabel).join(', ')}`,
    ),
    'Каналов пока нет.',
  );

  renderLines(
    '#unique-subscribers',
    getUniqueSubscribers(channels),
    'Подписчиков пока нет.',
  );

  renderSubscriberSearch();

  const bySubscriber = groupSubscribersByChannel(channels);
  renderLines(
    '#channels-by-subscriber',
    [...bySubscriber].map(
      ([name, items]) => `${name} -> ${items.map(channelLabel).join(', ')}`,
    ),
    'Подписчиков пока нет.',
  );

  renderLines(
    '#most-subscribed-channels',
    findLargestChannels(channels).map(
      (item) => `${channelLabel(item)} - подписчиков: ${item.subscriberCount}`,
    ),
    'Каналов пока нет.',
  );
}

// Обновление результатов и карточек каналов.
function render() {
  renderCollectionResults();
  list.replaceChildren();
  if (channels.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Каналов пока нет. Добавьте первый канал.';
    list.append(empty);
    return;
  }

  for (const item of channels) {
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector('h3').textContent = item.name;
    card.querySelector('.channel-id').textContent = `ID: ${item.id}`;
    card.querySelector('.subscriber-count').textContent =
      `Подписчиков: ${item.subscriberCount}`;
    card.querySelector('.empty-subscribers').hidden = item.subscriberCount > 0;

    const subscribers = card.querySelector('ul');
    for (const name of item.subscribers) {
      const row = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = name;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Удалить подписчика';
      button.addEventListener('click', () => {
        change((items) => {
          items.find((entry) => entry.id === item.id).removeSubscriber(name);
        }, 'Подписчик удалён.');
      });
      row.append(label, button);
      subscribers.append(row);
    }

    const subscriberForm = card.querySelector('form');
    subscriberForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = subscriberForm.elements.subscriber.value;
      change((items) => {
        items.find((entry) => entry.id === item.id).addSubscriber(name);
      }, 'Подписчик добавлен.');
    });

    card.querySelector('.delete-channel').addEventListener('click', () => {
      change((items) => {
        const index = items.findIndex((entry) => entry.id === item.id);
        items.splice(index, 1);
      }, 'Канал удалён.');
    });
    list.append(card);
  }
}

function setBusy(value) {
  busy = value;
  document.querySelectorAll('input, button').forEach((control) => {
    control.disabled = value;
  });
}

// Каждое добавление и удаление выполняется с задержкой через Promise.
async function change(action, successMessage, resetForm) {
  if (busy) {
    return;
  }
  setBusy(true);
  showMessage('Выполняется…');
  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updated = restoreChannels(channels);
          action(updated);
          // Сначала сохраняем: при ошибке хранилища текущий список не изменится.
          try {
            localStorage.setItem(storageKey, JSON.stringify(updated));
          } catch {
            throw new Error('Не удалось сохранить изменения в localStorage.');
          }
          channels = updated;
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
    render();
    if (resetForm) {
      resetForm.reset();
    }
    showMessage(successMessage);
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    setBusy(false);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = Number(form.elements.id.value);
  const name = form.elements.name.value;
  change(
    (items) => {
      if (items.some((item) => item.id === id)) {
        throw new Error('Канал с таким ID уже существует.');
      }
      items.push(new Channel(id, name));
    },
    'Канал добавлен.',
    form,
  );
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderSubscriberSearch();
});

try {
  const saved = localStorage.getItem(storageKey);
  channels = saved === null ? [] : restoreChannels(JSON.parse(saved));
} catch {
  showMessage(
    'Не удалось загрузить каналы из localStorage. Проверьте сохранённые данные и доступ к хранилищу.',
    true,
  );
}
render();
