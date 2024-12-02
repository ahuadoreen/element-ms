<template>
  <el-config-provider namespace="ep" :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { getInitInfo } from "./init";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import useLangStore from "./store/langStore";

const locale = computed(() => (useLangStore().lang === "en" ? en : zhCn));
onMounted(() => {
  getInitInfo();
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
