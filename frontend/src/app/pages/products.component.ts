import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <!-- Filters Sidebar -->
        <div class="col-lg-3 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0"><i class="fas fa-filter me-2"></i>Filters</h5>
            </div>
            <div class="card-body">
              <!-- Search -->
              <div class="mb-3">
                <label class="form-label">Search</label>
                <input type="text" 
                       class="form-control" 
                       [(ngModel)]="searchTerm" 
                       (input)="applyFilters()"
                       placeholder="Search products...">
              </div>

              <!-- Category Filter -->
              <div class="mb-3">
                <label class="form-label">Category</label>
                <select class="form-select" 
                        [(ngModel)]="selectedCategory" 
                        (change)="applyFilters()">
                  <option value="">All Categories</option>
                  <option value="makeup">Makeup</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <!-- Price Range -->
              <div class="mb-3">
                <label class="form-label">Price Range</label>
                <select class="form-select" 
                        [(ngModel)]="priceRange" 
                        (change)="applyFilters()">
                  <option value="">All Prices</option>
                  <option value="0-25">$0 - $25</option>
                  <option value="25-50">$25 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100+">$100+</option>
                </select>
              </div>

              <!-- Sort -->
              <div class="mb-3">
                <label class="form-label">Sort By</label>
                <select class="form-select" 
                        [(ngModel)]="sortBy" 
                        (change)="applyFilters()">
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="category">Category</option>
                </select>
              </div>

              <button class="btn btn-outline-secondary btn-sm w-100" (click)="clearFilters()">
                <i class="fas fa-times me-1"></i>Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="col-lg-9">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Products</h2>
            <span class="text-muted">{{ filteredProducts.length }} products found</span>
          </div>

          <!-- Loading State -->
          <div class="loading-spinner" *ngIf="loading">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="row" *ngIf="!loading && filteredProducts.length > 0">
            <div class="col-lg-4 col-md-6 mb-4" *ngFor="let product of filteredProducts">
              <div class="card h-100">
                <img [src]="product.image || getDefaultImage(product.category)" 
                     class="card-img-top product-image" 
                     [alt]="product.name">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ product.name }}</h5>
                  <p class="card-text text-muted small">{{ product.description || 'Premium quality product' }}</p>
                  <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="h5 text-primary mb-0">\${{ product.price }}</span>
                      <span class="badge" 
                            [class]="product.category === 'makeup' ? 'bg-pink' : 'bg-purple'">
                        {{ product.category }}
                      </span>
                    </div>
                    <div class="mb-2">
                      <small class="text-muted">
                        <i class="fas fa-box me-1"></i>
                        {{ product.quantity }} in stock
                      </small>
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

          <!-- No Products Found -->
          <div class="text-center py-5" *ngIf="!loading && filteredProducts.length === 0">
            <i class="fas fa-search fa-3x text-muted mb-3"></i>
            <h4>No products found</h4>
            <p class="text-muted">Try adjusting your filters or search terms.</p>
            <button class="btn btn-primary" (click)="clearFilters()">
              <i class="fas fa-refresh me-1"></i>Clear Filters
            </button>
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
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  isLoggedIn = false;

  // Filter properties
  searchTerm = '';
  selectedCategory = '';
  priceRange = '';
  sortBy = 'name';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    // Check for category from route params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
    });

    this.loadProducts();
    
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Price range filter
    if (this.priceRange) {
      filtered = filtered.filter(product => {
        const price = product.price;
        switch (this.priceRange) {
          case '0-25': return price <= 25;
          case '25-50': return price > 25 && price <= 50;
          case '50-100': return price > 50 && price <= 100;
          case '100+': return price > 100;
          default: return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    this.filteredProducts = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.priceRange = '';
    this.sortBy = 'name';
    this.applyFilters();
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

  getDefaultImage(category: string): string {
    return category === 'makeup' 
      ? 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      : 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';
  }
}