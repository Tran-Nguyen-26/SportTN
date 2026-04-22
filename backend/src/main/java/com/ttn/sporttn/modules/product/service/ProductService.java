package com.ttn.sporttn.modules.product.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import com.ttn.sporttn.modules.product.dto.request.admin.ProductUpdateRequest;
import com.ttn.sporttn.modules.product.dto.request.admin.VariantUpdateRequest;
import com.ttn.sporttn.modules.product.dto.response.*;
import com.ttn.sporttn.modules.product.dto.response.admin.ProductAdminResponse;
import com.ttn.sporttn.modules.product.dto.response.admin.ProductDetailFromUpdateResponse;
import com.ttn.sporttn.modules.product.dto.response.admin.VariantDetailResponse;
import com.ttn.sporttn.modules.product.entity.*;
import com.ttn.sporttn.modules.product.mapper.ProductMapper;
import com.ttn.sporttn.modules.product.repository.ProductVariantRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.category.entity.Category;
import com.ttn.sporttn.modules.category.repository.CategoryRepository;
import com.ttn.sporttn.modules.product.dto.request.ImageRequest;
import com.ttn.sporttn.modules.product.dto.request.ProductRequest;
import com.ttn.sporttn.modules.product.dto.request.VariantRequest;
import com.ttn.sporttn.modules.product.repository.BrandRepository;
import com.ttn.sporttn.modules.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductMapper productMapper;

    public ProductPageResponse getProductPage(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        ProductCardResponse productCardResponse = productMapper.toProductCartResponse(product);

        List<ImageResponse> imageResponse = product.getImages()
                .stream()
                .map(ImageResponse::buildImageResponse)
                .collect(Collectors.toList());


        List<ProductVariant> productVariants = productVariantRepository.findByProductId(product.getId());

        List<VariantResponse> variantResponses = productVariants
                .stream()
                .map(VariantResponse::buildVariantResponse)
                .collect(Collectors.toList());

        return ProductPageResponse.builder()
                .productCardResponse(productCardResponse)
                .productImageResponses(imageResponse)
                .variantResponses(variantResponses)
                .build();

    }

    public List<ProductCardResponse> getPopularProducts() {
        List<Product> products = productRepository.findTop10ByActiveTrueOrderBySoldCountDesc();
        return products.stream()
                .map(productMapper::toProductCartResponse)
                .toList();
    }

    @Transactional
    public ProductDetailResponse createProduct(ProductRequest productRequest) {
        log.info("[PRODUCT] Tạo sản phẩm mới. name={}", productRequest.getName());
        
        // Validate input
        if (productRequest == null || productRequest.getName() == null || productRequest.getName().isEmpty()) {
            log.warn("[PRODUCT] Tên sản phẩm không hợp lệ");
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        // Fetch category
        Category category = null;
        if (productRequest.getCategoryId() != null) {
            category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> {
                        log.warn("[PRODUCT] Danh mục không tìm thấy. categoryId={}", productRequest.getCategoryId());
                        return new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
                    });
        }

        // Fetch brand
        Brand brand = null;
        if (productRequest.getBrandId() != null) {
            brand = brandRepository.findById(productRequest.getBrandId())
                    .orElseThrow(() -> {
                        log.warn("[PRODUCT] Thương hiệu không tìm thấy. brandId={}", productRequest.getBrandId());
                        return new BusinessException(ErrorCode.BRAND_NOT_FOUND);
                    });
        }

        // Create product entity
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setCategory(category);
        product.setBrand(brand);

        // Add images
        if (productRequest.getImages() != null && !productRequest.getImages().isEmpty()) {
            product.setImages(new ArrayList<>());
            for (ImageRequest imageRequest : productRequest.getImages()) {
                ProductImage image = new ProductImage();
                image.setImageUrl(imageRequest.getImageUrl());
                image.setMain(imageRequest.isMain());
                image.setProduct(product);
                product.getImages().add(image);
            }
            log.debug("[PRODUCT] Thêm {} ảnh cho sản phẩm", productRequest.getImages().size());
        } else {
            product.setImages(new ArrayList<>());
        }

        // Add variants
        if (productRequest.getVariants() != null && !productRequest.getVariants().isEmpty()) {
            product.setVariants(new ArrayList<>());
            for (VariantRequest variantRequest : productRequest.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setSku(variantRequest.getSku());
                variant.setColor(variantRequest.getColor());
                variant.setSize(variantRequest.getSize());
                variant.setOriginalPrice(variantRequest.getOriginalPrice());
                variant.setSalePrice(variantRequest.getSalePrice());
                variant.setStockQuantity(variantRequest.getStockQuantity());
                variant.setWeightGram(variantRequest.getWeightGram());
                variant.setProduct(product);
                product.getVariants().add(variant);
            }
            log.debug("[PRODUCT] Thêm {} biến thể cho sản phẩm", productRequest.getVariants().size());
        } else {
            product.setVariants(new ArrayList<>());
        }

        // Save product
        Product savedProduct = productRepository.save(product);
        log.info("[PRODUCT] Tạo sản phẩm thành công. id={}, name={}", savedProduct.getId(), savedProduct.getName());

        // Convert to response
        return buildProductDetailResponse(savedProduct);
    }

    private ProductDetailResponse buildProductDetailResponse(Product product) {
        ProductDetailResponse response = new ProductDetailResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
        response.setBrandName(product.getBrand() != null ? product.getBrand().getName() : null);

        // Convert variants
        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            response.setVariants(product.getVariants().stream()
                    .map(VariantResponse::buildVariantResponse)
                    .collect(Collectors.toList()));
        } else {
            response.setVariants(new ArrayList<>());
        }

        // Convert images
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            response.setImages(product.getImages().stream()
                    .map(ImageResponse::buildImageResponse)
                    .collect(Collectors.toList()));
        } else {
            response.setImages(new ArrayList<>());
        }

        return response;
    }

    public ProductDetailResponse getProduct(Long id) {
        log.info("[PRODUCT] Lấy sản phẩm. id={}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("[PRODUCT] Sản phẩm không tìm thấy. id={}", id);
                    return new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
                });
        return buildProductDetailResponse(product);
    }

