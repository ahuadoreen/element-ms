<template>
  <el-table
    ref="table"
    v-loading="loading"
    header-row-class-name="nowrap"
    stripe
    border
    :height="height"
    row-key="id"
    :row-style="{ height: '40px' }"
    :cell-style="{ padding: '0px' }"
    :data="tableList"
    :loading="true"
    style="width: 100%"
    :tree-props="treeProps"
    :default-sort="
      defaultSort && defaultSort.length > 0 ? defaultSort[0] : undefined
    "
    default-expand-all
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <template
      v-for="(column, cIndex) in columns.filter(
        (c) => !c.iif || (typeof c.iif == 'boolean' ? c.iif : c.iif(c))
      )"
    >
      <el-table-column
        v-if="column.buttons || column.type == 'tag'"
        :type="
          column.type == 'index' ||
          column.type == 'expand' ||
          column.type == 'selection'
            ? column.type
            : 'string'
        "
        :prop="column.index"
        :label="
          typeof column.title == 'string'
            ? column.title
            : column.title?.i18n
            ? $t(column.title?.i18n)
            : column.title?.text
        "
        :width="column.width"
        :fixed="column.fixed"
        :key="'c' + cIndex"
        :align="column.align ?? 'center'"
        :sortable="column.sort ? (showPage ? 'custom' : true) : false"
        :sort-by="column.sortBy"
        :index="column.type == 'index' ? indexMethod : () => undefined"
        :show-overflow-tooltip="!column.buttons"
      >
        <template #default="scope">
          <el-button
            v-for="(button, bindex) in (column.buttons || []).filter(
              (c) =>
                !c.iif || (typeof c.iif == 'boolean' ? c.iif : c.iif(scope.row))
            )"
            :key="'button' + bindex"
            :type="button.type"
            @click="button.click(scope.row)"
            :icon="button.icon"
            link
            :disabled="
              button.disabled
                ? typeof button.disabled == 'boolean'
                  ? button.disabled
                  : button.disabled(scope.row)
                : false
            "
            v-acl="button.acl"
            >{{
              typeof button.title == "string"
                ? button.title
                : button.title?.i18n
                ? $t(button.title?.i18n)
                : button.title?.text
            }}</el-button
          >
          <el-tag
            v-if="column.type == 'tag'"
            :type="
              column.enums?.find(
                (s) => s.value === scope.row[column.index ?? '']
              )?.type
            "
            :color="
              column.enums?.find(
                (s) => s.value === scope.row[column.index ?? '']
              )?.color
            "
            :effect="
              column.enums?.find(
                (s) => s.value === scope.row[column.index ?? '']
              )?.effect
            "
            >{{
              column.enums?.find(
                (s) => s.value === scope.row[column.index ?? ""]
              )?.label
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="!column.buttons && column.type != 'tag'"
        :type="
          column.type == 'index' ||
          column.type == 'expand' ||
          column.type == 'selection'
            ? column.type
            : undefined
        "
        :prop="column.index"
        :label="
          typeof column.title == 'string'
            ? column.title
            : column.title?.i18n
            ? $t(column.title?.i18n)
            : column.title?.text
        "
        :width="column.width"
        :fixed="column.fixed"
        :key="'c' + cIndex"
        :align="column.align ?? 'center'"
        :sortable="column.sort ? (showPage ? 'custom' : true) : false"
        :sort-by="column.sortBy"
        :index="column.type == 'index' ? indexMethod : undefined"
        :show-overflow-tooltip="!column.buttons && column.type != 'selection'"
        :formatter="
          column.formatter
            ? column.formatter
            : column.type == 'enum' || column.type == 'date'
            ? formatter
            : undefined
        "
      ></el-table-column>
    </template>
  </el-table>
  <el-pagination
    v-if="showPage"
    m-2
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[10, 20, 30, 40, 50, 100]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  >
  </el-pagination>
</template>
<script lang="ts" setup>
import { ElTable, Sort, dayjs } from "element-plus";
import { onMounted, PropType, reactive, Ref, ref, watch } from "vue";
import { loading, post } from "~/api/http";
import i18n, { t } from "~/i18n";
import { BaseColumn } from "~/models/models";
import common from "~/utils/common";
import { DATETIME_FORMAT_STRING } from "~/utils/constant";
import { ListWithPageData } from "~/models/response";
import {
  ApiSort,
  FilterCondition,
  FilterWithPageParam,
  Order,
} from "~/models/request";
const props = defineProps({
  columns: {
    type: Array as PropType<BaseColumn[]>,
    default: [],
  },
  requestPath: {
    type: String,
    default: "",
  },
  filterConditions: {
    type: Array as PropType<FilterCondition[]>,
    default: [],
  },
  height: {
    type: String,
  },
  showPage: {
    type: Boolean,
    default: true,
  },
  param: Object as PropType<FilterWithPageParam>,
  isAutoLoad: {
    type: Boolean,
    default: true,
  },
  processData: {
    type: Function,
  },
  type: {
    type: String as PropType<"normal" | "tree">,
    default: "normal",
  },
  defaultSort: Array as PropType<Sort[]>,
});
const emit = defineEmits(["selectionChanged", "columnChanged"]);
onMounted(() => {
  getDictionaries();
  watch(
    () => i18n.global.locale.value,
    (locale: "en" | "zh") => {
      props.columns.forEach((c) => {
        if (c.bind) {
          if (typeof c.bind != "string" && c.bind?.i18n) {
            c.enums?.forEach((el) => {
              el.label = t(el.rawLabel);
            });
          }
        }
      });
      emit("columnChanged");
    },
    { immediate: true }
  );
});
const table = ref<typeof ElTable>();
const pageSize = ref(20);
const currentPage = ref(1);
const total = ref(0);
let param: FilterWithPageParam = {
  index: currentPage.value,
  pageSize: pageSize.value,
  filterConditions: [],
};
let tableList = ref<any[]>([]);
const treeProps = reactive({
  checkStrictly: true,
});

const indexMethod = (index: number) => {
  return index + (currentPage.value - 1) * pageSize.value + 1;
};
const search = (conditions: FilterCondition[]) => {
  currentPage.value = 1;
  getQueryParam(conditions);
  getPage();
};
const searchByParam = (query: any) => {
  currentPage.value = 1;
  if (query) {
    param = query;
  }
  getPage();
};
const getQueryParam = (conditions: FilterCondition[]) => {
  if (props.param) {
    param = props.param;
  } else {
    param = {
      index: currentPage.value,
      pageSize: props.showPage ? pageSize.value : 0,
      filterConditions:
        conditions.length > 0 ? conditions : props.filterConditions,
    };
    if (props.showPage && props.defaultSort && props.defaultSort.length > 0) {
      param.sorts = props.defaultSort.map((el) => {
        const sort: ApiSort = {
          index: el.prop,
          order: (el.order == "descending" ? "desc" : "asc") as Order,
        };
        return sort;
      });
    }
  }
};
const getPage = () => {
  let url = props.requestPath + "/search";
  post<ListWithPageData<any>>(url, param).then((response) => {
    tableList.value = response.data!.list;
    if (props.processData) {
      tableList.value = props.processData(tableList.value);
    }
    if (
      props.type == "tree" &&
      tableList.value.length > 0 &&
      !tableList.value[0].children
    ) {
      const tree: any[] = [];
      common.formatArrayToTree(tableList.value, tree);
      tableList.value = tree;
    }
    total.value = response.data!.total;
  });
};
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  param.pageSize = pageSize.value;
  getPage();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  param.index = currentPage.value;
  getPage();
};
const handleSelectionChange = (val: any) => {
  emit(
    "selectionChanged",
    val.map((el: any) => el.id)
  );
};
const formatter = (row: any, col: any) => {
  const column = props.columns.find((c) => c.index == col.property);
  if (column!.type == "enum" && column!.enums) {
    const seleted = column!.enums.find((s) => s.value == row[column!.index!]);
    if (seleted) {
      return seleted.label;
    }
    return undefined;
  }
  if (column!.type == "date" && row[column!.index!]) {
    return dayjs(row[column!.index!]).format(
      column?.dateFormat ? column?.dateFormat : DATETIME_FORMAT_STRING
    );
  }
  return row[column!.index!];
};
const getDictionaries = () => {
  const keys = props.columns
    .filter((c) => c.bind)
    .map((c) => (typeof c.bind == "string" ? c.bind : c.bind?.key));
  if (keys.length == 0) {
    if (props.isAutoLoad) {
      search([]);
    }
    return;
  }
  post<any>("basic-module/dictionary/getDictionariesByKeys", keys).then(
    (response) => {
      const data = response.data;
      props.columns.forEach((c) => {
        if (c.bind) {
          c.enums = data[typeof c.bind == "string" ? c.bind : c.bind?.key];
          if (typeof c.bind != "string" && c.bind?.i18n) {
            c.enums = c.enums?.map((el) => {
              let newEl = { ...el };
              newEl.rawLabel = el.label;
              newEl.label = t(el.label);
              return newEl;
            });
          }
        }
      });
      emit("columnChanged");
      if (props.isAutoLoad) {
        search([]);
      }
    }
  );
};
defineExpose({ search, getDictionaries });
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  if (data.column.sortable == "custom") {
    if (data.order == null) {
      if (props.showPage && props.defaultSort && props.defaultSort.length > 0) {
        param.sorts = props.defaultSort.map((sort) => {
          return {
            index: sort.prop,
            order: sort.order == "descending" ? "desc" : "asc",
          } as ApiSort;
        });
      } else {
        param.sorts = undefined;
      }
    } else {
      param.sorts = [
        {
          index: data.prop,
          order: (data.order == "ascending" ? "asc" : "desc") as Order,
        },
      ];
    }
    getPage();
  }
};
</script>
