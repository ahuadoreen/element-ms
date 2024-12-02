<template>
  <BaseDescription :form="useUserStore().user!" :columns="columns" />
</template>

<script lang="ts" setup>
import { BaseColumn } from "~/models/models";
import useUserStore from "~/store/userStore";
const columns: BaseColumn[] = [
  {
    index: "username",
    title: { i18n: "username", text: "用户名" },
  },
  {
    index: "displayName",
    title: { i18n: "nickname", text: "昵称" },
  },
  {
    index: "roles",
    title: { i18n: "role", text: "角色" },
    formatter: (row: any, col: any, cellValue: any, index: number) =>
      (cellValue as any[]).map((c) => c.roleName).join(","),
  },
];
</script>
