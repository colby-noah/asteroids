import type { Position } from "../types";
import Effect from "./effect";


interface Particle {
    angle: number;
    speed: number;
}


export default class Explosion extends Effect {
    private readonly maxRadius: number;
    private readonly color: string;
    private readonly particles: Particle[];

    constructor({ position, maxLifetime = 3000, numParticles = 10, maxRadius = 80, color = "white" }:
                { position: Position, maxLifetime?: number, numParticles?: number, maxRadius?: number, color?: string }) {
        super({ position, maxLifetime });
        this.maxRadius = maxRadius;
        this.color = color;

        // Create an array of particles with semi-random speeds & starting locations
        this.particles = Array.from({ length: numParticles }, (_, i) => ({
            // Space out particles evenly around the radius, with a little added movement
            angle: (i / numParticles) * (Math.PI * 2) + (Math.random() - 0.5) * 1.2,
            // First number controls starting position of particle in % of radius
            speed: 0.8 + (Math.random() * 0.4)
        }));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        // Controls how quickly a particle loses its speed
        const easedProgress = 1 - Math.pow(1 - this.progress, 2);
        const dotRadius = 2;

        // Sets opacity globally for ctx, must be reset
        ctx.globalAlpha = 1 - this.progress;
        ctx.fillStyle = this.color;
        
        ctx.beginPath();

        for (const particle of this.particles) {
            const distance = easedProgress * this.maxRadius * particle.speed;
            const x = this.position.x + Math.cos(particle.angle) * distance;
            const y = this.position.y + Math.sin(particle.angle) * distance;

            ctx.moveTo(x + dotRadius, y);
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        }
        
        ctx.fill();

        // Reset opacity
        ctx.globalAlpha = 1;
    }
}
