<template>
    <q-page class="row items-center justify-evenly">
      <q-card v-if="!registered">
        <q-form @submit="register" class="q-pa-lg">
          <a>Homelab Proxy Manager</a>
          <br>
          <a>Setup</a>
          <q-input outlined v-model="firstName" label="First Name"/>
          <q-input outlined v-model="lastName" label="Last Name" />
          <q-input outlined v-model="email" label="Email" type="email" />
          <q-input outlined v-model="password" label="Password" type="password" />
          <q-btn
            class="q-mt-md"
            color="primary"
            label="Login"
            type="submit"></q-btn>
          </q-form>
      </q-card>
      <q-card v-else>
        <q-form @submit="setupHttps" class="q-pa-lg">
          <q-checkbox label="Accept Lets Encrypt TOS" v-model="httpsTos" required />
          <q-input outlined v-model="httpsContactEmail" label="Contact Email" />
          <q-btn type="submit" label="Setup HTTPS Info" />
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
  const firstName = ref('');
  const lastName = ref('');

  const registered = ref(localStorage.getItem('token') !== null);
  
  async function register() {
    try {
      const response = await RestApiClient.register({
        email: email.value,
        password: password.value,
        first_name: firstName.value,
        last_name: lastName.value,
      });
  
      localStorage.setItem('token', response.data.access_token);
  
      registered.value = true;
    } catch (error: any) {
      if (error.response.status === 401) {
        alert('Invalid credentials');
      } else {
        alert('Something went wrong');
      }
    }
  }

  const httpsTos = ref(false);
  const httpsContactEmail = ref('');

  async function setupHttps() {

    await RestApiClient.setupHttps({
      tos: httpsTos.value,
      email: httpsContactEmail.value,
    });

    router.replace('/');
  }
  </script>
  