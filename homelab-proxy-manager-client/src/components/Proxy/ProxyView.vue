<template>
    <flat-card class="proxy-view">
        <div class="row">
            <div class="logo q-mr-lg">
                <q-avatar size="75px" font-size="40px" color="primary" text-color="white">
                    <q-img :src="`http://${props.proxy.domain}/favicon.ico`">
                        <template v-slot:error>
                            <div class="absolute-full flex flex-center bg-primary text-blue-6">
                            ?
                            </div>
                            <q-tooltip anchor="top middle" self="bottom middle">
                                Domain {{ props.proxy.domain }} provides no /favicon.ico file
                            </q-tooltip>
                        </template>
                    </q-img>
                </q-avatar>
            </div>
            <div class="details col q-mr-md flex-grow">
                <div class="row text-bold q-mt-sm q-mb-sm">
                    <span>{{ props.proxy.name ?? 'Nameless' }}</span>
                    <q-space />
                    <div class="text-green-4 status" v-if="props.proxy.status === ProxyStatus.ACTIVE">
                        <div class="status-point bg-green-4"></div>
                        Active
                    </div>
                    <div class="text-orange-4 status" v-if="props.proxy.status === ProxyStatus.INACTIVE">
                        <div class="status-point bg-orange-4"></div>
                        Inactive
                    </div>
                    <div class="text-grey-7 status" v-if="props.proxy.status === ProxyStatus.UNKNOWN">
                        <div class="status-point bg-grey-7"></div>
                        Unknown
                    </div>
                </div>
                <div class="row">
                    <q-icon :name="props.proxy.supportsHttps ? 'o_lock' : 'o_lock_open'" :color="props.proxy.supportsHttps ? 'text' : 'red-8'" class="q-pt-xs q-pr-xs" />
                    <span class="domain">{{ props.proxy.domain }}</span>
                    <q-icon name="o_arrow_forward" size="16px" class="q-pt-sm" />
                    <q-space />
                    <div class="destination" v-if="props.proxy.destinationType === ProxyDestinationType.DOCKER">
                        <q-icon name="fa-brands fa-docker" class="q-mr-sm" size="20px" />
                        <span class="q-mr-md">{{ props.proxy.forwardIp }}</span>
                        <q-icon name="o_lan" size="20px" />
                        {{ props.proxy.forwardPort }}
                    </div>
                    <div class="destination" v-if="props.proxy.destinationType === ProxyDestinationType.LOCAL">
                        <q-icon name="o_lan" size="20px" />
                        {{ props.proxy.forwardPort }}
                    </div>
                    <div class="destination" v-if="props.proxy.destinationType === ProxyDestinationType.PUBLIC">
                        <q-icon name="o_cloud" class="q-mr-sm" size="20px" />
                        <span class="q-mr-md">{{ props.proxy.forwardIp }}</span>
                        <q-icon name="o_lan" size="20px" />
                        {{ props.proxy.forwardPort }}
                    </div>
                </div>
            </div>
        </div>
    </flat-card>
</template>

<script lang="ts" setup>
import FlatCard from '../FlatCard.vue';
import { defineProps } from 'vue';
import { Proxy } from '@backend/models/Proxy/Proxy';
import { ProxyStatus } from '@backend/types/ProxyStatus';
import { ProxyDestinationType } from '@backend/types/ProxyDestinationType';

const props = defineProps<{ proxy: Proxy }>();

</script>

<style lang="scss" scoped>

.q-avatar {
    filter: $shadow;
}

.status-point {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 4px;
}

.status > * {
    display: inline-block;
}

.details {
    font-size: 18px;
}

.domain {
    min-width: 45%;
    max-width: 45%;
    overflow: hidden;
    text-overflow: ellipsis;
}

.proxy-view {
    color: $text;
}

</style>