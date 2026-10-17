import { ChangeDetectionStrategy, Component, input } from '@angular/core';
export interface SummaryCardData {
  readonly id: string;
  readonly title: string;
  readonly value: string;
  readonly unit: string;
  readonly detail: string;
  readonly footer: string;
  readonly path: string;
}
@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCard {
  readonly data = input.required<SummaryCardData>();
  readonly periodLabel = input.required<string>();
}
