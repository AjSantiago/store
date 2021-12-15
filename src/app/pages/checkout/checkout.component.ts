import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Store } from '../../shared/interfaces/stores.interface';
import { NgForm } from '@angular/forms';
import { Order, Details } from '../../shared/interfaces/order.interface';
import { Product } from '../products/interfaces/product.interface';
import { ShoppingCartService } from '../../shared/services/shopping-cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  model = {
    name: '',
    store: '',
    shippingAddress: '',
    city: '',
  };
  isDelivery = true;
  stores: Store[] = [];
  cart: Product[] = [];

  constructor(
    private dataSvc: DataService,
    private shoppingCartSvc: ShoppingCartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
    this.prepareDetails();
  }

  onPickupOrDelivery(value: boolean): void {
    this.isDelivery = value;
  }

  onSubmit({ value: formData }: NgForm): void {
    console.log('Guardar', formData);
    const data: Order = {
      ...formData,
      date: this.getCurrentDay(),
      isDelivery: this.isDelivery,
    };
    this.dataSvc
      .saveOrder(data)
      .pipe(
        tap((res) => console.log('Order->', res)),
        switchMap(({ id: orderId }) => {
          const details = this.prepareDetails();
          return this.dataSvc.saveDetailsOrder({ details, orderId });
        }),
        tap(() => this.router.navigate(['/checkout/thanks-page'])),
        delay(2000),
        tap(() => this.shoppingCartSvc.resetCart())
      )
      .subscribe();
  }

  private getStores(): void {
    this.dataSvc
      .getStores()
      .pipe(tap((stores: Store[]) => (this.stores = stores)))
      .subscribe();
  }

  private getCurrentDay(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDetails(): Details[] {
    const details: Details[] = [];
    this.cart.forEach((product: Product) => {
      const { id: productId, name: productName, quantity, stock } = product;
      details.push({ productId, productName, quantity });
    });
    return details;
  }

  private getDataCart(): void {
    this.shoppingCartSvc.cartAction$
      .pipe(tap((products: Product[]) => (this.cart = products)))
      .subscribe();
  }
}
