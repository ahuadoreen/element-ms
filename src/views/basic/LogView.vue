<template>
  <BaseView
    menuName="system.log"
    :columns="columns"
    :defaultSort="defaultSort"
  />
</template>

<script lang="ts" setup>
import { Sort } from "element-plus";
import { BaseColumn } from "~/models/models";

const columns: BaseColumn[] = [
  {
    index: "level",
    title: { i18n: "logLevel", text: "日志级别" },
    bind: "log_level",
    type: "enum",
    filterable: true,
  },
  {
    index: "logType",
    title: { i18n: "logType", text: "日志类型" },
    bind: { key: "log_type", i18n: true },
    type: "enum",
    filterable: true,
  },
  {
    index: "serviceName",
    title: { i18n: "serviceName", text: "服务名称" },
    filterable: true,
  },
  {
    index: "className",
    title: { i18n: "className", text: "类名" },
  },
  {
    index: "browserType",
    title: { i18n: "browserType", text: "浏览器信息" },
  },
  {
    index: "serviceIp",
    title: { i18n: "serviceIP", text: "服务IP" },
  },
  {
    index: "url",
    title: { i18n: "requestUrl", text: "请求地址" },
  },
  {
    index: "requestParam",
    title: { i18n: "requestParam", text: "请求参数" },
    filterable: true,
    fAttribute: { span: 4 },
  },
  {
    index: "response",
    title: { i18n: "response", text: "响应结果" },
    fAttribute: { span: 4 },
  },
  {
    index: "exception",
    title: { i18n: "exceptionInfo", text: "异常信息" },
    fAttribute: { span: 4 },
  },
  {
    index: "userName",
    title: { i18n: "username", text: "用户名" },
    filterable: true,
  },
  {
    index: "userIp",
    title: { i18n: "userIP", text: "用户IP" },
  },
  {
    index: "roleName",
    title: { i18n: "role", text: "角色" },
  },
  {
    index: "startTime",
    title: { i18n: "requestStartTime", text: "请求开始时间" },
    type: "date",
    sort: true,
  },
  {
    index: "endTime",
    title: { i18n: "requestEndTime", text: "请求结束时间" },
    type: "date",
  },
  {
    index: "elapsedTime",
    title: { i18n: "requestElapsedTime", text: "请求持续时间" },
  },
];
const defaultSort: Sort[] = [{ prop: "startTime", order: "descending" }];
</script>
