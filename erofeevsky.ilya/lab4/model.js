export class Game {
  constructor(title, platforms = [], releaseYear) {
    this.title = title;

    if (typeof platforms === 'number') {
      this.releaseYear = platforms;
      this.platforms = Array.isArray(releaseYear) ? releaseYear : [];
    } else {
      this.platforms = Array.isArray(platforms) ? platforms : [];
      this.releaseYear = releaseYear;
    }
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

export function groupGamesByReleaseYear(games) {
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

export function getUniquePlatforms(games) {
  const uniq = new Set();
  for (const game of games) {
    for (const platform of game.platforms) {
      uniq.add(platform);
    }
  }
  return Array.from(uniq);
}

export function getGamesByPlatform(games, platform) {
  const result = [];
  for (const game of games) {
    if (game.platforms.includes(platform)) {
      result.push(game);
    }
  }
  return result;
}

export function groupByPlatformCount(games) {
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

export function getGamesReleasedAfter(games, year) {
  const result = [];
  for (const game of games) {
    if (game.releaseYear > year) {
      result.push(game);
    }
  }
  return result;
}

export {
  groupGamesByReleaseYear as groupGameOnYear,
  getUniquePlatforms as groupUniqPlatform,
  getGamesByPlatform as groupGameOnConcretPlatform,
  groupByPlatformCount as groupGamesOnCountPlatform,
  getGamesReleasedAfter as gamesAfterConcretYear,
};
