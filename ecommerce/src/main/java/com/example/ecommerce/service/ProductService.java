package com.example.ecommerce.service;

import org.springframework.stereotype.Service;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.repository.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public boolean deleteProduct(int id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public Product updateProduct(int id, Product updatedProduct) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        // Update only allowed fields
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setDescription(updatedProduct.getDescription());

        return productRepository.save(existingProduct);
    }
}
