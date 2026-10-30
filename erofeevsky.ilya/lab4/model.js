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
  if (!Array.isArray(games)) {
    return grouped;
  }

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
  if (!Array.isArray(games)) {
    return [];
  }

  for (const game of games) {
    if (Array.isArray(game.platforms)) {
      for (const platform of game.platforms) {
        uniq.add(platform);
      }
    }
  }

  return Array.from(uniq);
}

export function findGamesByPlatform(games, platform) {
  if (!Array.isArray(games)) {
    return [];
  }

  return games.filter(
    (game) =>
      game &&
      Array.isArray(game.platforms) &&
      game.platforms.includes(platform),
  );
}

export function groupByPlatformCount(games) {
  const grouped = {};
  if (!Array.isArray(games)) {
    return grouped;
  }

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
  if (!Array.isArray(games)) {
    return [];
  }

  return games.filter((game) => game.releaseYear > year);
}

export {
  groupGamesByReleaseYear as groupGameOnYear,
  groupGamesByReleaseYear as groupByReleaseYear,
  getUniquePlatforms as groupUniqPlatform,
  findGamesByPlatform as getGamesByPlatform,
  findGamesByPlatform as groupGameOnConcretPlatform,
  groupByPlatformCount as groupGamesOnCountPlatform,
  groupByPlatformCount as groupGamesByPlatformCount,
  getGamesReleasedAfter as gamesAfterConcretYear,
  getGamesReleasedAfter as findGamesReleasedAfter,
};
