import type { Position } from "../types";
import Effect from "./effect";


interface Line {
    rotation: number;
    angle: number;
    speed: number;
}


export default class PlayerDeath extends Effect {
    private readonly maxRadius: number;
    private readonly color: string;
    private readonly lineLength;
    private readonly lines: Line[];

    constructor({ position, playerScale, maxLifetime = 3000, maxRadius = 80, color = "white" }:
                { position: Position, playerScale: number, maxLifetime?: number, maxRadius?: number, color?: string }) {
        super({ position, maxLifetime });
        // Base line length * scale of player
        this.lineLength = 6 * playerScale;
        this.maxRadius = maxRadius;
        this.color = color;

        this.lines = Array.from({ length: 3}, (_, i) => ({
            angle: (i / 3) * (Math.PI * 2) + (Math.random() - 0.5) * 1.2, // Spread lines out evenly along the radius
            speed: 0.8 + (Math.random() * 0.4), // First number controls starting position of line in % of radius
            rotation: Math.random() * (Math.PI * 2) // Random initial rotation
        }));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        // Controls how quickly a line loses its speed
        const easedProgress = 1 - Math.pow(1 - this.progress, 2);

        // Sets opacity globally for ctx, must be reset
        ctx.globalAlpha = 1 - this.progress;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        
        ctx.beginPath();

        for (const line of this.lines) {
            const distance = easedProgress * this.maxRadius * line.speed;
            const x = this.position.x + Math.cos(line.angle) * distance;
            const y = this.position.y + Math.sin(line.angle) * distance;
            const halfLen = this.lineLength / 2;

            ctx.moveTo(x + Math.cos(line.rotation) * halfLen, y + Math.sin(line.rotation) * halfLen);
            ctx.lineTo(x - Math.cos(line.rotation) * halfLen, y - Math.sin(line.rotation) * halfLen);
        }
        
        ctx.stroke();

        // Reset opacity
        ctx.globalAlpha = 1;
    }
}
