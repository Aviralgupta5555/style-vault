package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        List<Product> products;

        if (search != null && !search.isBlank()) {
            products = productService.searchProducts(search);
        } else if (brand != null && category != null) {
            products = productService.getAllProducts().stream()
                    .filter(p -> p.getBrand().equalsIgnoreCase(brand)
                            && p.getCategory().equalsIgnoreCase(category))
                    .toList();
        } else if (brand != null) {
            products = productService.getProductsByBrand(brand);
        } else if (category != null) {
            products = productService.getProductsByCategory(category);
        } else {
            products = productService.getAllProducts();
        }

        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        return ResponseEntity.ok(productService.getAllBrands());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }
}
