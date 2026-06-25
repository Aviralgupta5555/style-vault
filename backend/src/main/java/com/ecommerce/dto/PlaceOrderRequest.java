package com.ecommerce.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class PlaceOrderRequest {
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
