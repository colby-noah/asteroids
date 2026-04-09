import { Position } from "./types";


export default class Effect {
    public position: Position;
    public lifetime: number = 0;
    public readonly maxLifetime: number;

    constructor({ position, maxLifetime }: { position: Position, maxLifetime: number }) {
        this.position = position;
        this.maxLifetime = maxLifetime;
    }

    public get isExpired(): boolean {
        return this.lifetime >= this.maxLifetime;
    }

    public get progress(): number {
        return this.lifetime / this.maxLifetime;
    }
    
    public update(deltaTime: number): void {
        this.lifetime += deltaTime;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        // Visual implementation
    }
}
