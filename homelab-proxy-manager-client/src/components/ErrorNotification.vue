<template>
    <div class="notifications">
        <transition-group name="notify">
            <div v-for="error of displayedErrors" :key="error.id">
                <div class="error-notification">
                    <q-btn
                        dense
                        round
                        outlined
                        icon="close"
                        text-color="red-8"
                        @click.prevent="removeError(error.id)"
                        color="white" />
                    <q-icon name="error" class="q-pr-sm"></q-icon>
                    <a>{{ error.message }}</a>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const MAX_DISPLAYED_ERRORS = 3;
const DISPLAYED_DURATION_MS = 10_000;

const displayedErrors = ref<{ id: string, message: string }[]>([]);
const errors = ref<{ id: string, message: string }[]>([]);

window.logError = (error: string) => {

    errors.value.push({ id: Math.random().toString(), message: error });

    tryShow();
}

// Try to show another message
function tryShow() {
    if (displayedErrors.value.length < MAX_DISPLAYED_ERRORS && errors.value.length > 0) {
        const error = errors.value.shift()!;
        // There's a slot, add an error
        displayedErrors.value.push(error);

        // Create a timeout to hide the error
        setTimeout(() => {
            removeError(error.id);
            tryShow();
        }, DISPLAYED_DURATION_MS);
    }
}

function removeError(id: string) {
    displayedErrors.value = displayedErrors.value.filter((e) => e.id !== id);
}

</script>

<style lang="scss" scoped>

.notifications {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 10;
}

.error-notification {
    background: $red-8;
    color: #ffffff;
    padding: 15px;
    border-radius: 15px;
    margin-top: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    transition: all 0.5s ease;
    max-width: min(400px, 90vw);
    word-break: break-all;
    position: relative;

    .q-btn {
        opacity: 0;
        transition: opacity 0.1s ease-in-out;
        position: absolute;
        right: 10px;
        top: 10px;
    }

    &:hover .q-btn {
        opacity: 1;
    }
}

.notify-enter-active,
.notify-leave-active {
  transition: transform .2s, opacity .2s ease-out;
  transition-timing-function: cubic-bezier(.09,.62,.61,.95);
}

.notify-enter-from {
  transform: translateY(40px);
}
.notify-leave-to {
  opacity: 0;
}

</style>