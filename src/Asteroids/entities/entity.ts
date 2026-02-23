import type { Position, Velocity, Shape } from "../types";
import { GAME_SETTINGS } from "../constants";


export default abstract class Entity {
    // Physics
    position: Position;
    velocity: Velocity;
    rotation: number;

    // Appearance
    shape: Shape;
    scale: number;
    color: string;

    constructor({ position, velocity, rotation, shape, scale, color }: { position: Position, velocity: Velocity, 
                rotation: number, shape: Shape, scale: number, color: string }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = rotation;
        this.shape = shape;
        this.scale = scale;
        this.color = color;
    }

    handleBoundaries(): void {
        if (this.position.x > GAME_SETTINGS.WORLD_BOUNDARIES.MAX_X) {
            this.position.x = GAME_SETTINGS.WORLD_BOUNDARIES.MIN_X;
        }
        else if (this.position.x < GAME_SETTINGS.WORLD_BOUNDARIES.MIN_X) {
            this.position.x = GAME_SETTINGS.WORLD_BOUNDARIES.MAX_X;
        }

        if (this.position.y > GAME_SETTINGS.WORLD_BOUNDARIES.MAX_Y) {
            this.position.y = GAME_SETTINGS.WORLD_BOUNDARIES.MIN_Y;
        }
        else if (this.position.y < GAME_SETTINGS.WORLD_BOUNDARIES.MIN_Y) {
            this.position.y = GAME_SETTINGS.WORLD_BOUNDARIES.MAX_Y;
        }
    };

    draw(ctx: CanvasRenderingContext2D): void {
        if (!ctx) return; 

        // Save original context before rotating
        ctx.save();

        // Rotate
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x, -this.position.y);

        // Draw
        for (const path of this.shape) {
            if (!path[0]) return;

            ctx.beginPath();

            // Move context to first point
            const [startX, startY] = path[0];
            ctx.moveTo(
                this.position.x + (startX * this.scale),
                this.position.y + (startY * this.scale)
            );

            // Connect shape points
            for (const [x, y] of path.slice(1)) {
                ctx.lineTo(
                    this.position.x + (x * this.scale),
                    this.position.y + (y * this.scale)
                );
            }

            ctx.closePath();

            // Color lines
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        // Restore original context
        ctx.restore();

    };

    abstract update(): void;
}
