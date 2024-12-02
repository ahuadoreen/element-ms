<script lang="ts" setup>
import { toggleDark } from "~/composables";
import useLangStore from "~/store/langStore";
import { Expand, Fold, UserFilled } from "@element-plus/icons-vue";
import useUserStore from "~/store/userStore";
import router from "~/router";
import i18n from "~/i18n";

defineProps({ isCollapse: Boolean });
const changeLang = (command: string | number | object) => {
  useLangStore().setLang(command);
  i18n.global.locale.value = command as "en" | "zh";
};
const handleCommand = (command: string | number | object) => {
  if (command == "logout") {
    const userStore = useUserStore();
    userStore.setToken(null);
    userStore.setUser(null);
    router.push({ path: "/login" });
  } else if (command == "user-info") {
    router.push({ path: "/user-info" });
  }
};
const emit = defineEmits(["toggleCollapse"]);
</script>

<template>
  <div class="header">
    <el-button
      :icon="isCollapse ? Expand : Fold"
      link
      size="large"
      w-14
      class="toggle-collapse"
      @click="emit('toggleCollapse')"
    ></el-button>
    <PageHeader></PageHeader>
    <div flex-1 flex justify-end>
      <el-dropdown @command="changeLang" items-center>
        <span class="el-dropdown-link">
          {{ $t("language") }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="en">EN</el-dropdown-item>
            <el-dropdown-item command="zh">{{
              $t("simpleChinese")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown @command="handleCommand" items-center ml-2>
        <div class="user-menu">
          <el-avatar :size="32" :icon="UserFilled" />
          <span class="el-dropdown-link" pl-1 self-center>
            {{ useUserStore().user?.displayName }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="user-info">{{
              $t("userInfo")
            }}</el-dropdown-item>
            <el-dropdown-item command="logout">{{
              $t("logout")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <button
        class="border-none bg-transparent cursor-pointer"
        style="
          height: var(--ep-menu-item-height);
          width: var(--ep-menu-item-height);
        "
        @click="toggleDark()"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  width: 100%;
  border-bottom: solid 1px var(--ep-menu-border-color);

  :deep(.ep-breadcrumb) {
    display: inline-flex;
    align-items: center;
  }
  :deep(.el-dropdown-link:focus-visible) {
    outline: unset;
  }
  .toggle-collapse :deep(.ep-icon) {
    height: 1.2em;
    width: 1.2em;
  }
  .user-menu {
    display: flex;
  }
  .user-menu:focus-visible {
    outline: unset;
  }
}
</style>
