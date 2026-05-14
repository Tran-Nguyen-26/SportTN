package com.ttn.sporttn.modules.product.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.common.dto.PageResponse;
import com.ttn.sporttn.modules.payment.dto.request.ProductFilterRequest;
import com.ttn.sporttn.modules.product.dto.request.ProductRequest;
import com.ttn.sporttn.modules.product.dto.request.admin.ProductCreateRequest;
import com.ttn.sporttn.modules.product.dto.request.admin.ProductUpdateRequest;
import com.ttn.sporttn.modules.product.dto.response.VariantResponse;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

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

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
        @Valid @RequestBody ProductCreateRequest request
    ) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(product, "Tạo sản phẩm thành công"));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa sản phẩm thành công"));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<ProductCardResponse>>> getPopular() {
        List<ProductCardResponse> popularProducts = productService.getPopularProducts();
        return ResponseEntity.ok(ApiResponse.ok(popularProducts));
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<PageResponse<ProductAdminResponse>>> getProductsForAdmin(
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "10")  int size,
            @RequestParam(required = false)     String keyword,
            @RequestParam(required = false)     String categorySlug,
            @RequestParam(required = false)     Boolean active) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<ProductAdminResponse> result = productService.getProductsForAdmin(pageable, keyword, categorySlug, active);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(result), "Lấy danh sách sản phẩm thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id,@RequestBody @Valid ProductUpdateRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.ok(product, "Cập nhật sản phẩm thành công: id: " + id));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<ApiResponse<ProductDetailFromUpdateResponse>> getProductDetailFromUpdate(@PathVariable Long id) {
        ProductDetailFromUpdateResponse response = productService.getProductDetailFromUpdate(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}/variants")
    public ResponseEntity<ApiResponse<List<VariantResponse>>> getVariantsByProductId(@PathVariable Long id) {
        List<VariantResponse> responses = productService.getVariantsByProductId(id);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<ProductCardResponse>>> searchProducts(
            @RequestParam String q,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        PageResponse<ProductCardResponse> result = productService.searchProducts(q, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result, "Tìm kiếm thành công"));
    }

    @GetMapping("/filtered")
    public ResponseEntity<ApiResponse<PageResponse<ProductCardResponse>>> getFilteredProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "soldCount,desc") String sort,
            @RequestParam(defaultValue = "0") BigDecimal minPrice,
            @RequestParam(defaultValue = "999999999") BigDecimal maxPrice,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String brands) {

        ProductFilterRequest filter = ProductFilterRequest.builder()
                .page(page)
                .size(size)
                .sort(sort)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .categorySlug(categorySlug)
                .subCategory(subCategory)
                .brands(brands  != null ? List.of(brands.split(","))  : List.of())
                .build();

        PageResponse<ProductCardResponse> result = productService.filterProducts(filter);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }


}
