import { TestBed } from '@angular/core/testing';
import { DataLayerCoreService } from '@svn/shared-utils-web';
import { TaggableData } from '../../../core/models/taggable-data.model';
import {
  ACTIONS,
  COMMON_FIELDS,
  ELEMENTS,
  EventsEnum,
  TaggingElement,
} from '../../../core/utils/constants/tagging-constants';
import { TaggingService } from './tagging.service';

describe('TaggingService', () => {
  let service: TaggingService;

  const cards = [
    { value: 'Cuentas depósito', response: 'cuentas deposito' },
    { value: 'Tarjetas de crédito', response: 'tarjetas de credito' },
    { value: 'Créditos', response: 'creditos' },
    { value: 'Inversiones', response: 'inversiones' },
    { value: 'Fondos de inversión colectiva - FIC', response: 'fondos de inversion colectiva - fic' },
  ];
  const buttons = [ACTIONS.REFRESH, ACTIONS.DOWNLOAD_BALANCES];

  const mockDataLayerCoreService = {
    tagEvent: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DataLayerCoreService, useValue: mockDataLayerCoreService }],
    });
    service = TestBed.inject(TaggingService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  buttons.forEach((button) => {
    test(`should emit tagging when credit ${button} is clicked`, () => {
      const mockTaggingData = {
        element: TaggingElement.BUTTON,
        taggableData: {
          element: button,
        },
      };

      const taggingResponse = {
        event: 'SEND_BOTONES_SVN',
        activo: 'svn',
        seccion: 'productos',
        modulo: 'filex',
        nombreFlujo: 'saldos consolidados',
        elemento: button,
      };

      service.setTagging(mockTaggingData.element, mockTaggingData.taggableData);

      expect(mockDataLayerCoreService.tagEvent).toHaveBeenCalledWith(taggingResponse);
    });
  });

  cards.forEach(({ value, response }) => {
    test(`should emit tagging when credit ${value} is clicked`, () => {
      const mockTaggingData = {
        element: TaggingElement.CARD,
        taggableData: {
          element: ACTIONS.CHECK_PRODUCT,
          product: value,
        },
      };

      const taggingResponse = {
        event: 'SEND_CARDS_SVN',
        activo: 'svn',
        seccion: 'productos',
        modulo: 'filex',
        nombreFlujo: 'saldos consolidados',
        elemento: 'consultar producto',
        producto: response,
      };

      service.setTagging(mockTaggingData.element, mockTaggingData.taggableData);

      expect(mockDataLayerCoreService.tagEvent).toHaveBeenCalledWith(taggingResponse);
    });
  });

  test('should return null when ElementTagging not exists', () => {
    service.setTagging('notKnowingElement', 'anyData');

    expect(mockDataLayerCoreService.tagEvent).toHaveBeenCalledWith(null);
  });

  describe('TaggingService - PAGEVIEW mapper', () => {
    test('should use SEND_PAGEVIEW_SVN event, COMMON_FIELDS and path field', () => {
      const taggableData = {
        path: 'home',
        ubicacion: 'header',
        codigoError: 404,
        nombreError: 'NotFound',
      } as TaggableData;

      const expectedPath = ELEMENTS['home'] || 'home';

      const expectedPayload = {
        event: EventsEnum.SEND_PAGEVIEW_SVN,
        ...COMMON_FIELDS,
        path: expectedPath,
        ubicacion: 'header',
        codigoError: '404',
        nombreError: 'NotFound',
      };

      service.setTagging(TaggingElement.PAGEVIEW, taggableData);
      expect(mockDataLayerCoreService.tagEvent).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('TaggingService - non-PAGEVIEW defaults', () => {
    test('should fallback to COMMON_FIELDS and elemento field when not PAGEVIEW', () => {
      const taggableData = {
        element: 'clickMe',
      } as TaggableData;

      const expectedElemento = ELEMENTS['clickMe'] || 'clickMe';
      const expectedPayload = {
        event: EventsEnum.SEND_BUTTONS_SVN,
        ...COMMON_FIELDS,
        elemento: expectedElemento,
      };

      service.setTagging(TaggingElement.BUTTON, taggableData);
      expect(mockDataLayerCoreService.tagEvent).toHaveBeenCalledWith(expectedPayload);
    });
  });
});
