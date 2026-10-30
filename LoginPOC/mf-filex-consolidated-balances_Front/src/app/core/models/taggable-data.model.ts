import { EventsEnum } from '../utils/constants/tagging-constants';

export interface TaggableData {
  element?: string;
  path?: string;
  product?: string;
  destinationUrl?: string;
  ubicacion?: string;
  modulo?: string;
  codigoError?: number;
  nombreError?: string;
}

export type TaggingModel =
  | ({
      event: EventsEnum.SEND_BUTTONS_SVN;
    } & TaggingButtonModel)
  | ({
      event: EventsEnum.SEND_CARDS_SVN;
    } & TaggingCardModel);

export interface TaggingGeneral {
  activo: string;
  seccion: string;
  nombreFlujo: string;
  elemento: string;
  modulo: string;
}

export type TaggingButtonModel = {
  urlDestino?: string;
} & TaggingGeneral;

export type TaggingCardModel = {
  producto: string;
} & TaggingGeneral;
