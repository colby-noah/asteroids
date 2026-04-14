import { ASTEROID_SETTINGS } from "./constants";


export interface Position {
    x: number;
    y: number;
};

export interface Velocity {
    x: number;
    y: number;
};

export type Shape = [number, number][][];

export type Boundaries = {
    MIN_X: number;
    MIN_Y: number;
    MAX_X: number;
    MAX_Y: number;
}

export type AsteroidSizes = keyof typeof ASTEROID_SETTINGS.SIZE_TO_SCALE;

export enum GameState {
    PLAYING,
    PLAYER_DEAD,
    ROUND_CLEAR,
    GAME_OVER
}
