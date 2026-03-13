package com.zulugshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

public class ProductDto {

    @Data
    public static class CreateProductRequest {
        @NotBlank(message = "Product name is required")
        private String name;

        private String description;
        private String sku;

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        private BigDecimal price;

        private BigDecimal comparePrice;

        @PositiveOrZero
        private int stock;

        @NotBlank(message = "Category is required")
        private String categoryId;

        private List<String> images;
        private List<String> tags;
        private boolean featured;
        private ProductDetailsDto details;
    }

    @Data
    public static class ProductDetailsDto {
        private String brand;
        private String model;
        private String color;
        private String size;
        private String weight;
        private String material;
    }

    @Data
    public static class UpdateStockRequest {
        @PositiveOrZero
        private int stock;
    }
}
