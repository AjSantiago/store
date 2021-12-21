import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../../pages/products/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  products: Product[] = [];

  private cartSubject = new BehaviorSubject<Product[]>([]);
  private quantitySubject = new BehaviorSubject<number>(0);
  private totalSubject = new BehaviorSubject<number>(0);

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

  resetCart(): void {
    this.cartSubject.next([]);
    this.totalSubject.next(0);
    this.quantitySubject.next(0);
    this.products = [];
  }

  private addToCart(product: Product): void {
    const isProductInCart = this.products.find(({ id }) => id === product.id);

    if (isProductInCart) {
      isProductInCart.quantity += 1;
    } else {
      this.products.push({ ...product, quantity: 1 });
    }

    this.cartSubject.next(this.products);
  }

  private quantityProducts(): void {
    const quantity = this.products.reduce(
      (act, prod) => (act += prod.quantity),
      0
    );
    this.quantitySubject.next(quantity);
  }

  private calcTotal(): void {
    const total = this.products.reduce(
      (act, prod) => (act += prod.price * prod.quantity),
      0
    );
    this.totalSubject.next(total);
  }
}
