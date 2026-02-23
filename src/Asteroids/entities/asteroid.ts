import type { Position, Velocity, Shape } from "../types";
import { ASTEROID_SETTINGS } from "../constants.ts";
import Entity from "./entity.ts"


export default class Asteroid extends Entity {
    static getRandomShape(): Shape {
        const shapes = ASTEROID_SETTINGS.POSSIBLE_SHAPES;
        const shapeIndex: number = Math.floor(Math.random() * ASTEROID_SETTINGS.POSSIBLE_SHAPES.length);

        return (shapes[shapeIndex]?.map(
            point => [...point])
            ?? []
        ) as Shape;
    }

    constructor({ position, velocity, rotation, shape, scale, color }: 
                { position: Position, velocity: Velocity, rotation: number, shape?: Shape | null, scale: number, color: string }
    ) {
        const asteroidShape: Shape = shape ?? Asteroid.getRandomShape();

        super({ position, velocity, rotation, shape: asteroidShape, scale, color });
    }

    update() {
        // Hit detection?
    }
}

