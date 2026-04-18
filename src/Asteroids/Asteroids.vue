<script setup lang="ts">
    import { onMounted, useTemplateRef, ref } from "vue";
    import Asteroids from "./asteroids";

    const canvas = useTemplateRef<HTMLCanvasElement>("canvasRef");
    let ctx: CanvasRenderingContext2D | null | undefined;

    const uiState = ref<"title" | "playing" | "gameover">("title");
    const finalScore = ref(0);

    function startGame() {
        uiState.value = "playing";
        ctx = canvas.value?.getContext("2d");

        if (ctx) {
            const game = new Asteroids({
                ctx,
                onGameOver: (score: number) => {
                    finalScore.value = score;
                    uiState.value = "gameover";
                }
            });

            game.init();
        }
    }

    onMounted(() => {
        ctx = canvas.value?.getContext("2d");
    });
</script>

<template>
    <div class="game-container">
        <canvas ref="canvasRef" width="700" height="700" class="game-view" />
        <div v-if="uiState === 'title'" class="overlay">
            <h1>ASTEROIDS</h1>
            <button @click="startGame">START</button>
        </div>
        <div v-if="uiState === 'gameover'" class="overlay">
            <h1>GAME OVER</h1>
            <p>Score: {{ finalScore }}</p>
            <button @click="startGame">PLAY AGAIN</button>
        </div>
    </div>
</template>

<style>
.game-container {
    position: relative;
    display: inline-block;
}

.game-view {
    border: solid 1px white;
    background-color: black;
    display: block;
}

.overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
}
</style>
