import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginInitial } from './login-initial';

describe('LoginInitial', () => {
  let component: LoginInitial;
  let fixture: ComponentFixture<LoginInitial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginInitial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginInitial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
