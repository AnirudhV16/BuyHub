package com.example.ecommerce.controller;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.security.PermitAll;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    
    // Add new product (Admin only) with optional image
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Product> addProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            // convert JSON string into Product object
            ObjectMapper mapper = new ObjectMapper();
            Product product = mapper.readValue(productJson, Product.class);

            return ResponseEntity.ok(productService.saveProduct(product, imageFile));
        } catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }


    // Get all products (Anyone)
    @GetMapping
    @PermitAll
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Delete product (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        try {
            boolean deleted = productService.deleteProduct(id);
            return deleted ?
                    ResponseEntity.ok("Product deleted successfully.") :
                    ResponseEntity.status(404).body("Product not found.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting product.");
        }
    }

    // Update product (Admin only)
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Product> updateProduct(
            @PathVariable int id,
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile newImage
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Product updatedProduct = mapper.readValue(productJson, Product.class);

            return ResponseEntity.ok(productService.updateProduct(id, updatedProduct, newImage));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

}
