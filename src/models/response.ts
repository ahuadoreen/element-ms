export interface ListWithPageData<T> {
  pageCount: number;
  total: number;
  list: T[];
}

export interface ResponseData<T> {
  code: number;
  message: string;
  data?: T;
}
