export interface Level {
    name: string;
    description: string;
    scoreToBeat: number;
}

export const Levels: Level[] = [
    {
        name: '1',
        description: 'Easy',
        scoreToBeat: 100
    },
    {
        name: '2',
        description: 'Medium',
        scoreToBeat: 200
    },
    {
        name: '3',
        description: 'Hard',
        scoreToBeat: 300
    }
];
