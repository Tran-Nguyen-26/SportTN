package com.ttn.sporttn.modules.category.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.category.dto.request.CreateCategoryRequest;
import com.ttn.sporttn.modules.category.dto.request.UpdateCategoryRequest;
import com.ttn.sporttn.modules.category.dto.response.CategoryAdminResponse;
import com.ttn.sporttn.modules.category.dto.response.CategoryResponse;
import com.ttn.sporttn.modules.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/admin-list")
    public ResponseEntity<ApiResponse<List<CategoryAdminResponse>>> getAllForAdmin() {
        List<CategoryAdminResponse> categoryAdminResponses = categoryService.getCategoriesForAdmin();
        return ResponseEntity.ok(ApiResponse.ok(categoryAdminResponses, "Lấy danh sách danh mục cho admin"));
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

    @PatchMapping("/{id}/toggle-show-on-home")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> toggleShowOnHome(
        @PathVariable Long id
    ) {
        categoryService.toggleShowOnHome(id);
        return ResponseEntity.ok(ApiResponse.ok("Thay đổi trạng thái danh mục thành công"));
    }
}
