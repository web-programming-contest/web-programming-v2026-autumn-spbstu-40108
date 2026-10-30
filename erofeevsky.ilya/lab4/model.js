export class Game {
  constructor(title, platforms = [], releaseYear) {
    this.title = title;
    this.releaseYear = releaseYear;
    this.platforms = platforms;
  }
  addPlatform(platform) {
    if (!this.platforms.includes(platform)) {
      this.platforms.push(platform);
    }
  }
  removePlatform(platform) {
    const index = this.platforms.indexOf(platform);
    if (index > -1) {
      this.platforms.splice(index, 1);
    }
  }
  get platformCount() {
    return this.platforms.length;
  }
}

export function groupGameOnYear(games) {
  const grouped = {};
  for (const game of games) {
    const year = game.releaseYear;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(game);
  }
  return grouped;
}

export function groupUniqPlatform(games) {
  const uniq = new Set();

  for (const game of games) {
    for (const platform of game.platforms) {
      uniq.add(platform);
    }
  }

  return Array.from(uniq);
}

export function groupGameOnConcretPlatform(games, platform) {
  const result = [];

  for (const game of games) {
    if (game.platforms.includes(platform)) {
      result.push(game);
    }
  }

  return result;
}

export function groupGamesOnCountPlatform(games) {
  const grouped = {};

  for (const game of games) {
    const count = game.platformCount;
    if (!grouped[count]) {
      grouped[count] = [];
    }
    grouped[count].push(game);
  }

  return grouped;
}

export function gamesAfterConcretYear(games, year) {
  const result = [];

  for (const game of games) {
    if (game.releaseYear > year) {
      result.push(game);
    }
  }

  return result;
}
