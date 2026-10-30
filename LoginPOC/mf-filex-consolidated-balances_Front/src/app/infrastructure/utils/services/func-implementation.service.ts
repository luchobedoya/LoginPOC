import { inject, Injectable } from '@angular/core';
import { UserDataUseCase } from '@svn/auth-lib';
import { AudEnum } from '@svn/shared-utils-web';
import { environment } from '../../../../environments/environment';
import { AUD_MAP, FuncKey } from '../../../domain/func-implementation/funcTypes-config';
import { FuncGateway } from '../../../domain/func-implementation/gateways/func.gateway';

@Injectable({
  providedIn: 'root',
})
export class FuncImplementationService implements FuncGateway {
  private readonly _userDataUseCase = inject(UserDataUseCase);

  getAud(): AudEnum {
    const userData = this._userDataUseCase.getUserData();
    const channel = userData?.aud ?? 'NEG';
    return AUD_MAP[channel];
  }

  private isFuncKey = (key: string): key is FuncKey => {
    return key in environment;
  };

  resolveFunc(funcKey: FuncKey): string {
    const candidate = this.getAud() === 'FLX' ? `${funcKey}FLX` : funcKey;
    if (this.isFuncKey(candidate)) {
      return environment[candidate];
    }
    return environment[funcKey] ?? '';
  }
}
