import { VNode } from "vue";
import { FormItemRule } from "element-plus";

export interface BaseColumn {
  type?: "default" | "selection" | "index" | "expand" | "tag" | "enum" | "date";
  fType?:
    | "select"
    | "number"
    | "radio"
    | "checkbox"
    | "date-picker"
    | "tree-select"
    | "button";
  sType?: "select" | "number" | "date-picker";
  index?: string;
  title?: string | { text: string; i18n?: string };
  width?: number | string;
  fixed?: "left" | "right" | boolean;
  align?: "left" | "center" | "right";
  sort?: boolean | string;
  sortBy?: string | string[] | ((row: any, index: number) => string);
  enums?: any[];
  buttons?: ButtonAttribute[];
  formatter?: (
    row: any,
    column: any,
    cellValue: any,
    index: number
  ) => VNode | string;
  /**
   * 是否允许编辑
   */
  editable?: boolean | { add?: boolean; edit?: boolean };

  /**
   * 是否允许搜索，根据这个值决定是否在搜索条件中
   */
  filterable?: boolean;
  /**
   * 此列的过滤字段名，在查询关联数据时会用到，比如对于 Blog 查询作者昵称，原 Index 为 'NickName'，此值需预设为 'Author.NickName'，才能在后端正常查询到数据
   */
  filterIndex?: string;
  /** 如果是下拉框等需要绑定源数据，可以使用dictionary，值为DicNo */
  bind?: string | { key: string; i18n: boolean };
  /**
   * 是否只读状态
   */
  readOnly?: boolean | { add?: boolean; edit?: boolean };
  /** 是否允许清空,默认false */
  allowClear?: boolean;
  /*是否可导入 */
  importable?: boolean;
  formStyle?: unknown;
  dateFormat?: string;
  iif?: boolean | ((item: BaseColumn) => boolean);
  exportable?: boolean;
  fEnum?: any[];
  fAttribute?: any;
  sAttribute?: any;
  formRule?: FormItemRule[];
}

export interface ButtonAttribute {
  type?: "primary" | "success" | "warning" | "danger" | "info";
  title?: string | { text: string; i18n?: string };
  icon?: any;
  size?: "large" | "default" | "small";
  disabled?: boolean | ((p?: any) => boolean);
  click: (p?: any) => void;
  style?: any;
  iif?: boolean | ((p?: any) => boolean);
  acl?: any;
}

export interface Tree {
  id: number | string;
  parentId: number | string;
  children?: Tree[];
  isLeaf: boolean;
  parent?: Tree;
}

export interface TreeNode extends Tree {
  data: any;
}
