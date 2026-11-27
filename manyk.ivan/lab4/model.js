export class Channel {
  constructor(id, name, subscribers = []) {
    if (!Number.isSafeInteger(id) || id < 1) {
      throw new Error('ID должен быть целым положительным числом.');
    }
    if (typeof name !== 'string' || !name.trim()) {
      throw new Error('Введите название канала.');
    }
    if (!Array.isArray(subscribers)) {
      throw new Error('Список подписчиков должен быть массивом.');
    }

    this.id = id;
    this.name = name.trim();
    this.subscribers = [];
    subscribers.forEach((subscriber) => this.addSubscriber(subscriber));
  }

  addSubscriber(name) {
    if (typeof name !== 'string' || !name.trim()) {
      throw new Error('Введите имя подписчика.');
    }
    const subscriber = name.trim();
    if (this.subscribers.includes(subscriber)) {
      throw new Error('Этот подписчик уже есть в канале.');
    }
    this.subscribers.push(subscriber);
  }

  removeSubscriber(name) {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber !== name,
    );
  }

  get subscriberCount() {
    return this.subscribers.length;
  }
}

// Количество подписчиков - массив каналов.
export function groupChannelsBySubscriberCount(channels) {
  const groups = new Map();
  for (const item of channels) {
    const count = item.subscriberCount;
    if (!groups.has(count)) {
      groups.set(count, []);
    }
    groups.get(count).push(item);
  }
  return groups;
}

export function getUniqueSubscribers(channels) {
  const allSubscribers = channels.flatMap((item) => item.subscribers);
  const uniqueSubscribers = new Set(allSubscribers);
  return [...uniqueSubscribers];
}

export function findChannelsBySubscriber(channels, name) {
  return channels.filter((item) => item.subscribers.includes(name));
}

// Имя подписчика - массив каналов, на которые он подписан.
export function groupSubscribersByChannel(channels) {
  const groups = new Map();
  for (const item of channels) {
    for (const name of item.subscribers) {
      if (!groups.has(name)) {
        groups.set(name, []);
      }
      groups.get(name).push(item);
    }
  }
  return groups;
}

export function findLargestChannels(channels) {
  if (channels.length === 0) {
    return [];
  }
  const maximum = Math.max(...channels.map((item) => item.subscriberCount));
  return channels.filter((item) => item.subscriberCount === maximum);
}
