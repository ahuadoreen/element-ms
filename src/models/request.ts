import { BaseColumn } from "./models";

/**
 * 查询条件枚举
 */
export enum Condition {
  isEqualTo = "isEqualTo",
  isIn = "isIn",
  isLike = "isLike",
  isGreaterThan = "isGreaterThan",
  isGreaterThanOrEqualTo = "isGreaterThanOrEqualTo",
  isLessThan = "isLessThan",
  isLessThanOrEqualTo = "isLessThanOrEqualTo",
  isBetween = "isBetween",
}

/**
 * 查询条件接口
 */
export interface FilterCondition {
  /**
   * 查询的entity中对应的字段名
   */
  field: string;

  /**
   * 查询的值
   */
  value?: string;

  /**
   * 查询字段的类型
   */
  type?: string;

  /**
   * 查询字段的值，通常用于in或between条件的查询
   */
  values?: string[];

  /**
   * 查询条件
   */
  condition: Condition;
}

/**
 * 排序方向枚举
 */
export enum Order {
  asc = "asc",
  desc = "desc",
}

/**
 * 排序接口
 */
export interface ApiSort {
  index: string;
  order: Order;
}

/**
 * 分页参数接口
 */
export interface FilterWithPageParam {
  /**
   * 每页显示条数
   */
  pageSize: number;

  /**
   * 第几页，从1开始
   */
  index: number;

  /**
   * 过滤条件
   */
  filterConditions: FilterCondition[];

  /**
   * 排序列表
   */
  sorts?: ApiSort[];
}

export interface TableInfo {
  tableColumns: BaseColumn[];
  importExistUpdate: boolean;
}
export interface ExportParam {
  filterWithPageParam: FilterWithPageParam;
  tableInfo: TableInfo;
}
