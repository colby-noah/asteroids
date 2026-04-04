export const GAME_SETTINGS = {
    MAX_FPS: 60,
    TIMESTEP: 1000 / 60,

    // Physics
    FRICTION: 0.9995,
    RADIUS_MODIFIER: 0.8,
    
    // Non-visible part of the world on the edges
    BOUNDARY_BUFFER: 100
} as const;

export const PLAYER_SETTINGS = {
    ACCELERATION: 0.00025,
    ROTATION_SPEED: 0.002,
    MAX_SPEED: 0.25,
    SHAPE: [
        // Main triangle
        [
            [5, 0],
            [-4, 3],
            [-3, 1],
            [-3, -1],
            [-4, -3]
        ]
    ],
    THRUST_PATH: [
        [-3, 1],
        [-5, 0],
        [-3, -1]
    ],
} as const;

export const ASTEROID_SETTINGS = {
    MAX_SPEED: 30,
    POSSIBLE_SHAPES: [
        // 0
        [
            [
                [5, 0],
                [4, -4],
                [1, -5],
                [-2, -4],
                [-4, -4],
                [-5, -1],
                [-3, -1],
                [-5, 2],
                [-3, 3],
                [-2, 5],
                [0, 5],
                [3, 4],
                [4, 3],
                [4, 1]
            ]
        ],
        // 1 
        [
            [
                [5, 0],
                [4, -3],
                [3, -4],
                [0, -6],
                [-2, -4],
                [-4, -4],
                [-5, -1],
                [-4, 2],
                [-4, 3],
                [-3, 3],
                [-1, 5],
                [4, 3],
                [4, 1]
            ]
        ],
        // 2 
        [
            [
                [5, -1],
                [4, -3],
                [3, -5],
                [1, -4],
                [-2, -5],
                [-2, -3],
                [-4, -4],
                [-4, -2],
                [-5, 0],
                [-5, 3],
                [-3, 4],
                [-2, 3],
                [0, 5],
                [4, 3],
                [3, 2],
                [3, 1]
            ]
        ],
        // 3 
        [
            [
                [3, -2],
                [3, -4],
                [0, -5],
                [-2, -4],
                [-4, -4],
                [-4, -1],
                [-5, 1],
                [-3, 4],
                [-1, 5],
                [2, 5],
                [1, 3],
                [3, 4],
                [5, 1]
            ]
        ]
    ]
} as const;

export const BULLET_SETTINGS = {
    RADIUS: 5
} as const;
