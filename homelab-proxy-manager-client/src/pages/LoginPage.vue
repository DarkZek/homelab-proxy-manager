<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-form @submit="login" class="q-pa-lg">
        <a>Homelab Proxy Manager</a>
        <br>
        <a>Login</a>
        <q-input outlined v-model="email" label="Email" type="email" />
        <q-input outlined v-model="password" label="Password" type="password" />
        <q-btn
          class="q-mt-md"
          color="primary"
          label="Login"
          type="submit"></q-btn>
        </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RestApiClient from '../client/RestApiClient';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');

async function login() {
  try {
    const response = await RestApiClient.login({
      email: email.value,
      password: password.value
    });

    localStorage.setItem('token', response.data.access_token);

    const user = response.data.user;

    router.replace('/');
  } catch (error: any) {
    if (error.response.status === 401) {
      alert('Invalid credentials');
    } else {
      alert('Something went wrong');
    }
  }
}
</script>
