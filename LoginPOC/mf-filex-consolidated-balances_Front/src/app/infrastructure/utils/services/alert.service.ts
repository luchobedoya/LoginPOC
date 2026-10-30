import { inject, Injectable } from '@angular/core';

import { BcAlertComponent } from '@bancolombia/design-system-web/bc-alert';
import { BcDialogRef, BcDialogService } from '@bancolombia/design-system-web/bc-services';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly _bcDialogService = inject(BcDialogService);

  showAlert(type: string, title: string, timeout: number, text?: string): BcDialogRef {
    return this._bcDialogService.open(BcAlertComponent, { type, title, text, timeout });
  }
}
