export const GAME_SETTINGS = {
    MAX_FPS: 60,
    TIMESTEP: 1000 / 60,

    // Physics
    FRICTION: 0.98,

    // World
    WORLD_BOUNDARIES: {
        MIN_X: 0,
        MIN_Y: 0,
        MAX_X: 800,
        MAX_Y: 800,
    }
} as const;

export const PLAYER_SETTINGS = {
    ACCELERATION: 0.005,
    ROTATION_SPEED: 0.002,
    MAX_SPEED: 40,
    SHAPE: [
        // Main triangle
        [
            [20, 0],
            [-17, -12],
            [-17, 12]
        ],
        // Right extended line
        [
            [-17, 12],
            [-25, 15]
        ],
        // Left extended line
        [
            [-17, -12],
            [-25, -15]
        ]
    ],
} as const;

