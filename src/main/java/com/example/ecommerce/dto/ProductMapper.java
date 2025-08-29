package com.example.ecommerce.dto;

import org.springframework.stereotype.Component;
import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.entity.Product;

@Component
public class ProductMapper {

    // Convert Product entity → ProductDTO
    public ProductDTO toDTO(Product product) {
        if (product == null) return null;
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice()
        );
    }

    // Optional: Convert ProductDTO → Product entity (if needed)
    public Product toEntity(ProductDTO dto) {
        if (dto == null) return null;
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        return product;
    }
}

