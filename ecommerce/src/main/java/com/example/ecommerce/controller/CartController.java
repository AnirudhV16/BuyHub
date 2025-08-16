package com.example.ecommerce.controller;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Create a cart for a user (if not exists)
     */
    @PostMapping("/create/{userId}")
    public Cart createCart(@PathVariable Long userId) {
        return cartService.createCart(userId);
    }

    /**
     * Add product to cart
     */
    @PostMapping("/{cartId}/add/{productId}")
    public Cart addProductToCart(@PathVariable int cartId,
                                 @PathVariable int productId,
                                 @RequestParam(defaultValue = "1") int quantity) {
        return cartService.addProductToCart(cartId, productId, quantity);
    }

    /**
     * Remove product from cart
     */
    @DeleteMapping("/{cartId}/remove/{productId}")
    public Cart removeProductFromCart(@PathVariable int cartId,
                                      @PathVariable int productId) {
        return cartService.removeProductFromCart(cartId, productId);
    }

    /**
     * Get all items in a cart
     */
    @GetMapping("/{cartId}/items")
    public List<CartItem> getCartItems(@PathVariable int cartId) {
        return cartService.getCartItems(cartId);
    }

    /**
     * Get cart by ID
     */
    @GetMapping("/{cartId}")
    public Cart getCartById(@PathVariable int cartId) {
        return cartService.getCartById(cartId);
    }

    /**
     * Get a user's cart by userId (creates new if not exists)
     */
    @GetMapping("/user/{userId}")
    public Cart getCartByUserId(@PathVariable Long userId) {
        return cartService.getCartByUserId(userId);
    }
}

