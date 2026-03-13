package com.zulugshop.service;

import com.zulugshop.exception.BadRequestException;
import com.zulugshop.exception.ResourceNotFoundException;
import com.zulugshop.model.Category;
import com.zulugshop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findByActiveTrueOrderBySortOrderAsc();
    }

    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
    }

    public Category createCategory(Category category) {
        if (categoryRepository.existsBySlug(category.getSlug())) {
            throw new BadRequestException("Category slug already exists");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(String id, Category updatedCategory) {
        Category category = getCategoryById(id);
        category.setName(updatedCategory.getName());
        category.setSlug(updatedCategory.getSlug());
        category.setDescription(updatedCategory.getDescription());
        category.setImage(updatedCategory.getImage());
        category.setSortOrder(updatedCategory.getSortOrder());
        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        Category category = getCategoryById(id);
        category.setActive(false);
        categoryRepository.save(category);
    }
}
