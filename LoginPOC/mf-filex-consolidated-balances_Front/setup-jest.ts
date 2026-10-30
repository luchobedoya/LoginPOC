import 'jest-canvas-mock';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

Object.defineProperty(global.self, 'structuredClone', {
  value: (value: object) => JSON.parse(JSON.stringify(value)),
});

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: jest.fn(),
});

Object.defineProperty(window, 'open', {
  value: jest.fn().mockReturnValue({ opener: null }),
});
