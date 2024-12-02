<template>
  <BaseView
    menuName="system.dictionary"
    :columns="columns"
    :refreshDictionaryAfterSubmit="true"
    tableType="tree"
    :showPage="false"
  />
</template>

<script lang="ts" setup>
import { BaseColumn } from "~/models/models";

const columns: BaseColumn[] = [
  {
    index: "dictionaryName",
    title: { i18n: "dictionaryName", text: "字典名称" },
    filterable: true,
    editable: true,
    width: 120,
    align: "left",
    sort: true,
    formRule: [{ required: true }],
  },
  {
    index: "dictionaryType",
    title: { i18n: "dictionaryType", text: "字典类型" },
    type: "enum",
    bind: "dictionary_type",
    editable: true,
    width: 120,
    formRule: [{ required: true }],
  },
  {
    index: "dictionaryKey",
    title: { i18n: "dictionaryKey", text: "字典关键字" },
    filterable: true,
    editable: true,
    width: 120,
    formRule: [{ required: true }],
  },
  {
    index: "dictionaryValue",
    title: { i18n: "dictionaryValue", text: "字典值" },
    editable: true,
    fAttribute: { type: "textarea", rows: 5 },
    formStyle: { width: "480px" },
    width: 120,
  },
  {
    index: "keyType",
    title: { i18n: "keyType", text: "关键字类型" },
    type: "enum",
    bind: { key: "data_type", i18n: true },
    editable: true,
    width: 120,
  },
  {
    index: "valueType",
    title: { i18n: "valueType", text: "值类型" },
    type: "enum",
    bind: { key: "data_type", i18n: true },
    editable: true,
    width: 120,
  },
  {
    index: "serviceName",
    title: { i18n: "serviceName", text: "服务名称" },
    editable: true,
    width: 120,
  },
  {
    index: "frontendStyle",
    title: { i18n: "frontendStyle", text: "前端样式" },
    editable: true,
    width: 120,
  },
  {
    index: "parentId",
    title: { i18n: "highLevelDictionary", text: "上级字典" },
    type: "enum",
    bind: "dictionary_list",
    filterable: true,
    editable: true,
    fType: "tree-select",
    width: 120,
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
    type: "tag",
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
</script>
