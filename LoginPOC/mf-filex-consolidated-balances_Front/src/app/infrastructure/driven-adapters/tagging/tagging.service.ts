import { inject, Injectable } from '@angular/core';
import { DataLayerCoreService } from '@svn/shared-utils-web';
import { TaggableData, TaggingModel } from '../../../core/models/taggable-data.model';
import {
  COMMON_FIELDS,
  ELEMENTS,
  EventsEnum,
  TAGGING_FIELDS,
  TaggingElement,
} from '../../../core/utils/constants/tagging-constants';
import { TaggingGateway } from '../../../domain/tagging/gateways/tagging.gateway';
import { ACCENT_MARK } from '../../utils/constant/regular-expressions';

@Injectable({
  providedIn: 'root',
})
export class TaggingService extends TaggingGateway {
  private readonly _dataLayerCoreService = inject(DataLayerCoreService);

  setTagging<Type>(element: string, taggableData: Type): void {
    const convertedTaggableData: TaggableData = taggableData as unknown as TaggableData;
    const mapperTaggableData = this.mapper(element as TaggingElement, convertedTaggableData);
    this._dataLayerCoreService.tagEvent(mapperTaggableData as any);
  }

  private mapper(taggingElement: TaggingElement, taggableData: TaggableData) {
    switch (taggingElement) {
      case TaggingElement.PAGEVIEW:
        return this.buildTaggingData(EventsEnum.SEND_PAGEVIEW_SVN, taggableData);
      case TaggingElement.BUTTON:
        return this.buildTaggingData(EventsEnum.SEND_BUTTONS_SVN, taggableData);
      case TaggingElement.CARD:
        return this.buildTaggingData(EventsEnum.SEND_CARDS_SVN, taggableData);
      default:
        return null;
    }
  }
  private buildTaggingData(event: EventsEnum, taggableData: TaggableData): TaggingModel {
    return this.common(event, taggableData);
  }

  private getCommonFields(): Record<string, any> {
    return COMMON_FIELDS;
  }

  private getMainField(event: EventsEnum, taggableData: TaggableData): Record<string, any> {
    return event === EventsEnum.SEND_PAGEVIEW_SVN
      ? {
          path: ELEMENTS[taggableData.path ?? ''] || taggableData.path,
        }
      : {
          elemento: ELEMENTS[taggableData.element ?? ''] || taggableData.element,
        };
  }

  private common(event: EventsEnum, taggableData: TaggableData): TaggingModel {
    const taggingModel: any = {
      event,
      ...this.getCommonFields(),
      ...this.getMainField(event, taggableData),
      ...(taggableData.ubicacion && { ubicacion: taggableData.ubicacion }),
      ...(taggableData.codigoError?.toString() && { codigoError: taggableData.codigoError.toString() }),
      ...(taggableData.nombreError && { nombreError: taggableData.nombreError }),
    };

    TAGGING_FIELDS.forEach(({ key, value }) => {
      if (key in taggableData) {
        const dataValue = taggableData[key as keyof TaggableData];
        if (typeof dataValue === 'string') {
          taggingModel[value] = dataValue.toLowerCase().normalize('NFD').replace(ACCENT_MARK, '');
        } else {
          taggingModel[value] = dataValue;
        }
      }
    });

    return taggingModel as TaggingModel;
  }
}
