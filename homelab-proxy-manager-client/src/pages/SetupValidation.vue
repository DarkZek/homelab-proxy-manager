<template>
  <q-page class="row items-center justify-evenly">
    <flat-card>
      <q-form @submit="submit" class="q-pa-lg">
        <span class="text-bold text-center full-width block text-h6" style="font-size: ">Validating Installation..</span>
        <br>
        <div
          v-for="(step, i) in STEPS"
          :key="i">
          <div class="row q-my-md">
            <q-icon name="check" v-if="stepsPasses[i] === LoadingStatus.Done" class="bg-green-7 text-white rounded-borders" size="20px" />
            <q-icon name="close" v-if="stepsPasses[i] === LoadingStatus.Error" class="bg-red-7 text-white rounded-borders" size="20px" />
            <q-icon name="autorenew" v-if="stepsPasses[i] === LoadingStatus.Loading" class="bg-blue-7 text-white rounded-borders" size="20px" />
            <q-icon name="more_horiz" v-if="stepsPasses[i] === LoadingStatus.Todo" class="bg-grey-4 text-white rounded-borders" size="20px" />
            <div class="col q-ml-sm">
              <span>{{ stepsLabels[i] }}</span>
            </div>
          </div>
          <div class="error" v-if="stepsErrors[i]">
            {{ JSON.stringify(stepsErrors[i], Object.getOwnPropertyNames(stepsErrors[i]), 2) }}
          </div>
        </div>
        <br>
        <q-btn class="styled full-width" v-if="errored" no-caps rounded @click.prevent="validate" label="Retry Validation" />
        <q-btn class="styled full-width" v-else :disable="complete" no-caps rounded type="submit" label="Complete Setup" />
      </q-form>
    </flat-card>
  </q-page>
</template>
  
<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import RestApiClient from '../client/RestApiClient';
import { useRouter } from 'vue-router';
import FlatCard from 'src/components/FlatCard.vue';
import CustomCheckbox from 'src/components/CustomCheckbox.vue';

const router = useRouter();

const loading = ref(false);

const STEPS = 6;

enum LoadingStatus {
  Todo,
  Loading,
  Done,
  Error
}

const stepsPasses = ref<LoadingStatus[]>(new Array(STEPS));
const stepsLabels = [
  'API is accessable',
  'Database is accessable',
  'Regulator is accessable',
  'Nginx is accessable',
  'Let\'s Encrypt is accessable',
  'Let\'s encrypt account is valid',
]
const stepsErrors = ref<(any | undefined)[]>(new Array(STEPS));

async function validate() {
  loading.value = true;
  stepsPasses.value.fill(LoadingStatus.Todo);
  stepsErrors.value.fill(undefined);

  await doStep(0, async () => RestApiClient.checkSetup());
  await doStep(1, async () => RestApiClient.getAllUsers());
  await doStep(2, async () => RestApiClient.getDockerContainers());
  await doStep(3, async () => RestApiClient.getAllProxies());
  await doStep(4, async () => RestApiClient.getHttpsTosUrl());
  await doStep(5, async () => RestApiClient.getHttpsValidation());
}

async function doStep(step: number, cb: () => Promise<unknown>) {
  try {
    stepsPasses.value[step] = LoadingStatus.Loading;
    await cb()
    stepsPasses.value[step] = LoadingStatus.Done;
  } catch (e: any) {
    stepsErrors.value[step] = e.response?.data ?? e.message ?? e;
    stepsPasses.value[step] = LoadingStatus.Error;
    loading.value = false;
    // Prevent further execution
    throw e;
  }
}

validate();

async function submit() {
  await RestApiClient.setValidation(true);
  router.push('/');
}

const complete = computed(() => stepsPasses.value.some((step) => !step));
const errored = computed(() => stepsErrors.value.some((step) => step !== undefined));
</script>

<style scoped lang="scss">

.flat-card {
  max-width: 400px;
}

.q-checkbox :deep(.q-checkbox__inner) {
  font-size: 20px;
}

.error {
  padding: 10px;
  background-color: $red-1;
  color: $red-7;
  border-radius: 15px;
}

</style>