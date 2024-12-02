<template>
  <!-- <el-page-header
    v-if="isShowHeader"
    :icon="isShowBack ? 'Back' : ''"
    :title="isShowBack ? 'Back' : ''"
    :class="{ 'hide-back': !isShowBack }"
  >
    <template #breadcrumb> -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, idx) in paths"
      :to="item.link ? { path: item.link } : ''"
      :key="idx"
      >{{ $t(item.title) }}</el-breadcrumb-item
    >
  </el-breadcrumb>
  <!-- </template>
    <template #content>
      <span class="text-large font-600 mr-3"> {{ title }} </span>
    </template>
  </el-page-header> -->
</template>

<script lang="ts" setup>
import { ref, Ref, watch } from "vue";
import router from "~/router";
import useMenuStore, { Menu } from "~/store/menuStore";
import common from "~/utils/common";
let isShowHeader = ref(false);
let isShowBack = ref(false);
const title = ref("");
const paths: Ref<any[]> = ref([]);
const genBreadcrumb = () => {
  paths.value = [];
  isShowHeader.value = false;
  isShowBack.value = false;
  const menu = useMenuStore().flatMenu.find(
    (m) => m.url == router.currentRoute.value.fullPath
  );
  if (!menu) {
    return;
  }
  isShowHeader.value = true;
  title.value = menu.label;
  const id = menu.id;
  let menus: Menu[] = [];
  common.findParent(id, useMenuStore().flatMenu, menus);
  if (menus.length <= 0) {
    return;
  }
  if (menus.length > 1) {
    const parent = menus[menus.length - 2];
    if (parent.url) {
      isShowBack.value = true;
    }
  }
  menus.forEach((item) => {
    if (typeof item.hideInBreadcrumb !== "undefined" && item.hideInBreadcrumb)
      return;
    let title = item.label;
    paths.value.push({ title, link: item.url && [item.url] });
  });
  // add home
  paths.value.splice(0, 0, {
    title: "home",
    link: "/",
  });
};
// 监听当前路由的name变化
watch(
  () => router.currentRoute.value.name,
  (newRouterName: any) => {
    genBreadcrumb();
  },
  { immediate: true }
);
</script>
<style lang="scss">
.hide-back {
  .ep-page-header__back {
    display: none !important;
  }
  .ep-divider--vertical {
    display: none !important;
  }
}
</style>
