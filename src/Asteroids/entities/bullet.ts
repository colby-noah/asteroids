import type { Position, Velocity, Shape } from "../types";
import { BULLET_SETTINGS } from "../constants.ts";
import Entity from "./entity.ts"


export default class Bullet extends Entity {
    constructor({ position, velocity, rotation, scale, color }: 
                { position: Position, velocity: Velocity, rotation: number, scale: number, color: string }
    ) {
        super({ position, velocity, rotation, shape: [], scale, color });
        this.radius = BULLET_SETTINGS.RADIUS;
    }

    update() {
    }
}

