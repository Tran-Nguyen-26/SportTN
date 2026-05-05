package com.ttn.sporttn.modules.product.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.product.dto.request.ProductRequest;
import com.ttn.sporttn.modules.product.dto.request.admin.ProductCreateRequest;
import com.ttn.sporttn.modules.product.dto.request.admin.ProductUpdateRequest;
import com.ttn.sporttn.modules.product.dto.response.admin.ProductAdminResponse;
import com.ttn.sporttn.modules.product.dto.response.ProductCardResponse;
import com.ttn.sporttn.modules.product.dto.response.ProductDetailResponse;
import com.ttn.sporttn.modules.product.dto.response.ProductPageResponse;
import com.ttn.sporttn.modules.product.dto.response.admin.ProductDetailFromUpdateResponse;
import com.ttn.sporttn.modules.product.dto.response.admin.ProductResponse;
import com.ttn.sporttn.modules.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Get product by ID
     * GET /api/v1/products/{id}
     */
    @GetMapping("/id/{id}")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> getProduct(
        @PathVariable Long id
    ) {
        ProductDetailResponse product = productService.getProduct(id);
        return ResponseEntity.ok(ApiResponse.ok(product, "Lấy sản phẩm thành công"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ProductPageResponse>> getProductPage(@PathVariable String slug) {
        ProductPageResponse product = productService.getProductPage(slug);
        return ResponseEntity.ok(ApiResponse.ok(product, "Lấy sản phẩm theo slug"));
    }

    /**
     * Create new product (Admin only)
     * POST /api/v1/products
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
        @Valid @RequestBody ProductCreateRequest request
    ) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(product, "Tạo sản phẩm thành công"));
    }

    /**
     * Update product (Admin only)
     * PUT /api/v1/products/{id}
     */
//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<ProductDetailResponse>> updateProduct(
//        @PathVariable Long id,
//        @Valid @RequestBody ProductRequest request
//    ) {
//        ProductDetailResponse product = productService.updateProduct(id, request);
//        return ResponseEntity.ok(ApiResponse.ok(product, "Cập nhật sản phẩm thành công"));
//    }

    /**
     * Delete product (Admin only)
     * DELETE /api/v1/products/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
        @PathVariable Long id
    ) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa sản phẩm thành công"));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<ProductCardResponse>>> getPopular() {
        List<ProductCardResponse> popularProducts = productService.getPopularProducts();
        return ResponseEntity.ok(ApiResponse.ok(popularProducts));
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<Page<ProductAdminResponse>>> getProductsForAdmin(
            @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ProductAdminResponse> products = productService.getProductsForAdmin(pageable);
        return ResponseEntity.ok(ApiResponse.ok(products, "Lấy danh sách sản phẩm thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateProduct(@PathVariable Long id, @Valid ProductUpdateRequest request) {
        productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật sản phẩm thành công: id: " + id));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<ApiResponse<ProductDetailFromUpdateResponse>> getProductDetailFromUpdate(@PathVariable Long id) {
        ProductDetailFromUpdateResponse response = productService.getProductDetailFromUpdate(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

}
