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
