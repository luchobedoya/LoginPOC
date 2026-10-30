import { Observable } from 'rxjs';

export abstract class ProductsSummyFilexGateway {
  abstract get getProductsSummary(): Observable<any>;
  abstract refreshProductsSumary(): void;
  abstract clearProductsSummary(): void;
}
