<template>
  <div flex w-full h-100vh>
    <BaseSide :isCollapse="isCollapse" />
    <div class="main-container">
      <BaseHeader :isCollapse="isCollapse" @toggleCollapse="toggleCollapse" />
      <div p="4" pb-0>
        <router-view />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const isCollapse = ref(true);
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
</script>
<style>
#app {
  color: var(--ep-text-color-primary);
}

.main-container {
  flex: 1;
  width: 0;
}
</style>
