import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TaggingGateway } from '../gateways/tagging.gateway';
import { SetTaggingUseCase } from './set-tagging.usecase';

describe('Test for SetTaggingUseCase', () => {
  let usecase: SetTaggingUseCase;

  const mockTaggingGateway = {
    setTagging: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: TaggingGateway,
          useValue: mockTaggingGateway,
        },
        SetTaggingUseCase,
      ],
    });
    usecase = TestBed.inject(SetTaggingUseCase);
  });

  test('Should create the usecase', () => {
    expect(usecase).toBeTruthy();
  });

  test('should call setTagging in gateway', () => {
    const data = {
      credit: '1234',
      product: '3215',
    };
    usecase.invoke('button_continue', data);

    expect(mockTaggingGateway.setTagging).toHaveBeenCalledWith('button_continue', data);
  });
});
