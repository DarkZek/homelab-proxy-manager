<template>
  <q-page class="row items-center justify-evenly">
    <q-form @submit="update">
      <q-card class="q-pa-xl">
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

          <q-btn type="submit" label="Save" :loading="loading" />
      </q-card>

      <q-btn color="red-6" label="Delete" @click="deleteProxy" />
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ProxyDestinationType } from '@backend/types/ProxyDestinationType';
import RestApiClient from '../client/RestApiClient';
import { ProxyStatus } from '@backend/types/ProxyStatus';
import DockerDestination from '../components/Docker/DockerDestination.vue';

const router = useRouter();
const route = useRoute();

const loading = ref(false);

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

async function update() {
  loading.value = true;

  try {
    await RestApiClient.updateProxy(route.params.id, {
      domain: domain.value,
      forward_type: destinationType.value,
      forward_ip: dockerHost.value!,
      forward_port: dockerPort.value!,
      forward_https: forwardHttps.value,
      supports_https: supportsHttps.value,
      status: ProxyStatus.ACTIVE,
    });

    await RestApiClient.updateProxies();

    router.push('/');
  } finally {
    loading.value = false;
  }
}

// Load info
RestApiClient.getProxy(route.params.id).then((proxy) => {
  domain.value = proxy.data.domain;
  destinationType.value = proxy.data.forward_type;
  dockerHost.value = proxy.data.forward_ip;
  dockerPort.value = proxy.data.forward_port;
  forwardHttps.value = proxy.data.forward_https;
  supportsHttps.value = proxy.data.supports_https;
});

function deleteProxy() {
  RestApiClient.deleteProxy(route.params.id).then(() => {
    router.push('/');
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