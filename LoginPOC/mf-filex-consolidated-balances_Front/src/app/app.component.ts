import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonStateService, PlanTypes } from '@svn/common-state';
import { ONE } from '@svn/shared-utils-web';
import { take } from 'rxjs';

@Component({
  selector: 'svn-mf-filex-consolidated-balances',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly _commonState = inject(CommonStateService);

  title = 'mf-filex-consolidated-balances';
  isFilex?: boolean;

  ngOnInit(): void {
    this._commonState.planType$
      .pipe(take(ONE))
      .subscribe(
        (planType) =>
          (this.isFilex =
            planType && [PlanTypes.Filex, PlanTypes.FilexToppingCol, PlanTypes.ColToppingFilex].includes(planType))
      );
  }
}
