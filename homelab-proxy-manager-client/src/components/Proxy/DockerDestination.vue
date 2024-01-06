<template>
    <div>
        <q-select :loading="dockerHostsLoading" filled placeholder="Docker Container" v-model="dockerHost" use-input hide-selected fill-input :options="dockerOptions">
            <template #append>
                <a class="docker-host" v-if="dockerHost.value">ID: {{ dockerHost.value }}</a>
                <q-btn flat round dense icon="refresh" @click.prevent="loadDockerHosts" />
            </template>
        </q-select>
        <br>
        <q-select :loading="dockerPortsLoading" options-dense filled placeholder="Container Port" v-model="dockerPort" use-input hide-selected fill-input :options="dockerPortsOptions" :disable="dockerPortsOptions.length === 0" @filter="containerPortFilterFn" input-debounce="0">
        </q-select>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import RestApiClient from '../../client/RestApiClient';

const dockerHost = ref('');
const dockerContainers = ref<{name: string, id: string}[]>([]);
const dockerHostsLoading = ref(true)

const dockerOptions = computed(() => dockerContainers.value.map((row) => {
  return {
    label: row.name,
    value: row.id,
  };
}));

// Load options
function loadDockerHosts() {
    dockerHostsLoading.value = true;
    RestApiClient.getDockerContainers().then((containers) => {
        dockerContainers.value = containers.data;
        dockerHostsLoading.value = false;
    });
}
loadDockerHosts();

const dockerPort = ref<{ label: string, value: string } | undefined>(undefined);
const dockerPortsLoading = ref(true);
const dockerPortsData = ref<{ label: string, value: string }[]>([]);
const customPort = ref('');
const dockerPortsOptions = computed(() => {
  if (customPort.value === '' || dockerPortsData.value.some((v) => v.label === customPort.value)) {
    // If the custom port is empty or already exists in the list, then don't show it
    return dockerPortsData.value;
  } else {
    return [{ label: `[Custom] ${customPort.value}`, value: customPort.value }, ...dockerPortsData.value]
  }
});

function containerPortFilterFn(value: string, done: () => void) {
  if (value !== '') {
    customPort.value = value.trim();
    // If the custom port has been typed, then select it
    if (dockerPortsData.value.some((v) => v.label === customPort.value)) {
      dockerPort.value = { label: customPort.value, value: customPort.value };
    }
  }
  done()
}

// When the host field is updated, reset the port field and load the containers ports
watch(() => dockerHost.value, (newValue: { label: string, value: string }) => {
  if (newValue === undefined) {
    dockerPortsData.value = [];
    return;
  }

  dockerPortsLoading.value = true;
  dockerPort.value = undefined;

  RestApiClient.getDockerPorts(newValue.value).then((ports) => {
    dockerPortsData.value = ports.data.map((port) => {
      return {
        label: port,
        value: port,
      };
    });

    dockerPortsLoading.value = false;
  });
});

</script>

<style lang="scss" scoped>

.docker-host {
  font-size: 14px;
}

</style>