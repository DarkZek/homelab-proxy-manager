<template>
    <flat-card class="q-pa-lg">
        <div class="row">
            <div class="col q-pr-md">
                <a class="title">Enter domain name</a>
                <br>
                <span class="content">Your domain name will be what you access the website from. You should set this up to forward to this machine through your DNS provider now.</span>
            </div>
            <q-form @submit.prevent="next" class="col">
                <custom-input v-model="domain" label="Domain" placeholder="mail.example.com"
                    :rules="[
                        (val: any) => /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/.test(val) || val == '' || 'Invalid domain name',
                        (val: any) => val.length <= 63 || 'Domain name must be less than 63 characters',
                        (val: any) => val.length >= 3 || 'Domain name must be at least 3 characters'
                    ]"/>
                <q-btn class="styled full-width q-mt-sm" label="Continue" no-caps rounded type="submit" />
            </q-form>
        </div>
    </flat-card>
</template>

<script lang="ts" setup>
import FlatCard from '../FlatCard.vue';
import { defineEmits, defineModel } from 'vue';
import CustomInput from '../CustomInput.vue';

const domain = defineModel();
const emits = defineEmits(['next']);

function next() {
    emits('next');
}

</script>