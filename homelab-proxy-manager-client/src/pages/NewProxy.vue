<template>
  <q-page class="row items-center justify-evenly">
    <q-form @submit="create">
      <q-card>
        <q-chip v-for="domain of domains" :key="domain" removable @remove="domains.splice(domains.indexOf(domain), 1)">
          {{ domain }}
        </q-chip>
        <q-input
          v-model="newDomain"
          @keydown.enter="submitDomain"
          :rules="[
            (val: any) => /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/.test(val) || val == '' || 'Invalid domain name'
          ]"
          ref="newDomainObject"
          lazy-rules ></q-input>
      </q-card>
      <q-btn type="submit" label="Create" :loading="loading" />
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ProxyStatus } from '@backend/types/ProxyStatus';
import { ProxyDestinationType } from '@backend/types/ProxyDestinationType';
import RestApiClient from '../client/RestApiClient';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loading = ref(false);

const newDomain = ref('');
const newDomainObject = ref();
const domains = ref<string[]>([]);

function submitDomain() {
  if (!newDomainObject.value.validate()) {
    return;
  }

  domains.value.push(newDomain.value);
  newDomain.value = '';
}

function create() {
  loading.value = true;
  alert('create')
}
</script>
