<template>
  <q-page class="row items-center justify-evenly">
    <flat-card>
      <q-form @submit.prevent="login" class="q-pa-xl">
        <div>
          <span class="text-bold text-center full-width block text-h6" style="font-size: ">Login</span>
          <br>
          <span class="text-center full-width block" style="font-size: ">Login to Homelab Proxy Manager</span>
          <custom-input
            outlined
            v-model="email"
            label="Email"
            type="email"
            required
            placeholder="example@gmail.com"
            autocomplete="email" />
          <br>
          <custom-input
            outlined
            v-model="password"
            label="Password"
            required
            type="password"
            placeholder="**********"
            autocomplete="password" />
          <q-btn
            class="q-mt-md full-width styled text-white"
            rounded
            no-caps
            :loading="loading"
            label="Login"
            type="submit"></q-btn>
        </div>
        </q-form>
    </flat-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RestApiClient from '../client/RestApiClient';
import { useRouter } from 'vue-router';
import FlatCard from '../components/FlatCard.vue';
import CustomInput from '../components/CustomInput.vue';

const router = useRouter();

const email = ref('');
const password = ref('');

const loading = ref(false);

async function login() {
  loading.value = true;
  try {
    const response = await RestApiClient.login({
      email: email.value,
      password: password.value
    });

    localStorage.setItem('token', response.data.access_token);

    router.replace('/');
  } catch (error: any) {
    if (error.response.status === 401) {
      window.logError('Invalid username and password');
    } else {
      window.logError('Something went wrong: ' + error.response.data.message ?? 'Unknown error');
    }
  } finally {
    loading.value = false;
  }
}

// Check if setup is required
RestApiClient.checkSetup().then((val) => {
  if (val.data) {
    router.replace('/setup');
  }
})
</script>

<style lang="scss" scoped>

.custom-input {
  min-width: min(350px, 80vw);
}

</style>