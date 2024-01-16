<template>
    <flat-card class="q-pa-lg">
        <div class="row">
            <div class="col q-pr-md">
                <a class="title">Your domain is live</a>
                <br>
                <span class="content">Setup is complete and your domain is live.</span>
            </div>
            <div class="col q-pt-xs">
                <div class="row">
                    <q-img :src="`${props.supportsHttps ? 'https' : 'http'}://${props.domain}/favicon.ico`">
                        <template v-slot:error>
                            <div class="absolute-full flex flex-center bg-primary text-blue-6">
                            ?
                            </div>
                            <q-tooltip anchor="top middle" self="bottom middle">
                                Domain {{ props.domain }} provides no /favicon.ico file
                            </q-tooltip>
                        </template>
                    </q-img>
                    <div class="col">
                        <span>??</span>
                        <div class="row text-blue-6 overflow-hidden">
                            <a
                            :href="`${props.supportsHttps ? 'https' : 'http'}://${props.domain}/`"
                            target="_blank">
                            <q-icon name="o_open_in_new" />
                            {{props.supportsHttps ? 'https' : 'http'}}://{{ props.domain }}/
                        </a>
                        </div>
                    </div>
                </div>
                <q-btn
                    class="styled full-width q-mt-sm"
                    label="Go Home"
                    no-caps
                    rounded
                    type="submit"
                    @click="router.push('/')" />
            </div>
        </div>
    </flat-card>
</template>

<script lang="ts" setup>
import FlatCard from '../FlatCard.vue';
import { defineEmits, defineModel } from 'vue';
import CustomInput from '../CustomInput.vue';
import { useRouter } from 'vue-router';

const props = defineProps<{ domain: string, supportsHttps: boolean }>();

const router = useRouter();

</script>

<style scoped lang="scss">

.q-img {
    width: 60px;
    border-radius: 40px;
    filter: $shadow;
    margin-right: 20px;
}

</style>