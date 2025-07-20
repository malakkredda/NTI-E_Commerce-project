import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cart, CartResponse, AddToCartRequest } from '../models/cart.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = 'http://localhost:5001/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Load cart when service initializes
    if (this.authService.isLoggedIn()) {
      this.loadCart();
    }

    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCart();
      } else {
        this.cartSubject.next(null);
      }
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  loadCart(): void {
    if (!this.authService.isLoggedIn()) return;

    this.getCart().subscribe({
      next: (response) => {
        this.cartSubject.next(response.cart || null);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.cartSubject.next(null);
      }
    });
  }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.API_URL, { headers: this.getHeaders() });
  }

  addToCart(productId: string, quantity: number = 1): Observable<CartResponse> {
    const data: AddToCartRequest = { productId, quantity };
    return this.http.post<CartResponse>(`${this.API_URL}/add`, data, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          if (response.cart) {
            this.cartSubject.next(response.cart);
          }
        })
      );
  }

  updateQuantity(productId: string, quantity: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.API_URL}/update/${productId}`, 
      { quantity }, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          if (response.cart) {
            this.cartSubject.next(response.cart);
          }
        })
      );
  }

  removeFromCart(productId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.API_URL}/remove/${productId}`, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          if (response.cart) {
            this.cartSubject.next(response.cart);
          }
        })
      );
  }

  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.API_URL}/clear`, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          this.cartSubject.next(null);
        })
      );
  }

  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }

  getCartItemCount(): number {
    const cart = this.getCurrentCart();
    return cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
  }

  getCartTotal(): number {
    const cart = this.getCurrentCart();
    return cart ? cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0) : 0;
  }
}