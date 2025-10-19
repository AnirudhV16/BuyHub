package com.example.ecommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final Cloudinary cloudinary;

    public ProductService(ProductRepository productRepository, Cloudinary cloudinary) {
        this.productRepository = productRepository;
        this.cloudinary = cloudinary;
    }

    // Save product with optional image
    public Product saveProduct(Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(
                    imageFile.getBytes(),
                    ObjectUtils.asMap("folder", "ecommerce/products")
            );
            product.setImageUrl((String) uploadResult.get("secure_url"));
            product.setImagePublicId((String) uploadResult.get("public_id"));
        }
        return productRepository.save(product);
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Delete product
    public boolean deleteProduct(int id) throws IOException {
        if (productRepository.existsById(id)) {
            Product product = productRepository.findById(id).orElseThrow();
            if (product.getImagePublicId() != null) {
                cloudinary.uploader().destroy(product.getImagePublicId(), ObjectUtils.emptyMap());
            }
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Update product (with optional new image)
    public Product updateProduct(int id, Product updatedProduct, MultipartFile newImage) throws IOException {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + id));

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setDescription(updatedProduct.getDescription());

        if (newImage != null && !newImage.isEmpty()) {
            if (existingProduct.getImagePublicId() != null) {
                cloudinary.uploader().destroy(existingProduct.getImagePublicId(), ObjectUtils.emptyMap());
            }
            Map uploadResult = cloudinary.uploader().upload(
                    newImage.getBytes(),
                    ObjectUtils.asMap("folder", "ecommerce/products")
            );
            existingProduct.setImageUrl((String) uploadResult.get("secure_url"));
            existingProduct.setImagePublicId((String) uploadResult.get("public_id"));
        }

        return productRepository.save(existingProduct);
    }
}
