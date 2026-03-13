package com.zulugshop.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

public class OrderDto {

    @Data
    public static class CreateOrderRequest {
        @NotEmpty(message = "Order must have at least one item")
        private List<OrderItemRequest> items;

        @NotNull(message = "Shipping address is required")
        private AddressRequest shippingAddress;

        private String paymentMethod = "CASH_ON_DELIVERY";
        private String notes;
    }

    @Data
    public static class OrderItemRequest {
        private String productId;

        @Positive(message = "Quantity must be positive")
        private int quantity;
    }

    @Data
    public static class AddressRequest {
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;
    }

    @Data
    public static class UpdateStatusRequest {
        private String status;
        private String trackingNumber;
    }
}
