package com.zulugshop.controller;

import com.zulugshop.dto.OrderDto;
import com.zulugshop.dto.ProductDto;
import com.zulugshop.model.Category;
import com.zulugshop.model.Order;
import com.zulugshop.model.Product;
import com.zulugshop.model.User;
import com.zulugshop.repository.UserRepository;
import com.zulugshop.service.CategoryService;
import com.zulugshop.service.OrderService;
import com.zulugshop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;
    private final UserRepository userRepository;

    // ===== Dashboard =====
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productService.getTotalProductCount());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalOrders", orderService.countByStatus(null) != 0 ? orderService.countByStatus("PENDING") + orderService.countByStatus("CONFIRMED") + orderService.countByStatus("SHIPPED") + orderService.countByStatus("DELIVERED") : 0);
        stats.put("pendingOrders", orderService.countByStatus("PENDING"));
        stats.put("confirmedOrders", orderService.countByStatus("CONFIRMED"));
        stats.put("deliveredOrders", orderService.countByStatus("DELIVERED"));
        return ResponseEntity.ok(stats);
    }

    // ===== Products =====
    @GetMapping("/products")
    public ResponseEntity<Page<Product>> getAdminProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(productService.getAllProductsAdmin(pageable));
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductDto.CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductDto.CreateProductRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // ===== Categories =====
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAdminCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable String id, @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // ===== Orders =====
    @GetMapping("/orders")
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable String id,
            @RequestBody OrderDto.UpdateStatusRequest request
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }

    // ===== Users =====
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(userRepository.findAll(pageable));
    }
}
