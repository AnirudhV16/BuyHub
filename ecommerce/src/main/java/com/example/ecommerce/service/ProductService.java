package com.example.ecommerce.service;

import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.repository.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Save new product
    public ProductDTO saveProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product saved = productRepository.save(product);
        return convertToDTO(saved);
    }

    // Get all products
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Delete product
    public boolean deleteProduct(int id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Update product
    public ProductDTO updateProduct(int id, ProductDTO updatedDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + id));

        existingProduct.setName(updatedDTO.getName());
        existingProduct.setPrice(updatedDTO.getPrice());
        existingProduct.setDescription(updatedDTO.getDescription());

        Product updated = productRepository.save(existingProduct);
        return convertToDTO(updated);
    }

    // 🔹 Mapper methods
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        return dto;
    }

    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        // Don't set ID here for new objects, JPA handles it
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        return product;
    }
}
