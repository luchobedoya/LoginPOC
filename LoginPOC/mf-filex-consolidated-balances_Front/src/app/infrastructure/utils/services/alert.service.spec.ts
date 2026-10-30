import { TestBed } from '@angular/core/testing';

import { BcDialogService } from '@bancolombia/design-system-web/bc-services';

import { BcAlertComponent } from '@bancolombia/design-system-web/bc-alert';
import { AlertService } from './alert.service';

const bcDialogServiceMock = { open: jest.fn() };
const type = 'success';
const title = 'Titulo';
const text = 'Texto';
const timeout = 1000;

describe('AlertService', () => {
  let service: AlertService;
  let dialogService: BcDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BcDialogService, useValue: bcDialogServiceMock }],
    });
    service = TestBed.inject(AlertService);
    dialogService = TestBed.inject(BcDialogService);
  });

  test('should show alert', () => {
    const openDialogServiceSpy = jest.spyOn(dialogService, 'open');
    service.showAlert(type, title, timeout, text);
    expect(openDialogServiceSpy).toHaveBeenCalledWith(BcAlertComponent, { type, title, text, timeout });
  });
});
