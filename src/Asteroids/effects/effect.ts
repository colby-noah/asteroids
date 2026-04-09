import type { Position } from "../types";


export default abstract class Effect {
    public position: Position;
    public lifetime: number = 0;
    public readonly maxLifetime: number;

    constructor({ position, maxLifetime }: { position: Position, maxLifetime: number }) {
        this.position = position;
        this.maxLifetime = maxLifetime;
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;

    public get isExpired(): boolean {
        return this.lifetime >= this.maxLifetime;
    }

    public get progress(): number {
        return this.lifetime / this.maxLifetime;
    }
    
    public update(deltaTime: number): void {
        this.lifetime += deltaTime;
    }
}
