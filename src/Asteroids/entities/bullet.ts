import type { Position, Velocity, Shape } from "../types";
import { BULLET_SETTINGS } from "../constants.ts";
import Entity from "./entity.ts"


export default class Bullet extends Entity {
    distanceTraveled: number = 0;

    constructor({ position, velocity, rotation, scale, color }: 
                { position: Position, velocity: Velocity, rotation: number, scale: number, color: string }
    ) {
        super({ position, velocity, rotation, shape: [], scale, color });
        this.radius = BULLET_SETTINGS.RADIUS;
    }

    public update(deltaTime: number) {
        const dx = this.velocity.x * deltaTime;
        const dy = this.velocity.y * deltaTime;

        this.position.x += dx;
        this.position.y += dy;

        this.distanceTraveled += Math.sqrt(dx ** 2 + dy ** 2);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    public get isExpired(): boolean {
        return this.distanceTraveled > BULLET_SETTINGS.MAX_DISTANCE;
    }
}

