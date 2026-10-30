import { inject, Injectable } from '@angular/core';
import { TaggingGateway } from '../gateways/tagging.gateway';

@Injectable()
export class SetTaggingUseCase {
  private readonly _taggingGateway = inject(TaggingGateway);

  invoke<Type>(element: string, taggableData: Type): void {
    this._taggingGateway.setTagging(element, taggableData);
  }
}
