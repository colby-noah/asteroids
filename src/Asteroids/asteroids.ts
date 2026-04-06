import type { Boundaries } from "./types";
import { GAME_SETTINGS, PLAYER_SETTINGS } from "./constants";
import Input from "./input";
import Player from "./entities/player";
import Asteroid from "./entities/asteroid";
import Bullet from "./entities/bullet";


export default class Asteroids {
    ctx: CanvasRenderingContext2D;
    boundaries: Boundaries;

    // Game loop time variables
    deltaTime: number = 0;
    lastFrameTimeMs: DOMHighResTimeStamp = 0;

    input: Input;
    player: Player;
    asteroids: Asteroid[] = [];
    bullets: Bullet[] = [];

    constructor({ ctx }: { ctx: CanvasRenderingContext2D }) {
        this.ctx = ctx;
        this.boundaries = this.calculateBoundaries();
        this.input = new Input();
        this.player = new Player({
            position: { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2 },
            velocity: { x: 0, y: 0 },
            rotation: 0,
            shape: PLAYER_SETTINGS.SHAPE.map(path => path.map((point) => point as [number, number])),
            scale: 10,
            color: "white",
        });

        const testAsteroid = new Asteroid({
            position: { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2 },
            velocity: { x: 0, y: 0 },
            rotation: 0,
            scale: 10,
            color: "white",
        });

        this.asteroids.push(testAsteroid);
    }

    public init() {
        requestAnimationFrame(this.gameLoop);
    }

    private handleInput() {
        if (this.input.keys.w) {
            this.player.moveForward(this.deltaTime);
        }
        else {
            // Turn off thruster animation
            this.player.controlThruster(false);
        }

        // Rotate left
        if (this.input.keys.a) {
            this.player.rotate(this.deltaTime, -1);
        }

        // Rotate right
        if (this.input.keys.d) {
            this.player.rotate(this.deltaTime, 1);
        }

        if (this.input.keys.space) {
            const bullet = this.player.spawnBullet();
            if (bullet) {
                this.bullets.push(bullet);
            }
        }
    }

    private update() {
        // Update the player
        this.player.handleBoundaries(this.boundaries);
        this.player.update(this.deltaTime);

        // Update all asteroids 
        this.asteroids.forEach(a => {
            a.handleBoundaries(this.boundaries);
            a.update(this.deltaTime);
        });

        // Update all bullets
        this.bullets.forEach(b => {
            // Bullets don't wrap in the original game
            // b.handleBoundaries(this.boundaries);
            b.update(this.deltaTime);
        });

        // Check asteroid collisions
        for (const asteroid of this.asteroids) {
            if (this.player.collidesWith(asteroid)) {
                // Handle collisions
            }
            // Bullet collisions here
            for (const bullet of this.bullets) {
                if (bullet.collidesWith(asteroid)) {
                    bullet.destroyed = true;
                }
            }
            
        }

        // Destroy Entities
        this.bullets = this.bullets.filter(b => !b.isExpired);
        this.cleanUpAllDestroyed();
    }

    private draw() {
        // Reset screen
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw the player
        this.player.draw(this.ctx);

        // Draw all asteroids 
        this.asteroids.forEach(a => a.draw(this.ctx));
        
        // Draw all bullets
        this.bullets.forEach(b => b.draw(this.ctx));
    }

    // Arrow function preserves 'this' context for requestAnimationFrame callback
    private gameLoop = (timestamp: DOMHighResTimeStamp) => {
        // Delta time
        if (timestamp < this.lastFrameTimeMs + (1000 / GAME_SETTINGS.MAX_FPS)) {
            requestAnimationFrame(this.gameLoop);
            return;
        }
        this.deltaTime += timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;

        this.handleInput();

        // Fixed timestep update
        while (this.deltaTime >= GAME_SETTINGS.TIMESTEP) {
            this.update();
            this.deltaTime -= GAME_SETTINGS.TIMESTEP;
        }

        this.draw();
        requestAnimationFrame(this.gameLoop);
    }

    private calculateBoundaries(buffer: number = GAME_SETTINGS.BOUNDARY_BUFFER): Boundaries {
        return {
            MIN_X: -buffer, 
            MIN_Y: -buffer, 
            MAX_X: this.ctx.canvas.width + buffer, 
            MAX_Y: this.ctx.canvas.height + buffer
        };
    }

    private cleanUpAllDestroyed() {
        this.asteroids = this.asteroids.filter(a => !a.destroyed);
        this.bullets = this.bullets.filter(b => !b.destroyed);
    }
}
