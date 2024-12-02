<template>
  <BaseForm
    ref="filterForm"
    :columns="filterColumns"
    :form="form"
    :labelWidth="labelWidth"
    mt-2
  />
</template>
<script lang="ts" setup>
import { onBeforeMount, PropType, ref } from "vue";
import { BaseColumn } from "~/models/models";
import dateUtils from "~/utils/dateUtils";
import BaseForm from "./BaseForm.vue";
import { Condition, FilterCondition } from "~/models/request";
const props = defineProps({
  columns: {
    type: Array as PropType<BaseColumn[]>,
    default: [],
  },
  form: {
    type: Object,
    default: {},
  },
  labelWidth: {
    type: String,
    default: "",
  },
});
const filterColumns: BaseColumn[] = [];
onBeforeMount(() => {
  props.columns.forEach((c) => {
    if (!c.filterable) return;
    let newColumn = { ...c };
    newColumn.formRule = undefined;
    newColumn.fType =
      c.sType ?? (c.type == "enum" || c.type == "tag" ? "select" : undefined);
    newColumn.formStyle =
      newColumn.formStyle ??
      (newColumn.fType == undefined || newColumn.fType == "select"
        ? { width: "200px" }
        : {});
    newColumn.fAttribute = newColumn.sAttribute;
    filterColumns.push(newColumn);
  });
  filterColumns.push({
    fType: "button",
    buttons: [
      {
        title: { i18n: "search", text: "查询" },
        click: search,
        type: "primary",
      },
      { title: { i18n: "reset", text: "重置" }, click: reset },
    ],
  });
});
const emit = defineEmits(["filterChanged"]);
const filterForm = ref<InstanceType<typeof BaseForm>>();
const search = () => {
  const formValue = filterForm.value!.formData;
  const keys = Object.keys(formValue);
  let conditions: FilterCondition[] = [];
  keys.forEach((k) => {
    if (
      formValue[k] === undefined ||
      formValue[k] === null ||
      formValue[k] === ""
    )
      return;
    const column = filterColumns.find((c) => c.index == k);
    if (column == null) return;
    if (column.fType == "select") {
      conditions = [
        ...conditions,
        { field: k, value: formValue[k], condition: Condition.isEqualTo },
      ];
    } else if (
      column.fType == "date-picker" &&
      column.fAttribute &&
      column.fAttribute.type.includes("range")
    ) {
      if (formValue[k][0] === "" || formValue[k][1] === "") return;
      // 如果控件只选择日期范围，则结束日期的时间需要放到当天的最后时间即23:59:59.999
      conditions = [
        ...conditions,
        {
          field: k,
          values: [
            formValue[k][0],
            !column.fAttribute.type.includes("time")
              ? dateUtils.changeTimeToEnd(formValue[k][1])
              : formValue[k][1],
          ],
          condition: Condition.isBetween,
          type: "date",
        },
      ];
    } else {
      conditions = [
        ...conditions,
        { field: k, value: formValue[k], condition: Condition.isLike },
      ];
    }
  });
  emit("filterChanged", conditions);
};
const reset = () => {
  filterForm.value!.reset();
  emit("filterChanged", []);
};
</script>
