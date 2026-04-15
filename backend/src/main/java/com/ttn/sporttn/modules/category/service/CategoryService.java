package com.ttn.sporttn.modules.category.service;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.category.dto.request.CreateCategoryRequest;
import com.ttn.sporttn.modules.category.dto.request.UpdateCategoryRequest;
import com.ttn.sporttn.modules.category.dto.response.CategoryResponse;
import com.ttn.sporttn.modules.category.entity.Category;
import com.ttn.sporttn.modules.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<CategoryResponse> getAllCategories(Pageable pageable) {
        log.info("[CATEGORY] Lấy danh sách danh mục. page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return categoryRepository.findByActiveTrue(pageable)
            .map(CategoryResponse::from);
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        log.info("[CATEGORY] Lấy danh mục. id={}", id);
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("[CATEGORY] Danh mục không tìm thấy. id={}", id);
                return new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
            });
        return CategoryResponse.from(category);
    }

    /**
     * Create new category (Admin only)
     */
    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        log.info("[CATEGORY] Tạo danh mục mới. name={}", request.getName());
        
        categoryRepository.findByName(request.getName())
            .ifPresent(cat -> {
                log.warn("[CATEGORY] Tên danh mục đã tồn tại. name={}", request.getName());
                throw new BusinessException(ErrorCode.INVALID_REQUEST);
            });

        Category category = Category.builder()
            .name(request.getName())
            .description(request.getDescription())
            .imageUrl(request.getImageUrl())
            .active(true)
            .build();

        Category saved = categoryRepository.save(category);
        log.info("[CATEGORY] Tạo danh mục thành công. id={}, name={}", saved.getId(), saved.getName());
        return CategoryResponse.from(saved);
    }

    /**
     * Update category (Admin only)
     */
    @Transactional
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        log.info("[CATEGORY] Cập nhật danh mục. id={}, name={}", id, request.getName());
        
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("[CATEGORY] Danh mục không tìm thấy. id={}", id);
                return new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
            });

        // Check if new name conflicts with other categories
        if (!category.getName().equals(request.getName())) {
            categoryRepository.findByName(request.getName())
                .ifPresent(cat -> {
                    log.warn("[CATEGORY] Tên danh mục đã tồn tại. name={}", request.getName());
                    throw new BusinessException(ErrorCode.INVALID_REQUEST);
                });
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }

        Category updated = categoryRepository.save(category);
        log.info("[CATEGORY] Cập nhật danh mục thành công. id={}, name={}", updated.getId(), updated.getName());
        return CategoryResponse.from(updated);
    }

    /**
     * Delete category (Admin only)
     */
    @Transactional
    public void deleteCategory(Long id) {
        log.info("[CATEGORY] Xóa danh mục. id={}", id);
        
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("[CATEGORY] Danh mục không tìm thấy. id={}", id);
                return new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
            });
        
        categoryRepository.delete(category);
        log.info("[CATEGORY] Xóa danh mục thành công. id={}", id);
    }

    /**
     * Toggle category active status (Admin only)
     */
    @Transactional
    public CategoryResponse toggleCategoryStatus(Long id) {
        log.info("[CATEGORY] Thay đổi trạng thái danh mục. id={}", id);
        
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("[CATEGORY] Danh mục không tìm thấy. id={}", id);
                return new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
            });

        category.setActive(!category.getActive());
        Category updated = categoryRepository.save(category);
        log.info("[CATEGORY] Thay đổi trạng thái thành công. id={}, active={}", updated.getId(), updated.getActive());
        return CategoryResponse.from(updated);
    }
}
