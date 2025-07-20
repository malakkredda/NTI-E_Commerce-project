import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h2><i class="fas fa-cog me-2"></i>Admin Dashboard</h2>
          <p class="text-muted">Manage products and inventory</p>
        </div>
      </div>

      <div class="row">
        <!-- Add/Edit Product Form -->
        <div class="col-lg-4 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-plus me-2"></i>{{ editingProduct ? 'Edit Product' : 'Add Product' }}
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
                <div class="mb-3">
                  <label for="name" class="form-label">Product Name</label>
                  <input type="text" 
                         class="form-control" 
                         id="name" 
                         formControlName="name"
                         [class.is-invalid]="productForm.get('name')?.invalid && productForm.get('name')?.touched">
                  <div class="invalid-feedback">
                    Product name is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea class="form-control" 
                            id="description" 
                            formControlName="description" 
                            rows="3"></textarea>
                </div>

                <div class="mb-3">
                  <label for="price" class="form-label">Price</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" 
                           class="form-control" 
                           id="price" 
                           formControlName="price"
                           step="0.01"
                           [class.is-invalid]="productForm.get('price')?.invalid && productForm.get('price')?.touched">
                  </div>
                  <div class="invalid-feedback">
                    Valid price is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="category" class="form-label">Category</label>
                  <select class="form-select" 
                          id="category" 
                          formControlName="category"
                          [class.is-invalid]="productForm.get('category')?.invalid && productForm.get('category')?.touched">
                    <option value="">Select Category</option>
                    <option value="makeup">Makeup</option>
                    <option value="accessories">Accessories</option>
                  </select>
                  <div class="invalid-feedback">
                    Category is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="quantity" class="form-label">Quantity</label>
                  <input type="number" 
                         class="form-control" 
                         id="quantity" 
                         formControlName="quantity"
                         min="0"
                         [class.is-invalid]="productForm.get('quantity')?.invalid && productForm.get('quantity')?.touched">
                  <div class="invalid-feedback">
                    Valid quantity is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="image" class="form-label">Image URL</label>
                  <input type="url" 
                         class="form-control" 
                         id="image" 
                         formControlName="image"
                         placeholder="https://example.com/image.jpg">
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" 
                          class="btn btn-primary" 
                          [disabled]="productForm.invalid || saving">
                    <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="fas fa-save me-2" *ngIf="!saving"></i>
                    {{ saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product') }}
                  </button>
                  <button type="button" 
                          class="btn btn-outline-secondary" 
                          (click)="cancelEdit()" 
                          *ngIf="editingProduct">
                    <i class="fas fa-times me-2"></i>Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Products List -->
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="fas fa-list me-2"></i>Products</h5>
              <button class="btn btn-outline-primary btn-sm" (click)="loadProducts()">
                <i class="fas fa-refresh me-1"></i>Refresh
              </button>
            </div>
            <div class="card-body">
              <!-- Success/Error Messages -->
              <div class="alert alert-success" *ngIf="successMessage">
                <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
              </div>
              <div class="alert alert-danger" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
              </div>

              <!-- Loading State -->
              <div class="loading-spinner" *ngIf="loading">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Products Table -->
              <div class="table-responsive" *ngIf="!loading">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let product of products">
                      <td>
                        <img [src]="product.image || getDefaultImage(product.category)" 
                             class="img-thumbnail" 
                             style="width: 50px; height: 50px; object-fit: cover;"
                             [alt]="product.name">
                      </td>
                      <td>
                        <div>
                          <strong>{{ product.name }}</strong>
                          <br>
                          <small class="text-muted">{{ product.description || 'No description' }}</small>
                        </div>
                      </td>
                      <td>
                        <span class="badge" 
                              [class]="product.category === 'makeup' ? 'bg-pink' : 'bg-purple'">
                          {{ product.category }}
                        </span>
                      </td>
                      <td>\${{ product.price }}</td>
                      <td>
                        <span [class]="product.quantity === 0 ? 'text-danger' : (product.quantity < 10 ? 'text-warning' : 'text-success')">
                          {{ product.quantity }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" 
                                  (click)="editProduct(product)">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-outline-danger" 
                                  (click)="deleteProduct(product)"
                                  [disabled]="deleting">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div class="text-center py-3" *ngIf="products.length === 0">
                  <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                  <h5>No products found</h5>
                  <p class="text-muted">Add your first product using the form on the left.</p>
                </div>
              </div>
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
  `]
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  editingProduct: Product | null = null;
  loading = true;
  saving = false;
  deleting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      this.saving = true;
      this.clearMessages();

      const productData = this.productForm.value;

      if (this.editingProduct) {
        // Update existing product
        this.productService.updateProduct(this.editingProduct._id!, productData).subscribe({
          next: () => {
            this.successMessage = 'Product updated successfully!';
            this.loadProducts();
            this.cancelEdit();
            this.saving = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to update product';
            this.saving = false;
          }
        });
      } else {
        // Create new product
        this.productService.createProduct(productData).subscribe({
          next: () => {
            this.successMessage = 'Product created successfully!';
            this.loadProducts();
            this.productForm.reset();
            this.saving = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to create product';
            this.saving = false;
          }
        });
      }
    }
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      image: product.image || ''
    });
    this.clearMessages();
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.productForm.reset();
    this.clearMessages();
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.deleting = true;
      this.clearMessages();

      this.productService.deleteProduct(product._id!).subscribe({
        next: () => {
          this.successMessage = 'Product deleted successfully!';
          this.loadProducts();
          this.deleting = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete product';
          this.deleting = false;
        }
      });
    }
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getDefaultImage(category: string): string {
    return category === 'makeup' 
      ? 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60'
      : 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60';
  }
}