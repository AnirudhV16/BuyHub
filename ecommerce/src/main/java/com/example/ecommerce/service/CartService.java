package com.example.ecommerce.service;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a new cart for a user (if they don’t already have one).
     */
    @Transactional
    public Cart createCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if (user.getCart() != null) {
            return user.getCart();
        }

        Cart cart = new Cart();
        cart.setUser(user);
        user.setCart(cart);

        return cartRepository.save(cart);
    }

    /**
     * Add product to cart
     */
    @Transactional
    public Cart addProductToCart(int cartId, int productId, int quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // Check if product already in cart
        CartItem existingItem = cart.getItems().stream()
                .filter(i -> i.getProduct().getId() == productId)
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setProduct(product);
            item.setQuantity(quantity);
            cart.addItem(item);
        }

        return cartRepository.save(cart);
    }

    /**
     * Remove product from cart
     */
    @Transactional
    public Cart removeProductFromCart(int cartId, int productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));

        boolean removed = cart.getItems().removeIf(item -> item.getProduct().getId() == productId);

        if (!removed) {
            throw new RuntimeException("Product not found in cart with ID: " + productId);
        }

        return cartRepository.save(cart);
    }

    /**
     * Get all items in a cart
     */
    @Transactional(readOnly = true)
    public List<CartItem> getCartItems(int cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));
        return cart.getItems();
    }

    /**
     * Get cart by ID
     */
    @Transactional(readOnly = true)
    public Cart getCartById(int cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));
    }

    /**
     * Get a user’s cart by userId (creates new if not exists)
     */
    @Transactional
    public Cart getCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if (user.getCart() == null) {
            return createCart(userId);
        }
        return user.getCart();
    }
}


