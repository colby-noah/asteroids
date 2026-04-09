import type { Position } from "../types";
import Effect from "./effect";


export default class Explosion extends Effect {
    private readonly numLines: number;
    private readonly maxRadius: number;
    private readonly color: string;

    constructor({ position, maxLifetime = 3000, numLines = 8, maxRadius = 50, color = "white" }:
                { position: Position, maxLifetime?: number, numLines?: number, maxRadius?: number, color?: string }) {
        super({ position, maxLifetime });
        this.numLines = numLines;
        this.maxRadius = maxRadius;
        this.color = color;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const opacity = 1 - this.progress;
        const radius = this.maxRadius * this.progress;
        const innerRadius = radius * 0.5;

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 2;

        for (let i = 0; i < this.numLines; i++) {
            const angle = (i / this.numLines) * Math.PI * 2;

            ctx.beginPath();
            ctx.moveTo(
                this.position.x + Math.cos(angle) * innerRadius,
                this.position.y + Math.sin(angle) * innerRadius
            );
            ctx.lineTo(
                this.position.x + Math.cos(angle) * radius,  
                this.position.y + Math.sin(angle) * radius
            );

            ctx.closePath();
            ctx.stroke();
        }
    }
}
