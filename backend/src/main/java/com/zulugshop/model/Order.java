package com.zulugshop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String orderNumber;
    private String userId;
    private String userEmail;
    private String userName;

    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    private BigDecimal subtotal;
    private BigDecimal shipping;
    private BigDecimal tax;
    private BigDecimal total;

    @Builder.Default
    private String status = "PENDING";  // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

    private String paymentMethod;
    private String paymentStatus;  // PENDING, PAID, FAILED, REFUNDED

    private User.Address shippingAddress;
    private String notes;
    private String trackingNumber;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private String productId;
        private String productName;
        private String productImage;
        private int quantity;
        private BigDecimal price;
        private BigDecimal total;
    }
}
