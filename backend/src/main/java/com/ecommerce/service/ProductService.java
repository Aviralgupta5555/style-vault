package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrandIgnoreCase(brand);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue();
    }

    public List<String> getAllBrands() {
        return productRepository.findDistinctBrands();
    }

    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword);
    }
}
