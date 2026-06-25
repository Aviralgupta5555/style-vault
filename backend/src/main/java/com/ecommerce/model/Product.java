package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String category;

    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer stockQuantity = 100;

    private String sizes; // comma-separated e.g. "XS,S,M,L,XL,XXL"

    private String color;

    @Builder.Default
    private Boolean featured = false;

    @Builder.Default
    private Double rating = 4.0;

    @Builder.Default
    private Integer reviewCount = 0;
}
