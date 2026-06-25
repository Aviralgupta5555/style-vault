package com.ecommerce.controller;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.model.CartItem;
import com.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCart(auth.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request,
                                       Authentication auth) {
        try {
            CartItem item = cartService.addToCart(auth.getName(), request);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long id,
                                            @RequestParam Integer quantity,
                                            Authentication auth) {
        try {
            CartItem item = cartService.updateCartItem(auth.getName(), id, quantity);
            if (item == null) {
                return ResponseEntity.ok(Map.of("message", "Item removed"));
            }
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id, Authentication auth) {
        try {
            cartService.removeFromCart(auth.getName(), id);
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
