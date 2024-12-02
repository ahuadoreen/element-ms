<template>
  <el-menu
    w-208px
    :default-active="seletedId"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <img class="logo" src="/img/icons/favicon-32x32.png" />
      <h3>{{ isCollapse ? "" : $t("managementSys") }}</h3>
    </el-menu-item>
    <BaseSubMenu :list="useMenuStore().menu" :level="0" />
  </el-menu>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import useMenuStore from "~/store/menuStore";
import router from "~/router";
defineProps({ isCollapse: Boolean });
let seletedId = ref("0");
onBeforeMount(() => {
  const list = useMenuStore().flatMenu;
  const selected = list.find(
    (m) => m.url + "" == router.currentRoute.value.fullPath
  );
  if (selected) {
    seletedId.value = selected.id + "";
  }
});

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
  console.log(navigator);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleSelect = (key: string, keyPath: string[]) => {
  if (key == "0") {
    return router.push({ path: "/" });
  }
  const list = useMenuStore().flatMenu;
  const selected = list.find((m) => m.id + "" == key);
  if (selected) {
    router.push({ path: selected.url || "" });
  }
};
</script>
<style scoped>
.logo {
  height: 1.5em;
  padding-right: 0.5em;
  will-change: filter;
  transition: filter 300ms;
}
</style>
