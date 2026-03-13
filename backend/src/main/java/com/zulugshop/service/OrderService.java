package com.zulugshop.service;

import com.zulugshop.dto.OrderDto;
import com.zulugshop.exception.BadRequestException;
import com.zulugshop.exception.ResourceNotFoundException;
import com.zulugshop.model.Order;
import com.zulugshop.model.Product;
import com.zulugshop.model.User;
import com.zulugshop.repository.OrderRepository;
import com.zulugshop.repository.ProductRepository;
import com.zulugshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Order createOrder(String userEmail, OrderDto.CreateOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Order.OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderDto.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", itemReq.getProductId()));

            if (product.getStock() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            orderItems.add(Order.OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .productImage(product.getImages().isEmpty() ? null : product.getImages().get(0))
                    .quantity(itemReq.getQuantity())
                    .price(product.getPrice())
                    .total(itemTotal)
                    .build());

            subtotal = subtotal.add(itemTotal);

            // Update stock
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);
        }

        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(50)) >= 0
                ? BigDecimal.ZERO : BigDecimal.valueOf(5.99);
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.08));
        BigDecimal total = subtotal.add(shipping).add(tax);

        User.Address shippingAddress = User.Address.builder()
                .street(request.getShippingAddress().getStreet())
                .city(request.getShippingAddress().getCity())
                .state(request.getShippingAddress().getState())
                .zipCode(request.getShippingAddress().getZipCode())
                .country(request.getShippingAddress().getCountry())
                .build();

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .userId(user.getId())
                .userEmail(user.getEmail())
                .userName(user.getFirstName() + " " + user.getLastName())
                .items(orderItems)
                .subtotal(subtotal)
                .shipping(shipping)
                .tax(tax)
                .total(total)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("PENDING")
                .shippingAddress(shippingAddress)
                .notes(request.getNotes())
                .build();

        return orderRepository.save(order);
    }

    public Page<Order> getUserOrders(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Order updateOrderStatus(String id, OrderDto.UpdateStatusRequest request) {
        Order order = getOrderById(id);
        order.setStatus(request.getStatus());
        if (request.getTrackingNumber() != null) {
            order.setTrackingNumber(request.getTrackingNumber());
        }
        return orderRepository.save(order);
    }

    public long countByStatus(String status) {
        return orderRepository.countByStatus(status);
    }

    private String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int random = new Random().nextInt(9000) + 1000;
        return "ZG-" + date + "-" + random;
    }
}
