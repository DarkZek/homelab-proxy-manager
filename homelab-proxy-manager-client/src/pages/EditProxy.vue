<template>
  <div class="header row q-px-md">
    <span class="title">Edit Proxy {{ name }}</span>
    <q-space />
    <q-btn
      class="q-ma-md styled"
      rounded
      :loading="loading"
      no-caps
      label="Apply Updates"
      @click="skipValidation = false; update()"/>
    <q-btn
      class="q-ma-md styled"
      rounded
      :loading="loading"
      no-caps
      label="Skip Validation"
      v-if="skipValidation"
      @click="update()"/>
  </div>
  <q-page class="row">
    <q-form @submit="update">
      <flat-card class="q-pa-lg">
          <div class="row">
              <div class="col q-pr-md">
                  <a class="title">Proxy domain name</a>
                  <br>
                  <span class="content">Your domain name is what you access the website from. This should be set this up to forward to this machine through your DNS provider.</span>
              </div>
              <div class="col">
                <custom-input
                  :disable="true"
                  v-model="domain"
                  label="Domain"
                  placeholder="mail.example.com"
                  :rules="[
                      (val: any) => /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/.test(val) || val == '' || 'Invalid domain name',
                      (val: any) => val.length <= 63 || 'Domain name must be less than 63 characters',
                      (val: any) => val.length >= 3 || 'Domain name must be at least 3 characters'
                  ]"/>
              </div>
          </div>
      </flat-card>
      <br>
      <part-three-slide
        v-model="destinationType"
        :standalone="true"
        v-model:destination="destination"/>
      <flat-card class="q-mt-md q-pa-lg">
          <div class="row">
              <div class="col">
                  <a class="title">HTTPS Support</a>
                  <br>
                  <span class="content">This will allow you to access your proxy on more devices, and provide a secure connection to your destination.</span>
              </div>
              <div class="col" v-if="!hasCertificate">
                <q-btn label="Generate Certificate" rounded no-caps @click="generateCertificate" :loading="certificateLoading" class="styled full-width"/>
              </div>
              <div class="col" v-else>
                <custom-checkbox label="Supports HTTPS" v-model="supportsHttps" />
              </div>
          </div>
      </flat-card>
      <flat-card class="q-mt-md q-pa-lg">
          <div class="row">
              <div class="col">
                  <a class="title">Delete Proxy</a>
                  <br>
                  <span class="content">The proxy will be deleted immediately</span>
              </div>
              <div class="col">
                <q-btn label="Delete" color="negative" rounded no-caps @click="deleteProxy" class="full-width"/>
              </div>
          </div>
      </flat-card>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ProxyDestinationType } from '@backend/types';
import RestApiClient from '../client/RestApiClient';
import { ProxyStatus } from '@backend/types/ProxyStatus';
import FlatCard from '../components/FlatCard.vue';
import CustomInput from 'src/components/CustomInput.vue';
import PartThreeSlide from 'src/components/Wizard/PartThreeSlide.vue';
import { domainComparer } from '@backend/../utils/domainComparer';
import CustomCheckbox from 'src/components/CustomCheckbox.vue';

const router = useRouter();
const route = useRoute();

const loading = ref(false);

const name = ref('');
const domain = ref<string>('');

const destinationType = ref(undefined);

const destination = ref<{
  host: string | undefined,
  port: string | undefined,
  portIsHttps: boolean | undefined
}>({ host: undefined, port: undefined, portIsHttps: false });

const supportsHttps = ref(true);

const skipValidation = ref(false);

async function update() {
  loading.value = true;

  try {

    const response = await RestApiClient.validateDestinationConnection({
      destinationType: destinationType.value!,
      host: destination.value.host!,
      port: destination.value.port!,
      portIsHttps: destination.value.portIsHttps!
    });

    if (!response.data.success) {
      window.logError(`Failed to validate destination: ${response.data.message}`);
      skipValidation.value = true;
      return;
    }

    await RestApiClient.updateProxy(route.params.id as string, {
      domain: domain.value,
      destinationType: destinationType.value,
      forwardIp: destination.value.host ?? '127.0.0.1',
      forwardPort: destination.value.port!,
      forwardHttps: destination.value.portIsHttps,
      supportsHttps: supportsHttps.value,
      status: ProxyStatus.ACTIVE,
    });

    await RestApiClient.updateProxies();

    router.push('/');
  } catch (e: any) {
    window.logError(`Failed to update proxy ${e.response?.data?.message ?? e.message}`)
  } finally {
    loading.value = false;
  }
}

// Load info
RestApiClient.getProxy(route.params.id as string).then((proxy) => {
  domain.value = proxy.data.domain;
  destinationType.value = proxy.data.destinationType;
  destination.value.host = proxy.data.forwardIp;
  destination.value.port = proxy.data.forwardPort;
  destination.value.portIsHttps = proxy.data.forwardHttps;
  supportsHttps.value = proxy.data.supportsHttps;
});

function deleteProxy() {
  if (!window.confirm('Are you sure you want to delete this proxy?')) {
    return;
  }
  RestApiClient.deleteProxy(route.params.id as string).then(() => {
    router.push('/');
  });
}

const hasCertificate = ref(false);
const certificateLoading = ref(false);

// Try see if we already have certificate
RestApiClient.getAllCertificates().then((certificates) => {
    const certificate = certificates.data.rows.find((c) => domainComparer(c.domain, domain.value));

    if (certificate) {
      hasCertificate.value = true;
    }
});

async function generateCertificate() {
  certificateLoading.value = true;
  try {
    await RestApiClient.generateCertificate(domain.value)
    hasCertificate.value = true;
  } catch (e: any) {
    window.logError(`Failed to generate certificate: ${e.response?.data?.message ?? e.message}`);
  } finally {
    certificateLoading.value = false
  }
}

</script>

<style scoped lang="scss">

.q-page {
  padding: 80px;
  max-width: 1000px;
  max-height: calc(100vh - 80px);
  min-height: unset !important;
  overflow-y: auto;
}

.destination-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 5px 20px;
  cursor: pointer;

  .q-icon {
    padding-bottom: 10px;
  }

  a {
    font-weight: bold;
  }

  &:not(.active) {
    color: $grey-6;
  }
}

.destinations {
  padding: 20px 40px;
}

.header {
  border-bottom: 1px solid $grey-3;
  height: 80px;
}

.title {
  padding-top: 20px;
}

</style>