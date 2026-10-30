import { TestBed } from '@angular/core/testing';
import { UserDataUseCase } from '@svn/auth-lib';
import { FuncImplementationService } from './func-implementation.service';

jest.mock('../../../../environments/environment', () => ({
  environment: {
    consolidateBalancesFunc: 'FUNC7750808164070533',
    consolidateBalancesFuncFLX: 'FUNC7534774348127758',
  },
}));

import { environment } from '../../../../environments/environment';

const mockUserDataUseCase = {
  getUserData: jest.fn().mockReturnValue({ aud: 'NEG' }),
};

describe('FuncImplementationService', () => {
  let service: FuncImplementationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FuncImplementationService, { provide: UserDataUseCase, useValue: mockUserDataUseCase }],
    });
    service = TestBed.inject(FuncImplementationService);
    jest.clearAllMocks();
  });

  describe('getAud', () => {
    test('debe retornar el aud del usuario cuando existe (NEG)', () => {
      mockUserDataUseCase.getUserData.mockReturnValue({ aud: 'NEG' });
      expect(service.getAud()).toBe('NEG');
    });

    test('debe retornar el aud del usuario cuando existe (FLX)', () => {
      mockUserDataUseCase.getUserData.mockReturnValue({ aud: 'FLX' });
      expect(service.getAud()).toBe('FLX');
    });

    test('debe retornar "NEG" si userData es null/undefined', () => {
      mockUserDataUseCase.getUserData.mockReturnValue(undefined);
      expect(service.getAud()).toBe('NEG');
    });

    test('debe retornar "NEG" si userData no trae aud', () => {
      mockUserDataUseCase.getUserData.mockReturnValue({});
      expect(service.getAud()).toBe('NEG');
    });
  });

  describe('resolveFunc', () => {
    test('si canal es FLX y existe la clave funcKey FLX debe devolver el valor FLX', () => {
      mockUserDataUseCase.getUserData.mockReturnValue({ aud: 'FLX' });
      const result = service.resolveFunc('consolidateBalancesFunc');
      expect(result).toBe('FUNC7534774348127758');
      expect(environment.consolidateBalancesFuncFLX).toBe('FUNC7534774348127758');
    });

    test('si canal NO es FLX, retorna el valor base si existe', () => {
      mockUserDataUseCase.getUserData.mockReturnValue({ aud: 'NEG' });
      const result = service.resolveFunc('consolidateBalancesFunc');
      expect(result).toBe('FUNC7750808164070533');
    });
  });
});
