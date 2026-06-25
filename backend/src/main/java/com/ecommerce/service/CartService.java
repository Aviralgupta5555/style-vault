package com.ecommerce.service;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<CartItem> getCart(String email) {
        User user = getUser(email);
        return cartItemRepository.findByUser(user);
    }

    @Transactional
    public CartItem addToCart(String email, AddToCartRequest request) {
        User user = getUser(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String size = request.getSelectedSize() != null ? request.getSelectedSize() : "M";

        Optional<CartItem> existing = cartItemRepository
                .findByUserAndProductAndSelectedSize(user, product, size);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            return cartItemRepository.save(item);
        }

        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(request.getQuantity())
                .selectedSize(size)
                .build();

        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public CartItem updateCartItem(String email, Long cartItemId, Integer quantity) {
        User user = getUser(email);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }

        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeFromCart(String email, Long cartItemId) {
        User user = getUser(email);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
