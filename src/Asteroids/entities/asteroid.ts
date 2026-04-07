import type { Position, Velocity, Shape, AsteroidSizes } from "../types";
import { ASTEROID_SETTINGS } from "../constants";
import Entity from "./entity"


export default class Asteroid extends Entity {
    private static getRandomShape(): Shape {
        const shapes = ASTEROID_SETTINGS.POSSIBLE_SHAPES;
        const shapeIndex: number = Math.floor(Math.random() * ASTEROID_SETTINGS.POSSIBLE_SHAPES.length);

        return (shapes[shapeIndex]?.map(
            point => [...point])
            ?? []
        ) as Shape;
    }

    size: AsteroidSizes;

    constructor({ position, velocity, rotation, shape, color, size }: 
                { position: Position, velocity: Velocity, rotation: number, shape?: Shape, color: string, size: AsteroidSizes }
    ) {
        const asteroidShape: Shape = shape ?? Asteroid.getRandomShape();

        super({ position, velocity, rotation, shape: asteroidShape, scale: ASTEROID_SETTINGS.SIZE_TO_SCALE[size], color });
        this.size = size;
    }

    public update(deltaTime: number) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }
}

