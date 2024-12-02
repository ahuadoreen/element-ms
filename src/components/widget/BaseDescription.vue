<template>
  <el-descriptions :title="title" :column="columnCount" :size="size" border>
    <el-descriptions-item
      v-for="(item, fIndex) in columns.filter((c) => c.index)"
      :key="'des' + fIndex"
      :span="item.fAttribute?.span ?? 1"
      :width="item.fAttribute?.width ?? 160"
      break-all
    >
      <template #label>
        <div class="cell-item">
          <el-icon v-if="item.fAttribute?.icon" :style="iconStyle">
            <component :is="item.fAttribute.icon" />
          </el-icon>
        </div>
        {{
          typeof item.title == "string"
            ? item.title
            : item.title?.i18n
            ? $t(item.title?.i18n)
            : item.title?.text
        }}
      </template>
      {{
        item.formatter
          ? item.formatter(form, item, form[item.index ?? ""], 0)
          : item.type == "enum"
          ? formatter(form, item)
          : form[item.index ?? ""]
      }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>
import { BaseColumn } from "~/models/models";
import { computed, PropType, ref } from "vue";
import { ComponentSize } from "element-plus";

const props = defineProps({
  columns: {
    type: Array as PropType<BaseColumn[]>,
    default: [],
  },
  form: {
    type: Object,
    default: {},
  },
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String as PropType<"" | "default" | "small" | "large">,
    default: "default",
  },
  columnCount: {
    type: Number,
    default: 4,
  },
});
const size = ref<ComponentSize>(props.size);
const iconStyle = computed(() => {
  const marginMap: any = {
    large: "8px",
    default: "6px",
    small: "4px",
  };
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  };
});
const formatter = (row: any, column: BaseColumn) => {
  if (column!.type == "enum" && column.enums) {
    const seleted = column.enums!.find((s) => s.value == row[column!.index!]);
    return seleted?.label;
  }
  return row[column.index!];
};
</script>
<style>
.cell-item {
  display: flex;
  align-items: center;
  white-space: nowrap !important;
}
.word-break {
  word-break: break-word !important;
}
</style>
