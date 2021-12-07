import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Product } from '../../pages/products/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  products: Product[] = [];

  private cartSubject = new Subject<Product[]>();
  private quantitySubject = new Subject<number>();
  private totalSubject = new Subject<number>();

  get cartAction$(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }
  get quantityAction$(): Observable<number> {
    return this.quantitySubject.asObservable();
  }
  get totalAction$(): Observable<number> {
    return this.totalSubject.asObservable();
  }

  updateCart(product: Product): void {
    this.addToCart(product);
    this.quantityProducts();
    this.calcTotal();
  }

  private addToCart(product: Product): void {
    this.products.push(product);
    this.cartSubject.next(this.products);
  }

  private quantityProducts(): void {
    const quantity = this.products.length;
    this.quantitySubject.next(quantity);
  }

  private calcTotal(): void {
    const total = this.products.reduce((act, prod) => (act += prod.price), 0);
    this.totalSubject.next(total);
  }
}
