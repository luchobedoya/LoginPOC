export abstract class TaggingGateway {
  abstract setTagging<Type>(element: string, taggableData: Type): void;
}
