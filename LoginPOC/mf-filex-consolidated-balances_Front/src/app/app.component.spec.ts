import { TestBed } from '@angular/core/testing';
import { CommonStateService, PlanTypes } from '@svn/common-state';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

const commonStateServiceMock = {
  planType$: of(PlanTypes.Filex),
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [MockProvider(CommonStateService, commonStateServiceMock)],
    }).compileComponents();
  });

  test('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    fixture.detectChanges();
    expect(app.isFilex).toBe(true);
  });

  test(`should have the 'mf-filex-consolidated-balances' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('mf-filex-consolidated-balances');
  });
});
