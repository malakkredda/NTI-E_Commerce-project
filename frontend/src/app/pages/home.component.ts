import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">Welcome to GlamStore</h1>
            <p class="lead mb-4">Discover the latest in makeup and fashion accessories. 
               Quality products at unbeatable prices.</p>
            <a routerLink="/products" class="btn btn-light btn-lg me-3">
              <i class="fas fa-shopping-bag me-2"></i>Shop Now
            </a>
            <a routerLink="/register" class="btn btn-outline-light btn-lg" *ngIf="!isLoggedIn">
              <i class="fas fa-user-plus me-2"></i>Join Us
            </a>
          </div>
          <div class="col-lg-6 text-center">
            <img src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                 alt="Makeup Products" class="img-fluid rounded shadow" style="max-height: 400px;">
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-center mb-5">Shop by Category</h2>
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="category-card" (click)="navigateToCategory('makeup')">
              <i class="fas fa-palette fa-3x text-primary mb-3"></i>
              <h4>Makeup</h4>
              <p class="text-muted">Discover our premium makeup collection</p>
              <button class="btn btn-primary">Shop Makeup</button>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="category-card" (click)="navigateToCategory('accessories')">
              <i class="fas fa-gem fa-3x text-primary mb-3"></i>
              <h4>Accessories</h4>
              <p class="text-muted">Find the perfect accessories to complete your look</p>
              <button class="btn btn-primary">Shop Accessories</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">Featured Products</h2>
        
        <div class="row" *ngIf="!loading; else loadingTemplate">
          <div class="col-lg-3 col-md-6 mb-4" *ngFor="let product of featuredProducts.slice(0, 4)">
            <div class="card h-100">
              <img [src]="product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'" 
                   class="card-img-top product-image" [alt]="product.name">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text text-muted small">{{ product.description || 'Premium quality product' }}</p>
                <div class="mt-auto">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="h5 text-primary mb-0">\${{ product.price }}</span>
                    <span class="badge bg-secondary">{{ product.category }}</span>
                  </div>
                  <div class="d-grid gap-2">
                    <button class="btn btn-primary btn-sm" 
                            (click)="addToCart(product)"
                            [disabled]="!isLoggedIn || product.quantity === 0">
                      <i class="fas fa-cart-plus me-1"></i>
                      {{ product.quantity === 0 ? 'Out of Stock' : 'Add to Cart' }}
                    </button>
                    <button class="btn btn-outline-primary btn-sm" 
                            [routerLink]="['/products', product._id]">
                      <i class="fas fa-eye me-1"></i>View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ng-template #loadingTemplate>
          <div class="loading-spinner">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </ng-template>

        <div class="text-center mt-4">
          <a routerLink="/products" class="btn btn-outline-primary btn-lg">
            <i class="fas fa-arrow-right me-2"></i>View All Products
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4 text-center mb-4">
            <i class="fas fa-shipping-fast fa-3x text-primary mb-3"></i>
            <h5>Fast Shipping</h5>
            <p class="text-muted">Free shipping on orders over $50</p>
          </div>
          <div class="col-md-4 text-center mb-4">
            <i class="fas fa-undo fa-3x text-primary mb-3"></i>
            <h5>Easy Returns</h5>
            <p class="text-muted">30-day hassle-free returns</p>
          </div>
          <div class="col-md-4 text-center mb-4">
            <i class="fas fa-award fa-3x text-primary mb-3"></i>
            <h5>Quality Guarantee</h5>
            <p class="text-muted">100% authentic products</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  loading = true;
  isLoggedIn = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadFeaturedProducts();
    
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.loading = false;
      }
    });
  }

  addToCart(product: Product): void {
    if (!this.isLoggedIn) {
      return;
    }

    const productId = product._id || product.id;
    if (productId) {
      this.cartService.addToCart(productId).subscribe({
        next: () => {
          // Success handled by cart service
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
    }
  }

  navigateToCategory(category: string): void {
    // This would navigate to products page with category filter
    window.location.href = `/products?category=${category}`;
  }
}