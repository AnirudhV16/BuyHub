package com.example.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Add new product (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    // Get all products (Anyone)
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    // Delete product (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            return ResponseEntity.ok("Product deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Product not found.");
        }
    }

}

