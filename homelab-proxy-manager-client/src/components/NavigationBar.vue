<template>
  <q-drawer
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    mini-to-overlay
    :width="200"
    :breakpoint="500"
    bordered
    class="navbar"
  >
    <q-img src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
      <div class="absolute-bottom bg-transparent">
        <q-avatar size="56px" class="q-mb-sm">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <div class="text-weight-bold">Marshall Scott</div>
        <div>darkzek@serverrack</div>
      </div>
    </q-img>

    <q-scroll-area :horizontal-thumb-style="{ opacity: 0 }">
      <q-list padding>
        <q-item clickable v-ripple active>
          <q-item-section avatar>
            <q-icon name="inbox" />
          </q-item-section>

          <q-item-section> Proxies </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>

          <q-item-section> Star </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="send" />
          </q-item-section>

          <q-item-section> Send </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="drafts" />
          </q-item-section>

          <q-item-section> Drafts </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const miniState = ref(true);
</script>

<style lang="scss" scoped>
:deep(.q-drawer) {
  transition: width 0.15s ease-in-out, display 0.15s ease-in-out;
}

.q-scrollarea {
  height: calc(100% - 150px);
}

.q-item {
  text-align: left !important;
  justify-content: left !important;
  padding: 10px 16px !important;
}
</style>
