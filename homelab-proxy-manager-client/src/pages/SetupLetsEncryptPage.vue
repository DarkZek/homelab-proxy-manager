<template>
  <q-page class="row items-center justify-evenly">
    <flat-card>
      <q-form @submit="setupHttps" class="q-pa-lg">
        <span class="text-bold text-center full-width block text-h6" style="font-size: ">Setup Let's Encrypt</span>
        <br>
        <span class="text-center full-width block">To allow your server to accept HTTPS connections Homelab Proxy Manager utilises Let's Encrypt.</span>
        <br>
        <a href="https://community.letsencrypt.org/tos" target="_blank" class="full-width block text-center">Let's Encrypt Terms of Service</a>
        <br>
        <custom-input
            outlined
            class="q-mb-sm"
            v-model="httpsContactEmail"
            label="Contact Email"
            type="email"
            required
            placeholder="example@gmail.com"
            autocomplete="email" />
        <custom-checkbox label="Accept Lets Encrypt TOS" v-model="httpsTos" required />
        <br>
        <q-btn class="styled full-width" no-caps rounded type="submit" label="Enable Let's Encrypt" :loading="loading" />
        <q-btn flat class="full-width" no-caps rounded type="button" label="Skip" @click="router.push('/setup/validation')" />
      </q-form>
    </flat-card>
  </q-page>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import RestApiClient from '../client/RestApiClient';
import { useRouter } from 'vue-router';
import CustomInput from 'src/components/CustomInput.vue';
import FlatCard from 'src/components/FlatCard.vue';
import CustomCheckbox from 'src/components/CustomCheckbox.vue';

const router = useRouter();

const loading = ref(false);

const httpsTos = ref(false);
const httpsContactEmail = ref('');

async function setupHttps() {
  loading.value = true;
  try {
    await RestApiClient.setupHttps({
      tos: httpsTos.value,
      email: httpsContactEmail.value,
    });

    router.replace('/setup/validation');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">

.flat-card {
  max-width: 400px;
}

</style>