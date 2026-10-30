import { Products } from './IFilexProductsSummary';

export type ProductTypeConfig<K extends keyof Products = keyof Products> = {
  key: K;
  id: number;
  label: string;
  icon: string;
  group: string;
  title: string;
  errorMsg: string;
  errorTitle: string;
};
