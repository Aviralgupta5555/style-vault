package com.ecommerce.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class AddToCartRequest {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    private String selectedSize;
}
