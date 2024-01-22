<template>
  <q-page class="row items-center justify-evenly">
    <flat-card>
      <q-form @submit.prevent="register" class="q-pa-xl">
        <div>
          <span class="text-bold text-center full-width block text-h6" style="font-size: ">Setup Homelab Proxy Manager</span>
          <br>
          <span class="text-center full-width block">Setup your instance of Homelab Proxy Manager with an account</span>
          <br>
          <custom-input
            outlined
            class="q-mb-sm"
            v-model="firstName"
            label="First Name"
            required
            placeholder="John"
            autocomplete="given-name" />
          <custom-input
            outlined
            class="q-mb-sm"
            v-model="lastName"
            label="Last Name"
            required
            placeholder="Doe"
            autocomplete="family-name" />
          <custom-input
            outlined
            class="q-mb-sm"
            v-model="email"
            label="Email"
            type="email"
            required
            placeholder="example@gmail.com"
            autocomplete="email" />
          <custom-input
            outlined
            class="q-mb-sm"
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
            label="Create Account"
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
import CustomInput from 'src/components/CustomInput.vue';
import FlatCard from 'src/components/FlatCard.vue';

const router = useRouter();

const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');

const loading = ref(false);

async function register() {
  loading.value = true;
  try {
    const response = await RestApiClient.register({
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
    });

    localStorage.setItem('token', response.data.access_token);

    router.push('/setup/letsencrypt');
  } catch (error: any) {
    if (error.response.status === 401) {
      alert('Invalid credentials');
    } else {
      alert('Something went wrong');
    }
  } finally {
    loading.value = false;
  }
}
</script>
