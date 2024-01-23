<template>
  <div class="navbar-parent">
    <div
      class="navbar"
    >
      <div class="product">
        <div class="logo" @click.prevent="router.push('/')" />
        <span>HomeLab<br />Proxy<br />Manager</span>
      </div>

      <div class="navigation-items">
        <div class="navigation-item" :active="route.name === 'Proxies'" @click="router.push('/')">
          <q-icon name="o_language" />
          <span>Proxies</span>
        </div>
        <div class="navigation-item" :active="route.name === 'Certificates'" @click="router.push('/certificates')">
          <q-icon name="o_verified_user" />
          <span>Certificates</span>
        </div>
      </div>

      <q-space />

      <div class="navigation-items">
        <div class="navigation-item" :active="route.name === 'Debugging'" @click="router.push('/debugging')">
          <q-icon name="o_search" />
          <span>Debugging</span>
        </div>
        <div class="navigation-item" :active="route.name === 'Settings'" @click="router.push('/settings')">
          <q-icon name="o_settings" />
          <span>Settings</span>
        </div>
        <div class="navigation-item" @click="signOut">
          <q-icon name="o_logout" />
          <span>Sign Out</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

function signOut() {
  localStorage.removeItem('token');
  router.push('/login');
}
</script>

<style lang="scss" scoped>

.navbar-parent {
  min-width: 300px;
}

.navbar {
  top: 0px;
  width: 300px;
  padding-left: 15px;
  border-right: #CED0DC 2px solid;
  height: 100vh;
  display: flex;
  position: fixed;
  flex-direction: column;
}

.product {
  display: flex;
  flex-direction: row;
  margin-top: 40px;
  flex-shrink: 1;

  .logo {
    width: 80px;
    height: 80px;
    padding: 10px;
    margin: 20px;
    background-image: url('/assets/logo.svg');
    background-position: center;
    background-size: 80%;
    border-radius: 20px;
    background-repeat: no-repeat;
    cursor: pointer;
    
    box-shadow: $shadow-4;
  }

  span {
    font-size: 20px;
    font-weight: 500;
    font-family: 'Ubuntu', sans-serif;
    margin-top: 24px;
    font-weight: bold;
    color: $text;
    line-height: 120%;
  }
}

.navigation-items {
  padding: 20px 0px;
}

.navigation-item {
  padding: 20px;
  font-weight: bold;
  color: $inactive-text;
  cursor: pointer;
  font-size: 20px;
  transition: color 0.1s ease-in-out;

  .q-icon {
    font-size: 30px;
    margin-right: 10px;
  }

  &[active=true] {
    color: $text;
  }

  &:hover {
    color: $text;
  }
}
</style>
