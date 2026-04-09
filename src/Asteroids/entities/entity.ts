import type { Position, Velocity, Shape, Boundaries } from "../types";
import { GAME_SETTINGS } from "../constants";


export default abstract class Entity {
    // Physics
    position: Position;
    velocity: Velocity;
    rotation: number;   // In radians

    destroyed: boolean = false;

    // Appearance
    shape: Shape;
    scale: number;
    color: string;
    radius: number;

    constructor({ position, velocity, rotation, shape, scale, color }: { position: Position, velocity: Velocity, 
                rotation: number, shape: Shape, scale: number, color: string }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = rotation;
        this.shape = shape;
        this.scale = scale;
        this.color = color;
        this.radius = this.calculateRadius();
    }

    public handleBoundaries(boundaries: Boundaries): void {
        if (this.position.x > boundaries.MAX_X) {
            this.position.x = boundaries.MIN_X;
        }
        else if (this.position.x < boundaries.MIN_X) {
            this.position.x = boundaries.MAX_X;
        }

        if (this.position.y > boundaries.MAX_Y) {
            this.position.y = boundaries.MIN_Y;
        }
        else if (this.position.y < boundaries.MIN_Y) {
            this.position.y = boundaries.MAX_Y;
        }
    };

    public draw(ctx: CanvasRenderingContext2D): void {
        // Save original context before rotating
        ctx.save();

        // Rotate
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x, -this.position.y);

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

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
            ctx.stroke();
        };

        // Restore original context
        ctx.restore();

    };

    public collidesWith(other: Entity): boolean {
        const dx = this.position.x - other.position.x;
        const dy = this.position.y - other.position.y;

        const distanceSquared = (dx * dx) + (dy * dy);
        const radiiSum = this.radius + other.radius;

        // Collision if the distanceSquared is less than the radiiSum squared
        return distanceSquared < (radiiSum * radiiSum);
    }

    public abstract update(deltaTime: number): void;

    private calculateRadius(): number {
        const allPoints = this.shape.flat();

        // Calculate the radius by taking the center of the entity
        // and finding the distance to its farthest point times a modifier
        return Math.max(...allPoints.map(point =>
                        Math.sqrt(point[0] ** 2 + point[1] ** 2)
        )) * this.scale * GAME_SETTINGS.RADIUS_MODIFIER;
    }
}
