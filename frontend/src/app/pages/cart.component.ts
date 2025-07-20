import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Cart, CartItem } from '../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0"><i class="fas fa-shopping-cart me-2"></i>Shopping Cart</h4>
            </div>
            <div class="card-body">
              <!-- Loading State -->
              <div class="loading-spinner" *ngIf="loading">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Empty Cart -->
              <div class="text-center py-5" *ngIf="!loading && (!cart || cart.items.length === 0)">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h4>Your cart is empty</h4>
                <p class="text-muted">Add some products to get started!</p>
                <a routerLink="/products" class="btn btn-primary">
                  <i class="fas fa-arrow-left me-2"></i>Continue Shopping
                </a>
              </div>

              <!-- Cart Items -->
              <div *ngIf="!loading && cart && cart.items.length > 0">
                <div class="cart-item" *ngFor="let item of cart.items; trackBy: trackByProductId">
                  <div class="row align-items-center mb-3 pb-3 border-bottom">
                    <div class="col-md-2">
                      <img [src]="item.product.image || getDefaultImage(item.product.category)" 
                           class="img-fluid rounded" 
                           [alt]="item.product.name"
                           style="height: 80px; width: 80px; object-fit: cover;">
                    </div>
                    <div class="col-md-4">
                      <h6 class="mb-1">{{ item.product.name }}</h6>
                      <small class="text-muted">{{ item.product.description || 'Premium quality product' }}</small>
                      <br>
                      <span class="badge" 
                            [class]="item.product.category === 'makeup' ? 'bg-pink' : 'bg-purple'">
                        {{ item.product.category }}
                      </span>
                    </div>
                    <div class="col-md-2">
                      <span class="h6 text-primary">\${{ item.product.price }}</span>
                    </div>
                    <div class="col-md-2">
                      <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary" 
                                type="button" 
                                (click)="updateQuantity(item, item.quantity - 1)"
                                [disabled]="item.quantity <= 1 || updating">
                          <i class="fas fa-minus"></i>
                        </button>
                        <span class="form-control text-center">{{ item.quantity }}</span>
                        <button class="btn btn-outline-secondary" 
                                type="button" 
                                (click)="updateQuantity(item, item.quantity + 1)"
                                [disabled]="item.quantity >= item.product.quantity || updating">
                          <i class="fas fa-plus"></i>
                        </button>
                      </div>
                      <small class="text-muted d-block mt-1">
                        Max: {{ item.product.quantity }}
                      </small>
                    </div>
                    <div class="col-md-1 text-center">
                      <span class="fw-bold">\${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                    </div>
                    <div class="col-md-1 text-end">
                      <button class="btn btn-outline-danger btn-sm" 
                              (click)="removeItem(item)"
                              [disabled]="updating">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-3">
                  <a routerLink="/products" class="btn btn-outline-primary">
                    <i class="fas fa-arrow-left me-2"></i>Continue Shopping
                  </a>
                  <button class="btn btn-outline-danger" 
                          (click)="clearCart()" 
                          [disabled]="updating">
                    <i class="fas fa-trash me-2"></i>Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="col-lg-4" *ngIf="!loading && cart && cart.items.length > 0">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0"><i class="fas fa-receipt me-2"></i>Order Summary</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal ({{ getTotalItems() }} items):</span>
                <span>\${{ getSubtotal().toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>{{ getSubtotal() >= 50 ? 'FREE' : '$5.99' }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>\${{ getTax().toFixed(2) }}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong class="text-primary">\${{ getTotal().toFixed(2) }}</strong>
              </div>

              <div class="alert alert-info" *ngIf="getSubtotal() < 50">
                <small>
                  <i class="fas fa-info-circle me-1"></i>
                  Add \${{ (50 - getSubtotal()).toFixed(2) }} more for free shipping!
                </small>
              </div>

              <div class="d-grid gap-2">
                <button class="btn btn-primary btn-lg" disabled>
                  <i class="fas fa-credit-card me-2"></i>Proceed to Checkout
                </button>
                <small class="text-muted text-center">
                  Checkout functionality coming soon
                </small>
              </div>
            </div>
          </div>

          <!-- Security Info -->
          <div class="card mt-3">
            <div class="card-body text-center">
              <i class="fas fa-shield-alt fa-2x text-success mb-2"></i>
              <h6>Secure Checkout</h6>
              <small class="text-muted">
                Your payment information is processed securely. We do not store credit card details.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-pink {
      background-color: #e84393 !important;
    }
    .bg-purple {
      background-color: #6c5ce7 !important;
    }
    .cart-item {
      transition: background-color 0.2s;
    }
    .cart-item:hover {
      background-color: #f8f9fa;
    }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = true;
  updating = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.loading = false;
    });
  }

  trackByProductId(index: number, item: CartItem): string {
    return item.product._id || item.product.id || index.toString();
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1 || newQuantity > item.product.quantity) {
      return;
    }

    this.updating = true;
    const productId = item.product._id || item.product.id;
    
    if (productId) {
      this.cartService.updateQuantity(productId, newQuantity).subscribe({
        next: () => {
          this.updating = false;
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
          this.updating = false;
        }
      });
    }
  }

  removeItem(item: CartItem): void {
    this.updating = true;
    const productId = item.product._id || item.product.id;
    
    if (productId) {
      this.cartService.removeFromCart(productId).subscribe({
        next: () => {
          this.updating = false;
        },
        error: (error) => {
          console.error('Error removing item:', error);
          this.updating = false;
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.updating = true;
      this.cartService.clearCart().subscribe({
        next: () => {
          this.updating = false;
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
          this.updating = false;
        }
      });
    }
  }

  getTotalItems(): number {
    return this.cart ? this.cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
  }

  getSubtotal(): number {
    return this.cart ? this.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0) : 0;
  }

  getShipping(): number {
    return this.getSubtotal() >= 50 ? 0 : 5.99;
  }

  getTax(): number {
    return this.getSubtotal() * 0.08; // 8% tax
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping() + this.getTax();
  }

  getDefaultImage(category: string): string {
    return category === 'makeup' 
      ? 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60'
      : 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60';
  }
}