package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING";

    private String shippingAddress;
    private String paymentMethod;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
