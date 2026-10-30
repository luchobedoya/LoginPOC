import { AudEnum } from '@svn/shared-utils-web';

export abstract class FuncGateway {
  abstract resolveFunc(funcKey: string): string;
  abstract getAud(): AudEnum;
}