//    @Transactional
//    public ProductDetailResponse updateProduct(Long id, ProductRequest productRequest) {
//        log.info("[PRODUCT] Cập nhật sản phẩm. id={}, name={}", id, productRequest.getName());
//
//        // Validate input
//        if (productRequest == null || productRequest.getName() == null || productRequest.getName().isEmpty()) {
//            log.warn("[PRODUCT] Tên sản phẩm không hợp lệ");
//            throw new BusinessException(ErrorCode.INVALID_REQUEST);
//        }
//
//        // Find product
//        Product product = productRepository.findById(id)
//                .orElseThrow(() -> {
//                    log.warn("[PRODUCT] Sản phẩm không tìm thấy. id={}", id);
//                    return new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
//                });
//
//        // Update basic info
//        product.setName(productRequest.getName());
//        product.setDescription(productRequest.getDescription());
//
//        // Update category
//        if (productRequest.getCategoryId() != null) {
//            Category category = categoryRepository.findById(productRequest.getCategoryId())
//                    .orElseThrow(() -> {
//                        log.warn("[PRODUCT] Danh mục không tìm thấy. categoryId={}", productRequest.getCategoryId());
//                        return new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
//                    });
//            product.setCategory(category);
//        } else {
//            product.setCategory(null);
//        }
//
//        // Update brand
//        if (productRequest.getBrandId() != null) {
//            Brand brand = brandRepository.findById(productRequest.getBrandId())
//                    .orElseThrow(() -> {
//                        log.warn("[PRODUCT] Thương hiệu không tìm thấy. brandId={}", productRequest.getBrandId());
//                        return new BusinessException(ErrorCode.BRAND_NOT_FOUND);
//                    });
//            product.setBrand(brand);
//        } else {
//            product.setBrand(null);
//        }
//
//        // Update images
//        if (productRequest.getImages() != null) {
//            product.getImages().clear();
//            for (ImageRequest imageRequest : productRequest.getImages()) {
//                ProductImage image = new ProductImage();
//                image.setImageUrl(imageRequest.getImageUrl());
//                image.setMain(imageRequest.isMain());
//                image.setProduct(product);
//                product.getImages().add(image);
//            }
//            log.debug("[PRODUCT] Cập nhật {} ảnh cho sản phẩm. id={}", productRequest.getImages().size(), id);
//        }
//
//        // Update variants
//        if (productRequest.getVariants() != null) {
//            product.getVariants().clear();
//            for (VariantRequest variantRequest : productRequest.getVariants()) {
//                ProductVariant variant = new ProductVariant();
//                variant.setSku(variantRequest.getSku());
//                variant.setColor(variantRequest.getColor());
//                variant.setSize(variantRequest.getSize());
//                variant.setOriginalPrice(variantRequest.getOriginalPrice());
//                variant.setSalePrice(variantRequest.getSalePrice());
//                variant.setStockQuantity(variantRequest.getStockQuantity());
//                variant.setWeightGram(variantRequest.getWeightGram());
//                variant.setProduct(product);
//                product.getVariants().add(variant);
//            }
//            log.debug("[PRODUCT] Cập nhật {} biến thể cho sản phẩm. id={}", productRequest.getVariants().size(), id);
//        }
//
//        // Save updated product
//        Product updatedProduct = productRepository.save(product);
//        log.info("[PRODUCT] Cập nhật sản phẩm thành công. id={}, name={}", updatedProduct.getId(), updatedProduct.getName());
//
//        return buildProductDetailResponse(updatedProduct);
//    }

    public void updateProduct(Long id, ProductUpdateRequest request) {
        // 1. Tìm Product gốc
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm ID: " + id));

        // 2. Cập nhật thông tin cơ bản
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setActive(request.getActive()); // request.getActive() tùy theo lombok
        product.setMainImageUrl(request.getMainImageUrl());

        // 3. Cập nhật Category & Brand
        updateReferences(product, request);

        // 4. Cập nhật Danh sách ảnh phụ (ProductImage)
        updateProductImages(product, request.getExtraImageUrls());

        // 5. Cập nhật Biến thể (ProductVariant)
        updateVariants(product, request.getVariants());

        // Do có @Transactional và sử dụng Dirty Checking của Hibernate,
        // bạn không nhất thiết phải gọi .save() trừ khi muốn flush ngay lập tức.
    }

    private void updateReferences(Product product, ProductUpdateRequest request) {
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.getReferenceById(request.getCategoryId());
            product.setCategory(category);
        }
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.getReferenceById(request.getBrandId());
            product.setBrand(brand);
        }
    }

    private void updateProductImages(Product product, List<String> newUrls) {
        // Xóa sạch ảnh cũ (orphanRemoval = true trong Entity sẽ tự động xóa trong DB)
        product.getImages().clear();

        if (newUrls != null) {
            for (String url : newUrls) {
                ProductImage img = new ProductImage();
                img.setImageUrl(url); // Giả định BaseImage có field url
                product.addImage(img);
            }
        }
    }

    private void updateVariants(Product product, List<VariantUpdateRequest> variantRequests) {
        if (variantRequests == null) return;

        // Xóa những variant không còn nằm trong request gửi lên
        Set<Long> requestVariantIds = variantRequests.stream()
                .map(VariantUpdateRequest::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        product.getVariants().removeIf(v -> !requestVariantIds.contains(v.getId()));

        for (VariantUpdateRequest vReq : variantRequests) {
            if (vReq.getId() != null) {
                // UPDATE variant hiện có
                product.getVariants().stream()
                        .filter(v -> v.getId().equals(vReq.getId()))
                        .findFirst()
                        .ifPresent(v -> mapVariantData(v, vReq));
            } else {
                // INSERT variant mới
                ProductVariant newVariant = new ProductVariant();
                mapVariantData(newVariant, vReq);
                newVariant.setProduct(product);
                product.getVariants().add(newVariant);
            }
        }
    }

    private void mapVariantData(ProductVariant v, VariantUpdateRequest vReq) {
        v.setSku(vReq.getSku());
        v.setColor(vReq.getColor());
        v.setSize(vReq.getSize());
        v.setOriginalPrice(vReq.getOriginalPrice());
        v.setSalePrice(vReq.getSalePrice());
        v.setStockQuantity(vReq.getStockQuantity());
        v.setWeightGram(vReq.getWeightGram());

        // Xử lý ảnh của Variant (ProductVariantImage)
        v.getVariantImages().clear();
        if (vReq.getImageUrls() != null) {
            for (String url : vReq.getImageUrls()) {
                ProductVariantImage vImg = new ProductVariantImage();
                vImg.setImageUrl(url);
                v.addImage(vImg);
            }
        }
    }

    public ProductDetailFromUpdateResponse getProductDetailFromUpdate(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        return ProductDetailFromUpdateResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .mainImageUrl(product.getMainImageUrl())
                .active(product.isActive())

                // Lấy ID để FE dễ dàng bind vào Dropdown
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)

                // Map danh sách ảnh phụ từ List<ProductImage> sang List<String>
                .extraImageUrls(product.getImages().stream()
                        .map(ProductImage::getImageUrl) // Giả sử BaseImage có getUrl()
                        .collect(Collectors.toList()))

                // Map danh sách biến thể
                .variants(product.getVariants().stream()
                        .map(this::mapToVariantResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    private VariantDetailResponse mapToVariantResponse(ProductVariant variant) {
        return VariantDetailResponse.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .color(variant.getColor())
                .size(variant.getSize())
                .originalPrice(variant.getOriginalPrice())
                .salePrice(variant.getSalePrice())
                .stockQuantity(variant.getStockQuantity())
                .weightGram(variant.getWeightGram())
                .active(variant.isActive())
                .mainImageUrl(variant.getMainImageUrl())

                // Map ảnh của từng variant
                .imageUrls(variant.getVariantImages().stream()
                        .map(ProductVariantImage::getImageUrl)
                        .collect(Collectors.toList()))
                .build();
    }

    @Transactional
    public void deleteProduct(Long id) {
        log.info("[PRODUCT] Xóa sản phẩm. id={}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("[PRODUCT] Sản phẩm không tìm thấy. id={}", id);
                    return new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
                });
        
        productRepository.delete(product);
        log.info("[PRODUCT] Xóa sản phẩm thành công. id={}", id);
    }

    public Page<ProductAdminResponse> getProductsForAdmin(Pageable pageable) {
        return productRepository.findAllForAdmin(pageable);
    }
} 
