package com.zulugshop.repository;

import com.zulugshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrue(String categoryId, Pageable pageable);

    List<Product> findByFeaturedTrueAndActiveTrue();

    @Query("{ 'active': true, $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } }, { 'tags': { $in: [?0] } } ] }")
    Page<Product> searchProducts(String keyword, Pageable pageable);

    long countByActiveTrue();

    long countByCategoryId(String categoryId);
}
