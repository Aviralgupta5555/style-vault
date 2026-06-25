package com.ecommerce.service;

import com.ecommerce.dto.PlaceOrderRequest;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order placeOrder(String email, PlaceOrderRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .paymentMethod(request.getPaymentMethod())
                .status("CONFIRMED")
                .totalAmount(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();

        Order savedOrder = orderRepository.save(order);

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(cartItem.getProduct().getPrice())
                    .selectedSize(cartItem.getSelectedSize())
                    .build();
            savedOrder.getItems().add(orderItem);
            total = total.add(cartItem.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        savedOrder.setTotalAmount(total);
        orderRepository.save(savedOrder);

        // Clear cart after order
        cartItemRepository.deleteByUser(user);

        return savedOrder;
    }

    public List<Order> getMyOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
}
