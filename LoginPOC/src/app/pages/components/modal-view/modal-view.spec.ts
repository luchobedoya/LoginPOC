import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalView } from './modal-view';

describe('ModalView', () => {
  let component: ModalView;
  let fixture: ComponentFixture<ModalView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
