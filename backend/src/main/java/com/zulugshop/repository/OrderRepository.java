package com.zulugshop.repository;

import com.zulugshop.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(String status);
    long countByStatus(String status);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
