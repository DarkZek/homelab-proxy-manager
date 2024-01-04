<template>
  <q-page class="row items-center justify-evenly">
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
              v-if="props.row.destination.type === ProxyDestinationType.DOCKER"
            ></q-icon>
            <a class="q-pl-sm"
              >{{ props.row.destination.name }}:{{
                props.row.destination.port
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
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ProxyStatus } from '@backend/types/ProxyStatus';
import { ProxyDestinationType } from '@backend/types/ProxyDestinationType';
import RestApiClient from '../client/RestApiClient';

const columns = [
  { label: 'Domain', name: 'domains' },
  { label: 'Destination', name: 'destination' },
  { label: 'Status', name: 'status' },
];

const rows = [
  {
    domains: ['plex.marshalldoes.dev'],
    destination: { type: 'DOCKER', name: 'plex:latest', port: '32400' },
    status: ProxyStatus.ACTIVE,
  },
  {
    domains: ['home.marshalldoes.dev', 'test.marshalldoes.dev'],
    destination: { type: 'DOCKER', name: 'wordpress:latest', port: '80' },
    status: ProxyStatus.INACTIVE,
  },
];

RestApiClient.getAllProxies().then((proxies) => {
  console.log(proxies);
})
</script>
