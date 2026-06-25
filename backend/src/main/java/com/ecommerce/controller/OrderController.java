package com.ecommerce.controller;

import com.ecommerce.dto.PlaceOrderRequest;
import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@Valid @RequestBody PlaceOrderRequest request,
                                        Authentication auth) {
        try {
            Order order = orderService.placeOrder(auth.getName(), request);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getMyOrders(auth.getName()));
    }
}
