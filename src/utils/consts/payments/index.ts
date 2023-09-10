type LeaderboardConstants = {
  validTimeframes: string[];
  validSortings: string[];
  validOrderBy: string[];
  orderMapping: { [key: string]: string };
};

const leaderboardConstants: LeaderboardConstants = {
  validTimeframes: ['day', 'week', 'month', 'year', 'all'],
  validSortings: ['asc', 'desc'],
  validOrderBy: ['reward', 'mirror', 'waves'],
  orderMapping: {
    reward: 'total_reward',
    mirror: 'payment_count',
  },
};

export { leaderboardConstants };
