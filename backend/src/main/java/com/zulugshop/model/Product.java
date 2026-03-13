package com.zulugshop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    @TextIndexed
    private String name;

    @TextIndexed
    private String description;

    private String sku;
    private BigDecimal price;
    private BigDecimal comparePrice;
    private int stock;
    private String categoryId;
    private String categoryName;

    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    private double rating;
    private int reviewCount;

    @Builder.Default
    private boolean featured = false;

    @Builder.Default
    private boolean active = true;

    private ProductDetails details;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductDetails {
        private String brand;
        private String model;
        private String color;
        private String size;
        private String weight;
        private String material;
    }
}
