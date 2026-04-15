package com.ttn.sporttn.modules.category.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.category.dto.request.CreateCategoryRequest;
import com.ttn.sporttn.modules.category.dto.request.UpdateCategoryRequest;
import com.ttn.sporttn.modules.category.dto.response.CategoryResponse;
import com.ttn.sporttn.modules.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Get all active categories
     * GET /api/v1/categories
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CategoryResponse>>> getAllCategories(
        Pageable pageable
    ) {
        Page<CategoryResponse> categories = categoryService.getAllCategories(pageable);
        return ResponseEntity.ok(ApiResponse.ok(categories, "Lấy danh sách danh mục thành công"));
    }

    /**
     * Get category by ID
     * GET /api/v1/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
        @PathVariable Long id
    ) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.ok(category, "Lấy danh mục thành công"));
    }

    /**
     * Create new category (Admin only)
     * POST /api/v1/categories
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
        @Valid @RequestBody CreateCategoryRequest request
    ) {
        CategoryResponse category = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(category, "Tạo danh mục thành công"));
    }

    /**
     * Update category (Admin only)
     * PUT /api/v1/categories/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
        @PathVariable Long id,
        @Valid @RequestBody UpdateCategoryRequest request
    ) {
        CategoryResponse category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.ok(category, "Cập nhật danh mục thành công"));
    }

    /**
     * Delete category (Admin only)
     * DELETE /api/v1/categories/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
        @PathVariable Long id
    ) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa danh mục thành công"));
    }

    /**
     * Toggle category active status (Admin only)
     * PATCH /api/v1/categories/{id}/toggle-status
     */
    @PostMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> toggleCategoryStatus(
        @PathVariable Long id
    ) {
        CategoryResponse category = categoryService.toggleCategoryStatus(id);
        return ResponseEntity.ok(ApiResponse.ok(category, "Thay đổi trạng thái danh mục thành công"));
    }
}
