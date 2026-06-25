package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByBrandIgnoreCase(String brand);
    List<Product> findByCategoryIgnoreCase(String category);
    List<Product> findByBrandIgnoreCaseAndCategoryIgnoreCase(String brand, String category);
    List<Product> findByFeaturedTrue();

    @Query("SELECT DISTINCT p.brand FROM Product p ORDER BY p.brand")
    List<String> findDistinctBrands();

    @Query("SELECT DISTINCT p.category FROM Product p ORDER BY p.category")
    List<String> findDistinctCategories();

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(String keyword);
}
