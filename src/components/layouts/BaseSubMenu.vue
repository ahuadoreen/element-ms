<template>
  <template v-for="(item, index) in list" :key="index">
    <el-sub-menu v-if="item.children" :index="item.id + ''">
      <template #title>
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ $t(item.label) }}</span>
      </template>
      <BaseSubMenu :list="item.children" :level="level + 1" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.id + ''">
      <el-icon><component :is="item.icon" /></el-icon>
      <template #title>{{ $t(item.label) }}</template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
defineProps<{ list: any[]; level: number }>();
</script>
