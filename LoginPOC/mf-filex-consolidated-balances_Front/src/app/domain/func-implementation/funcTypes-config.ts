import { AudEnum } from '@svn/shared-utils-web';

export const AUD_MAP: Record<string, AudEnum> = {
  NEG: AudEnum.NEG,
  FLX: AudEnum.FLX,
};

export interface FuncMap {
  consolidateBalancesFunc: string;
}

export type FuncKey = keyof FuncMap;
