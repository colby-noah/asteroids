import type { Position, Boundaries, AsteroidSizes } from "./types";
import { GameState } from "./types";
import { GAME_SETTINGS, PLAYER_SETTINGS, ASTEROID_SETTINGS } from "./constants";
import Input from "./input";
import Player from "./entities/player";
import Asteroid from "./entities/asteroid";
import Bullet from "./entities/bullet";
import Effect from "./effects/effect";
import Explosion from "./effects/explosion";
import PlayerDeath from "./effects/player-death";


export default class Asteroids {
    private ctx: CanvasRenderingContext2D;
    private boundaries: Boundaries;

    // Game loop time variables
    private deltaTime: number = 0;
    private lastFrameTimeMs: DOMHighResTimeStamp = 0;

    private input: Input;
    private player: Player;
    private asteroids: Asteroid[] = [];
    private bullets: Bullet[] = [];
    private effects: Effect[] = [];

    // Game state
    private state: GameState = GameState.PLAYING;
    private score: number = 0;
    private lives: number = GAME_SETTINGS.STARTING_LIVES;
    private round: number = 1;

    private deadTimer: number = 0;
    private roundClearTimer: number = 0;

    constructor({ ctx }: { ctx: CanvasRenderingContext2D }) {
        this.ctx = ctx;
        this.boundaries = this.calculateBoundaries();
        this.input = new Input();
        this.player = new Player({
            position: { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 4 },
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
            size: "large",
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

    private handleCollisions() {
        // Check asteroid collisions
        for (const asteroid of this.asteroids) {
            if (!this.player.destroyed && this.player.collidesWith(asteroid)) {
                this.player.destroyed = true;

                // Update game state for player death
                this.lives--;
                this.state = GameState.PLAYER_DEAD;
                this.deadTimer = 0;

                this.effects.push(new PlayerDeath({
                    position: { x: this.player.position.x, y: this.player.position.y }, 
                    playerScale: this.player.scale
                }));
            }
            // Bullet collisions here
            for (const bullet of this.bullets) {
                if (bullet.destroyed) continue;
                if (bullet.collidesWith(asteroid)) {
                    bullet.destroyed = true;

                    this.score += ASTEROID_SETTINGS.SCORE[asteroid.size];

                    this.effects.push(new Explosion({
                        position: { x: asteroid.position.x, y: asteroid.position.y }
                    }));

                    this.splitAsteroid(asteroid);
                    break;
                }
            }
        }
    }

    private randomSpawnPosition() {
        const safeRadiusSq = GAME_SETTINGS.SPAWN_SAFE_RADIUS ** 2;
        let position: Position;
        let dx: number;
        let dy: number;

        do {
            position = {
                x: Math.random() * this.ctx.canvas.width,
                y: Math.random() * this.ctx.canvas.height
            };

            dx = position.x - this.player.position.x;
            dy = position.y - this.player.position.y;
        } while (((dx ** 2) + (dy ** 2)) < safeRadiusSq);

        return position
    }

    private spawnAsteroids() {
        // Number of asteroids to spawn
        const count = ASTEROID_SETTINGS.STARTING_COUNT + (this.round - 1) * ASTEROID_SETTINGS.COUNT_INCREMENT;
        for (let i = 0; i < count; i++) {
            const position = this.randomSpawnPosition();
            this.asteroids.push(new Asteroid({
                position,
                velocity: {
                    x: (Math.random() - 0.5) * ASTEROID_SETTINGS.SPAWN_SPEED, 
                    y: (Math.random() - 0.5) * ASTEROID_SETTINGS.SPAWN_SPEED 
                }, 
                rotation: Math.random() * (Math.PI * 2),
                size: "large", 
                color: "white"
            }));
        }
    }

    private respawnPlayer() {
        this.player.position = {
            x: this.ctx.canvas.width / 2,
            y: this.ctx.canvas.height / 2
        };

        this.player.velocity = { x: 0, y: 0 };

        this.player.destroyed = false;
    }

    private handlePlayerDead() {
        this.deadTimer += this.deltaTime;
        if (this.deadTimer >= GAME_SETTINGS.DEAD_DURATION) {
            if (this.lives > 0) {
                this.respawnPlayer();
                this.state = GameState.PLAYING;
            }
            else {
                this.state = GameState.GAME_OVER;
            }
        }
    }

    private handleRoundCleared() {
        this.roundClearTimer += this.deltaTime;

        if (this.roundClearTimer >= GAME_SETTINGS.ROUND_CLEAR_DURATION) {
            this.roundClearTimer = 0;
            this.round++;
            this.spawnAsteroids();
            this.state = GameState.PLAYING;
        }
    }

    private update() {
        if (!this.player.destroyed) {
            this.player.handleBoundaries(this.boundaries);
            this.player.update(this.deltaTime);
        }

        this.asteroids.forEach(a => {
            a.handleBoundaries(this.boundaries);
            a.update(this.deltaTime);
        });

        // Bullets and effects don't wrap the screen
        this.bullets.forEach(b => b.update(this.deltaTime));
        this.effects.forEach(e => e.update(this.deltaTime));

        this.handleCollisions();

        // Destroy Entities
        this.cleanUpAllDestroyed();

        if (this.state === GameState.PLAYING && this.asteroids.length === 0) {
            this.state = GameState.ROUND_CLEAR;
        }
        else if (this.state === GameState.PLAYER_DEAD) {
            this.handlePlayerDead();
        }
        else if (this.state === GameState.ROUND_CLEAR) {
            this.handleRoundCleared();
        }
    }

    private draw() {
        // Reset screen
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw the player
        if (!this.player.destroyed) {
            this.player.draw(this.ctx);
        }

        this.asteroids.forEach(a => a.draw(this.ctx));
        this.bullets.forEach(b => b.draw(this.ctx));
        this.effects.forEach(e => e.draw(this.ctx));
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
        
        // Cap deltaTime to avoid death spiral after heavy frames 
        this.deltaTime = Math.min(this.deltaTime, GAME_SETTINGS.MAX_DELTATIME);

        if (!this.player.destroyed && (this.state === GameState.PLAYING || this.state === GameState.ROUND_CLEAR)) {
            this.handleInput();
        }

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
        this.bullets = this.bullets.filter(b => !b.destroyed && !b.isExpired);
        this.effects = this.effects.filter(e => !e.isExpired);
    }

    public splitAsteroid(asteroid: Asteroid) {
        const newAsteroidSize: AsteroidSizes | null = asteroid.size === "large" ? "medium" 
                                                    : asteroid.size === "medium" ? "small" 
                                                    : null;

        if (newAsteroidSize) {
            for (let i = 0; i < 2; i++) {
                this.asteroids.push(new Asteroid({
                    position: { x: asteroid.position.x, y: asteroid.position.y }, 
                    velocity: {
                        x: (Math.random() - 0.5) * ASTEROID_SETTINGS.SPLIT_SPEED, 
                        y: (Math.random() - 0.5) * ASTEROID_SETTINGS.SPLIT_SPEED
                    }, 
                    rotation: Math.random() * Math.PI * 2, 
                    size: newAsteroidSize, 
                    color: "white"
                }));
            }
        }

        asteroid.destroyed = true;
    }
}
