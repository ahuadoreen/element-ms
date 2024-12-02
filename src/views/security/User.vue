<template>
  <BaseView
    menuName="system.user"
    :columns="columns"
    :formatBeforeSubmit="formatBeforeSubmit"
    :formatBeforeShow="formatBeforeShow"
  />
</template>

<script lang="ts" setup>
import { BaseColumn } from "~/models/models";

const columns: BaseColumn[] = [
  {
    index: "username",
    title: { i18n: "username", text: "用户名" },
    filterable: true,
    editable: true,
    sort: true,
    formRule: [{ required: true }],
  },
  {
    index: "displayName",
    title: { i18n: "nickname", text: "昵称" },
    filterable: true,
    editable: true,
    sort: true,
    formRule: [{ required: true }],
  },
  {
    index: "roleNames",
    title: { i18n: "role", text: "角色" },
  },
  {
    index: "enable",
    title: { i18n: "isEnable", text: "是否可用" },
    type: "enum",
    bind: { key: "yes_no_tag", i18n: true },
    filterable: true,
    editable: true,
    fType: "radio",
  },
  {
    index: "updateName",
    title: { i18n: "modifier", text: "修改人" },
    importable: false,
    width: 120,
  },
  {
    index: "updateTime",
    title: { i18n: "modifyTime", text: "修改时间" },
    type: "date",
    importable: false,
    width: 160,
  },
  {
    index: "roles",
    title: { i18n: "role", text: "角色" },
    editable: true,
    fType: "tree-select",
    fAttribute: { multiple: true },
    bind: "role_list",
    iif: () => false,
    importable: false,
  },
];
const formatBeforeSubmit = (form: any) => {
  if (form.roles) {
    form.roles = (form.roles as any[]).map((r) => {
      if (r.id) {
        return r;
      } else {
        return { id: r };
      }
    });
  }
};
const formatBeforeShow = (form: any) => {
  form.roles = form.roleIds
    ? (form.roleIds.split(",") as string[]).map((r) => Number.parseInt(r))
    : [];
};
</script>
