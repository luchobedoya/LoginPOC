import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUsers } from './register-users';

describe('RegisterUsers', () => {
  let component: RegisterUsers;
  let fixture: ComponentFixture<RegisterUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
