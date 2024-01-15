<template>
    <flat-card class="q-pa-lg full-width">
        <div class="row">
            <div class="col">
                <a class="title">Select a destination</a>
                <br>
                <span class="content">The destination will be where traffic from your domain will be routed to. </span>
            </div>
            <div class="col"></div>
        </div>
        <br>
        <div class="row destinations">
            <div class="col">
                <div class="destination" :active="destinationType === ProxyDestinationType.DOCKER" @click.prevent="destinationType = ProxyDestinationType.DOCKER">
                    <q-icon name="fa-brands fa-docker" />
                    <span>Docker</span>
                </div>
            </div>
            <div class="col">
                <div class="destination" :active="destinationType === ProxyDestinationType.LOCAL" @click.prevent="destinationType = ProxyDestinationType.LOCAL">
                    <q-icon name="o_computer" />
                    <span>Local</span>
                </div>
            </div>
            <div class="col">
                <div class="destination" :active="destinationType === ProxyDestinationType.PUBLIC" @click.prevent="destinationType = ProxyDestinationType.PUBLIC">
                    <q-icon name="o_public" />
                    <span>Other</span>
                </div>
            </div>
        </div>
    </flat-card>
</template>

<script lang="ts" setup>
import { ProxyDestinationType } from '@backend/types/ProxyDestinationType';
import FlatCard from '../FlatCard.vue';
import { defineEmits, defineModel } from 'vue';

const destinationType = defineModel<ProxyDestinationType>();
destinationType.value = ProxyDestinationType.DOCKER;

const emits = defineEmits(['next']);

function next() {
    emits('next');
}

</script>

<style lang="scss" scoped>

.destinations .col {
    padding: 10px;
}

.destination {
    border: #eeeeee 1px solid;
    border-radius: 15px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #757575;
    transition: color 0.3s, background-color 0.3s ease-in-out;
    cursor: pointer;

    &[active=true] {
        color: $text;
        background-color: #FBFBFB;
    }

    .q-icon {
        font-size: 4rem;
    }

    span {
        font-size: 1.7rem;
        font-weight: bold;
    }
}

</style>