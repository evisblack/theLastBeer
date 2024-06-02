export interface Score {
    id: number;
    userId: number;
    gameId: number;
    game: {
      id: number;
      name: string;
      description: string;
    };
    points: number;
    scoreDate: string;
  }