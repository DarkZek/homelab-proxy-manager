<template>
  <q-page class="row items-center justify-evenly">
    <q-form @submit="create">
      <q-card class="q-pa-xl">
        <q-chip v-for="domain of domains" :key="domain" removable @remove="domains.splice(domains.indexOf(domain), 1)">
          {{ domain }}
        </q-chip>
        <q-input
          v-model="newDomain"
          @keydown.enter.prevent="submitDomain"
          placeholder="Domain Name"
          :rules="[
            (val: any) => /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/.test(val) || val == '' || 'Invalid domain name'
          ]"
          ref="newDomainObject"
          lazy-rules ></q-input>

          <q-separator />

          <div>
            <div class="row items-center justify-evenly destinations">
              <div :class="{'destination-type': true, active: destinationType === ProxyDestinationType.DOCKER}" @click="destinationType = ProxyDestinationType.DOCKER">
                <q-icon name="fa-brands fa-docker" size="xl" />
              <a>Docker</a>
              </div>
              <div :class="{'destination-type': true, active: destinationType === ProxyDestinationType.LOCAL}" @click="destinationType = ProxyDestinationType.LOCAL">
                <q-icon name="computer" size="xl" />
              <a>Local Port</a>
              </div>
              <div :class="{'destination-type': true, active: destinationType === ProxyDestinationType.PUBLIC}"  @click="destinationType = ProxyDestinationType.PUBLIC">
                <q-icon name="public" size="xl" />
              <a>Other</a>
              </div>
            </div>

            <docker-destination v-if="destinationType === ProxyDestinationType.DOCKER" />
              
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
import DockerDestination from '../components/Proxy/DockerDestination.vue';

const router = useRouter();

const loading = ref(false);

const newDomain = ref('');
const newDomainObject = ref();
const domains = ref<string[]>([]);

const destinationType = ref(ProxyDestinationType.DOCKER);

function submitDomain() {
  if (!newDomainObject.value.validate()) {
    return;
  }

  domains.value.push(newDomain.value);
  newDomain.value = '';
}

function create() {
  loading.value = true;

  RestApiClient.createProxy({
    domains: domains.value,
    forward_type: destinationType.value,
    forward_ip: dockerHost.value!.label,
    forward_port: dockerPort.value!.value,
    status: ProxyStatus.ACTIVE,
  }).then((proxy) => {
    router.push(`/proxy/${proxy.data.id}`);
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