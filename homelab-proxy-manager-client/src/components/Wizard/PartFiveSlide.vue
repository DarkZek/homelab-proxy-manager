<template>
    <flat-card class="q-pa-lg">
        <div class="row">
            <div class="col q-pr-md">
                <a class="title">Generate SSL Certificates</a>
                <br>
                <span class="content">SSL support is achieved using the http-01 challenge to prove ownership over your domain. This will allow HTTPS connection</span>
            </div>
            <div class="col q-pt-md">
                <div class="status full-width">
                    <transition name="transition">
                        <span v-if="status === Status.Waiting">Status: Waiting</span>
                    </transition>
                    <transition name="transition">
                        <span v-if="status === Status.Generating">Status: Generating</span>
                    </transition>
                    <transition name="transition">
                        <span v-if="status === Status.Success">Status: Success</span>
                    </transition>
                    <transition name="transition">
                        <span v-if="status === Status.Error">Status: Error</span>
                    </transition>
                </div>
                <q-btn
                    class="styled full-width q-mt-sm"
                    label="Generate Certificates"
                    no-caps
                    rounded
                    type="submit"
                    :disable="status === Status.Generating"
                    v-if="status !== Status.Success"
                    @click="generate" />
                <q-btn
                    class="styled full-width q-mt-sm"
                    label="Continue"
                    no-caps
                    rounded
                    type="submit"
                    v-else
                    @click="next" />
                <q-btn
                    class="full-width q-mt-sm"
                    label="Skip SSL"
                    color="grey-7"
                    :disable="status === Status.Generating"
                    flat
                    v-if="status !== Status.Success"
                    dense
                    no-caps
                    rounded @click.prevent="emits('next')" />
            </div>
        </div>
    </flat-card>
</template>

<script lang="ts" setup>
import FlatCard from '../FlatCard.vue';
import { defineEmits, ref } from 'vue';
import CustomInput from '../CustomInput.vue';
import RestApiClient from 'src/client/RestApiClient';
import { domainComparer } from '@backend/../utils/domainComparer';

const props = defineProps<{ domain: string }>();
const emits = defineEmits(['next']);
const supportsHttps = defineModel<boolean>();

enum Status {
    Waiting = 'Waiting',
    Generating = 'Generating',
    Success = 'Success',
    Error = 'Error'
}

const status = ref<Status>(Status.Waiting);

async function generate() {
    status.value = Status.Generating;

    try {
        await RestApiClient.generateCertificate(props.domain);
    
        status.value = Status.Success;
        supportsHttps.value = true;
    } catch (e) {
        status.value = Status.Error;
    }
}

function next() {
    emits('next');
}

// Try see if we already have certificate
RestApiClient.getAllCertificates().then((certificates) => {
    const certificate = certificates.data.rows.find((c) => domainComparer(c.domain, props.domain));

    if (certificate) {
        // No need to generate one
        supportsHttps.value = true;
        next();
    }
});

</script>

<style scoped lang="scss">

.status {
    filter: $shadow;
    border: 1px solid #e0e0e0;
    padding: 10px;
    text-align: center;
    border-radius: 10px;
    background-color: white;
    font-size: 18px;
    height: 50px;
    overflow: hidden;

    span {
        position: absolute;
        left: 0px;
        right: 0px;
    }
}

.transition-enter-active,
.transition-leave-active {
  transition: transform .15s ease-out;
  transition-timing-function: cubic-bezier(.09,.62,.61,.95);
  position: absolute;
}

.transition-enter-from {
  transform: translateY(30px);
}
.transition-leave-to {
  transform: translateY(-30px);
}

</style>