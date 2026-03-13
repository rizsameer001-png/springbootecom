package com.zulugshop.repository;

import com.zulugshop.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByActiveTrueOrderBySortOrderAsc();
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
