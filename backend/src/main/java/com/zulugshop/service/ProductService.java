package com.zulugshop.service;

import com.zulugshop.dto.ProductDto;
import com.zulugshop.exception.ResourceNotFoundException;
import com.zulugshop.model.Category;
import com.zulugshop.model.Product;
import com.zulugshop.repository.CategoryRepository;
import com.zulugshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable);
    }

    public Page<Product> getProductsByCategory(String categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
    }

    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    public Product createProduct(ProductDto.CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .sku(request.getSku())
                .price(request.getPrice())
                .comparePrice(request.getComparePrice())
                .stock(request.getStock())
                .categoryId(request.getCategoryId())
                .categoryName(category.getName())
                .images(request.getImages())
                .tags(request.getTags())
                .featured(request.isFeatured())
                .build();

        if (request.getDetails() != null) {
            product.setDetails(Product.ProductDetails.builder()
                    .brand(request.getDetails().getBrand())
                    .model(request.getDetails().getModel())
                    .color(request.getDetails().getColor())
                    .size(request.getDetails().getSize())
                    .weight(request.getDetails().getWeight())
                    .material(request.getDetails().getMaterial())
                    .build());
        }

        return productRepository.save(product);
    }

    public Product updateProduct(String id, ProductDto.CreateProductRequest request) {
        Product product = getProductById(id);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
        product.setComparePrice(request.getComparePrice());
        product.setStock(request.getStock());
        product.setCategoryId(request.getCategoryId());
        product.setCategoryName(category.getName());
        product.setImages(request.getImages());
        product.setTags(request.getTags());
        product.setFeatured(request.isFeatured());

        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProductById(id);
        product.setActive(false);
        productRepository.save(product);
    }

    public long getTotalProductCount() {
        return productRepository.countByActiveTrue();
    }

    // Admin: get all products including inactive
    public Page<Product> getAllProductsAdmin(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
}
