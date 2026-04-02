import type { Position, Velocity, Shape } from "../types";
import { PLAYER_SETTINGS, GAME_SETTINGS } from "../constants.ts";
import Entity from "./entity.ts"


export default class Player extends Entity {
    lives: number = 3;
    thrusting: boolean = false;

    constructor({ position, velocity, rotation, shape, scale, color }: 
                { position: Position, velocity: Velocity, rotation: number, shape: Shape, scale: number, color: string }) 
    {
        super({ position, velocity, rotation, shape, scale, color });
        this.rotation = 0;
    }

    public controlThruster(on: boolean) {
        if (on && !this.thrusting) {
            this.thrusting = true;
            this.shape.push(PLAYER_SETTINGS.THRUST_PATH.map(point => [...point]));
        }
        else if (!on && this.thrusting) {
            this.thrusting = false;
            this.shape.pop();
        }
    }

    public moveForward(deltaTime: number) {
        this.velocity.x += Math.cos(this.rotation) * PLAYER_SETTINGS.ACCELERATION * deltaTime;
        this.velocity.y += Math.sin(this.rotation) * PLAYER_SETTINGS.ACCELERATION * deltaTime;

        // Animate the thruster
        this.controlThruster(true);
    }

    public rotate(deltaTime: number, direction: 1 | -1) {
        this.rotation += PLAYER_SETTINGS.ROTATION_SPEED * deltaTime * direction;
    }

    public update() {
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

        if (speed > PLAYER_SETTINGS.MAX_SPEED) {
            // Normalize
            if (speed > 0) {
                this.velocity.x /= speed;
                this.velocity.y /= speed;
            }

            this.velocity.x *= PLAYER_SETTINGS.MAX_SPEED;
            this.velocity.y *= PLAYER_SETTINGS.MAX_SPEED;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.x *= GAME_SETTINGS.FRICTION;
        this.velocity.y *= GAME_SETTINGS.FRICTION;
    }
}

