import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="fas fa-store me-2"></i>GlamStore
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" aria-controls="navbarNav" 
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <i class="fas fa-home me-1"></i>Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/products" routerLinkActive="active">
                <i class="fas fa-box me-1"></i>Products
              </a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="currentUser">
              <a class="nav-link" routerLink="/cart" routerLinkActive="active">
                <i class="fas fa-shopping-cart me-1"></i>Cart
                <span class="cart-badge" *ngIf="cartItemCount > 0">{{ cartItemCount }}</span>
              </a>
            </li>
            
            <li class="nav-item" *ngIf="currentUser && currentUser.role === 'admin'">
              <a class="nav-link" routerLink="/admin" routerLinkActive="active">
                <i class="fas fa-cog me-1"></i>Admin
              </a>
            </li>
            
            <li class="nav-item dropdown" *ngIf="currentUser; else authLinks">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" 
                 role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-user me-1"></i>{{ currentUser.name }}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" (click)="logout()">
                  <i class="fas fa-sign-out-alt me-1"></i>Logout
                </a></li>
              </ul>
            </li>
            
            <ng-template #authLinks>
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">
                  <i class="fas fa-sign-in-alt me-1"></i>Login
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">
                  <i class="fas fa-user-plus me-1"></i>Register
                </a>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  cartItemCount = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication changes
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );

    // Subscribe to cart changes
    this.subscriptions.push(
      this.cartService.cart$.subscribe(cart => {
        this.cartItemCount = this.cartService.getCartItemCount();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}