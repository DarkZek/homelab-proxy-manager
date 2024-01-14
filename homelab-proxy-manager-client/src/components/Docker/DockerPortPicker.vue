<template>
    <q-select
        :loading="loading"
        options-dense
        filled
        placeholder="Container Port"
        :model-value="selectedPortBind"
        @update:model-value="setSelectedPort"
        use-input
        hide-selected
        fill-input
        :options="dockerPortsOptions"
        :disable="dockerPortsOptions.length === 0"
        @filter="containerPortFilterFn"
        input-debounce="0" />
</template>

<script setup lang="ts">
import RestApiClient from 'src/client/RestApiClient';
import { ref, watch, computed } from 'vue';

const loading = ref(false);

// The currently selected port
const selectedPort = defineModel<string | undefined>();
const portsData = ref<string[]>([]);

const hostBind = defineProps<{ host: string | undefined }>();

// The formatted port to display in the q-select
const selectedPortBind = computed(() => {
    if (selectedPort.value === undefined) {
        return undefined;
    }
    
    const isCustom = !portsData.value.some((v) => v === selectedPort.value);
    return {
        label: `${isCustom ? '[Custom]' : ''} ${selectedPort.value}`,
        value: selectedPort.value
    };
});

function setSelectedPort(value: { label: string, value?: string} | undefined) {
    selectedPort.value = value?.value;
}

// Format the docker ports in a dropdown format
const dockerPortsOptions = computed(() => {
    let options = portsData.value.map((row) => {
      return {
        label: row,
        value: row,
      };
    });

  if (selectedPort.value === undefined || portsData.value.some((v) => v === selectedPort.value)) {
    // If the custom port is empty or already exists in the list, then don't show it
    return options;
  } else {
    // Append a custom option to the front to allow arbitrary ports
    return [
        {label: `[Custom] ${selectedPort.value}`, value: selectedPort.value }, 
        ...options
    ]
  }
});

// When the host field is updated, reset the port field and load the containers ports
watch(() => hostBind.host, (newValue, oldValue) => {
    // If the value was changed from one container to another, reset port
  if (oldValue !== undefined) {
    selectedPort.value = undefined;
  }

  updatePorts();
});

function updatePorts() {
  loading.value = true;

    RestApiClient.getDockerPorts(hostBind.host).then((ports) => {
        portsData.value = ports.data;
    }).finally(() => {
        loading.value = false;
    })
}

if (hostBind.host !== undefined) {
  updatePorts();
}

// Update the dropdown list with the custom port option while the user types in
function containerPortFilterFn(value: string, done: () => void) {
  if (value !== '' && !Number.isNaN(parseInt(value.trim())) && parseInt(value.trim()) >= 0) {
    selectedPort.value = value.trim();
  }
  done()
}

</script>