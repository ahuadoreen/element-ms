<template>
  <BaseView
    menuName="system.menu"
    :columns="columns"
    :refreshDictionaryAfterSubmit="true"
    :formatBeforeShow="formatBeforeShow"
    :formatBeforeSubmit="formatBeforeSubmit"
    tableType="tree"
    :showPage="false"
  />
</template>

<script lang="ts" setup>
import { BaseColumn } from "~/models/models";

const columns: BaseColumn[] = [
  {
    index: "menuName",
    title: { i18n: "menuName", text: "菜单名称" },
    filterable: true,
    editable: true,
    width: 160,
    align: "left",
    formRule: [{ required: true }],
  },
  {
    index: "label",
    title: { i18n: "menuTitle", text: "菜单标题" },
    filterable: true,
    editable: true,
    width: 120,
    formRule: [{ required: true }],
  },
  {
    index: "url",
    title: { i18n: "path", text: "路径" },
    editable: true,
    width: 120,
  },
  {
    index: "requestPath",
    title: { i18n: "apiPath", text: "API路径" },
    editable: true,
    width: 160,
  },
  {
    index: "auth",
    title: { i18n: "authorization", text: "权限" },
    type: "enum",
    bind: { key: "menu_auth", i18n: true },
    editable: true,
    fAttribute: { multiple: true },
    width: 160,
    formatter: (row: any) => {
      if (row.auth) {
        const data = { ...row };
        const column = columns.find((c) => c.index == "auth");
        column!.enums?.forEach((e) => {
          if (row.auth.includes(e.value)) {
            data.auth = data.auth.replace(e.value, e.label);
          }
        });
        return data.auth;
      }
      return row.auth;
    },
  },
  {
    index: "icon",
    title: { i18n: "icon", text: "图标" },
    editable: true,
    width: 120,
  },
  {
    index: "parentId",
    title: { i18n: "highLevelMenu", text: "上级菜单" },
    type: "enum",
    bind: { key: "menu_list", i18n: true },
    filterable: true,
    editable: true,
    fType: "tree-select",
    width: 120,
  },
  {
    index: "isShow",
    title: { i18n: "isShow", text: "是否显示" },
    type: "enum",
    bind: { key: "yes_no_tag", i18n: true },
    filterable: true,
    editable: true,
    fType: "radio",
    width: 88,
    formRule: [{ required: true }],
  },
  {
    index: "orderNo",
    title: { i18n: "order", text: "顺序" },
    editable: true,
    fType: "number",
    width: 80,
  },
  {
    index: "enable",
    title: { i18n: "isEnable", text: "是否可用" },
    type: "enum",
    bind: { key: "yes_no_tag", i18n: true },
    filterable: true,
    editable: true,
    fType: "radio",
    width: 88,
  },
  {
    index: "remark",
    title: { i18n: "remarks", text: "备注" },
    editable: true,
    width: 120,
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
];
const formatBeforeSubmit = (form: any) => {
  form.auth = (form.auth as string[])?.join(",");
};
const formatBeforeShow = (form: any) => {
  form.auth = form.auth ? form.auth?.split(",") : form.auth;
};
</script>
