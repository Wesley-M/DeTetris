import Sound from "../../engine_sherlock/utils/Sound.js"

const pieces_states = {
    "point": [
        [1]
    ],
    "square": [
        [1, 1],
        [1, 1]
    ],
    "z": [
        [1, 1, 0],
        [0, 1, 1]
    ],
    "t": [
        [0, 1, 0],
        [1, 1, 1]
    ],
    "line": [
        [1],
        [1],
        [1],
        [1]
    ],
    "l": [
        [1, 1],
        [0, 1],
        [0, 1]
    ]
}

const vividColors = [
    "#BDB76B",
    "#DAA520",
    "#B8860B",
    "#8B4513",
    "#A0522D",
    "#BC8F8F",
    "#CD853F",
    "#D2691E",
    "#F4A460"
];

const colors = [
    "#95190C", // Falu Red
    "#3F190C", // Brown pod
    "#C2190C", // Free speech red
    "#C21990", // Medium violet red
    "#E319FF", // Psychedelic purple
    "#721988", // Vivid violet
    "#431075", // Indigo
    "#341988", // Persian Indigo
    "#1442AF", // Egyptian blue
    "#105E9D", // Endeavour
    "#107E7D", // Teal
    "#10AEAD", // Light sea green
    "#10CCCC", // Robin's Egg Blue
    "#10CC62", // Malachite
    "#10AE2E", // Dark pastel green
    "#6BAE2E", // Christi
    "#9BDE2E", // Yellow Green
    "#BBBBBB", // Silver
    "#FFD700", // Gold
    "#CD7F32" // Bronze
];

const sounds = {
    "background": new Sound("../res/sounds/back.mp3", 0.4, true),
    "collision": new Sound("../res/sounds/collision.wav", 0.8, false),
    "move": new Sound("../res/sounds/move.mp3", 0.8, false),
    "game_over": new Sound("../res/sounds/game_over.wav", 1, false),
    "complete_line": new Sound("../res/sounds/completeLine.mp3", 1, false),
};

export { pieces_states, colors, vividColors, sounds };