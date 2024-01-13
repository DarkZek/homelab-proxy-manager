<template>
  <q-page class="row items-center justify-evenly">
    <q-btn label="New Proxy" @click="router.push('/proxies/new')" />
    <q-btn label="Update Proxies" @click="RestApiClient.updateProxies()" />
    <q-table :columns="columns" :rows="rows">
      <template #body="props">
        <q-tr :props="props">
          <q-td key="domains" :props="props">
            <q-badge
              color="grey-3"
              text-color="grey-8"
              class="q-mr-sm q-pa-sm"
              :label="domain"
              v-for="domain of props.row.domains"
              :key="domain"
            />
          </q-td>
          <q-td key="destination" :props="props">
            <q-icon
              name="fa-brands fa-docker"
              size="20px"
              v-if="props.row.forward_type === ProxyDestinationType.DOCKER"
            ></q-icon>
            <a class="q-pl-sm"
              >{{ props.row.forward_ip }}:{{
                props.row.forward_port
              }}</a
            >
          </q-td>
          <q-td key="status" :props="props">
            <q-badge
              color="green"
              text-color="white"
              class="q-mr-sm q-pa-sm"
              label="Active"
              v-if="props.row.status === ProxyStatus.ACTIVE"
            ></q-badge>
            <q-badge
              color="grey-3"
              text-color="grey-8"
              class="q-mr-sm q-pa-sm"
              label="Inactive"
              v-else
            ></q-badge>
          </q-td>
          <q-td key="edit" :props="props">
            <q-btn icon="edit" @click="router.push(`/proxies/${props.row.id}`)" dense flat color="grey-8" size="12px" round />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ProxyStatus } from '@backend/types/ProxyStatus';
import { ProxyDestinationType } from '@backend/types/ProxyDestinationType';
import RestApiClient from '../client/RestApiClient';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const columns = [
  { label: 'Domain', name: 'domains' },
  { label: 'Destination', name: 'destination' },
  { label: 'Status', name: 'status' },
  { label: '', name: 'edit' },
];

const rows = ref();

RestApiClient.getAllProxies().then((proxies) => {
  console.log(proxies.data.rows);
  rows.value = proxies.data.rows;
})
</script>
