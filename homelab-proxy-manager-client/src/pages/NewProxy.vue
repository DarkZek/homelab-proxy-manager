<template>
  <q-page class="row items-center justify-evenly">
    <q-form @submit="create">
      <q-card class="q-pa-xl">
        <q-input v-model="name" label="Name"></q-input>
        <q-input
          v-model="domain"
          placeholder="Domain Name"
          @keydown.enter.prevent="submitDomain"
          :rules="[
            (val: any) => /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/.test(val) || val == '' || 'Invalid domain name'
          ]"
          lazy-rules ></q-input>

          <q-separator />

          <div>
            <div class="row items-center justify-evenly destinations">
              <div :class="{'destination-type': true, active: destinationType === ProxyDestinationType.DOCKER}" @click="destinationType = ProxyDestinationType.DOCKER">
                <q-icon name="fa-brands fa-docker" size="xl" />
              <a>Docker</a>
              </div>
              <div :class="{'destination-type': true, active: destinationType === ProxyDestinationType.LOCAL}" @click="destinationType = ProxyDestinationType.LOCAL">
                <q-icon name="o_computer" size="xl" />
              <a>Local Port</a>
              </div>
              <div :class="{'destination-type': true, active: destinationType === ProxyDestinationType.PUBLIC}"  @click="destinationType = ProxyDestinationType.PUBLIC">
                <q-icon name="o_public" size="xl" />
              <a>Other</a>
              </div>
            </div>

            <docker-destination
              v-if="destinationType === ProxyDestinationType.DOCKER"
              v-model:host="dockerHost"
              v-model:port="dockerPort" />


            <q-toggle label="Forward is HTTPS" v-model="forwardHttps" />
              
          </div>

          <div>
            <q-toggle label="Supports HTTPS" v-model="supportsHttps" />

            <q-btn label="Generate Certificates" @click=generateCertificates />

            <a>
              {{ generatingStatus }}
            </a>
          </div>

          <q-btn type="submit" label="Create" :loading="loading" />
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ProxyDestinationType } from '../../../homelab-proxy-manager-server/src/api/types/ProxyDestinationType';
import RestApiClient from '../client/RestApiClient';
import { ProxyStatus } from '@backend/types/ProxyStatus';
import DockerDestination from '../components/Docker/DockerDestination.vue';

const router = useRouter();

const loading = ref(false);

const name = ref('');

const domain = ref<string>('');

const dockerHost = ref(undefined)
const dockerPort = ref(undefined)

const destinationType = ref(ProxyDestinationType.DOCKER);

const forwardHttps = ref(false);

const supportsHttps = ref(true);

const generatingStatus = ref('Processing');

function submitDomain() {
  // TODO: Validate it's accessable
}

function generateCertificates() {
    RestApiClient.generateCertificate(domain.value).then(() => {
      generatingStatus.value = 'Success';
    }).catch(() => {
      generatingStatus.value = 'Error';
    });
}


function create() {
  loading.value = true;

  RestApiClient.createProxy({
    name: name.value,
    domain: domain.value,
    destinationType: destinationType.value,
    forwardIp: dockerHost.value!,
    forwardPort: dockerPort.value!,
    forwardHttps: forwardHttps.value,
    supportsHttps: supportsHttps.value,
    status: ProxyStatus.ACTIVE,
  }).then((proxy) => {
    router.push(`/proxies/${proxy.data.id}`);
  }).finally(() => {
    loading.value = false;
  });
}



</script>

<style scoped lang="scss">

.destination-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 5px 20px;
  cursor: pointer;

  .q-icon {
    padding-bottom: 10px;
  }

  a {
    font-weight: bold;
  }

  &:not(.active) {
    color: $grey-6;
  }
}

.destinations {
  padding: 20px 40px;
}

</style>