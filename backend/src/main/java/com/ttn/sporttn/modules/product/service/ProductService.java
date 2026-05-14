package com.ttn.sporttn.modules.product.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.ttn.sporttn.common.dto.PageResponse;
import com.ttn.sporttn.modules.cart.repository.CartItemRepository;
import com.ttn.sporttn.modules.order.dto.request.OrderItemRequest;
import com.ttn.sporttn.modules.order.entity.OrderItem;
import com.ttn.sporttn.modules.order.repository.OrderItemRepository;
import com.ttn.sporttn.modules.order.repository.OrderRepository;
import com.ttn.sporttn.modules.payment.dto.request.ProductFilterRequest;
import com.ttn.sporttn.modules.product.dto.request.admin.*;
import com.ttn.sporttn.modules.product.dto.response.*;
import com.ttn.sporttn.modules.product.dto.response.admin.*;
import com.ttn.sporttn.modules.product.entity.*;
import com.ttn.sporttn.modules.product.mapper.ProductMapper;
import com.ttn.sporttn.modules.product.repository.ProductVariantRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
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
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductMapper productMapper;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

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
    public ProductResponse createProduct(ProductCreateRequest request) {
        log.info("[PRODUCT] Tạo sản phẩm mới. name={}", request.getName());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> {
                    log.warn("[PRODUCT] Danh mục không tìm thấy. categoryId={}", request.getCategoryId());
                    return new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
                });

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> {
                    log.warn("[PRODUCT] Thương hiệu không tìm thấy. brandId={}", request.getBrandId());
                    return new BusinessException(ErrorCode.BRAND_NOT_FOUND);
                });

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .slug(request.getSlug())
                .mainImageUrl(request.getMainImageUrl())
                .category(category)
                .brand(brand)
                .active(request.getActive() != null ? request.getActive() : true)
                .variants(new ArrayList<>())
                .build();

        if (request.getVariants() != null) {
            for (ProductVariantRequest variantRequest : request.getVariants()) {

                ProductVariant variant = ProductVariant.builder()
                        .sku(variantRequest.getSku())
                        .color(variantRequest.getColor())
                        .size(variantRequest.getSize())
                        .originalPrice(variantRequest.getOriginalPrice())
                        .salePrice(variantRequest.getSalePrice())
                        .stockQuantity(variantRequest.getStockQuantity())
                        .weightGram(variantRequest.getWeightGram())
                        .mainImageUrl(variantRequest.getMainImageUrl())
                        .product(product)
                        .variantImages(new ArrayList<>())
                        .build();

                // Build variant images
                if (variantRequest.getImages() != null) {
                    for (VariantImageRequest imageRequest : variantRequest.getImages()) {
                        ProductVariantImage image = ProductVariantImage.builder()
                                .imageUrl(imageRequest.getImageUrl())
                                .displayOrder(imageRequest.getDisplayOrder())
                                .variant(variant)
                                .build();
                        variant.getVariantImages().add(image);
                    }
                }

                product.getVariants().add(variant);
            }
            log.debug("[PRODUCT] Thêm {} biến thể", request.getVariants().size());
        }

        Product saved = productRepository.save(product);
        log.info("[PRODUCT] Tạo thành công. id={}, name={}", saved.getId(), saved.getName());

        return buildProductResponse(saved);
    }

    // ── Map entity → response ────────────────────────────────────────────────────

    private ProductResponse buildProductResponse(Product product) {
        List<ProductVariantResponse> variantResponses = product.getVariants().stream()
                .map(v -> ProductVariantResponse.builder()
                        .id(v.getId())
                        .sku(v.getSku())
                        .color(v.getColor())
                        .size(v.getSize())
                        .originalPrice(v.getOriginalPrice())
                        .salePrice(v.getSalePrice())
                        .stockQuantity(v.getStockQuantity())
                        .weightGram(v.getWeightGram())
                        .images(v.getVariantImages().stream()
                                .map(img -> VariantImageResponse.builder()
                                        .id(img.getId())
                                        .imageUrl(img.getImageUrl())
                                        .displayOrder(img.getDisplayOrder())
                                        .build())
                                .collect(Collectors.toList()))
                        .createdAt(v.getCreatedAt())
                        .updatedAt(v.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        int totalStock = variantResponses.stream()
                .mapToInt(v -> v.getStockQuantity() != null ? v.getStockQuantity() : 0)
                .sum();

        BigDecimal minPrice = product.getVariants().stream()
                .map(v -> v.getSalePrice() != null ? v.getSalePrice() : v.getOriginalPrice())
                .filter(Objects::nonNull)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        BigDecimal maxPrice = product.getVariants().stream()
                .map(ProductVariant::getOriginalPrice)
                .filter(Objects::nonNull)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .mainImageUrl(product.getMainImageUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .active(product.isActive())
                .totalStock(totalStock)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .variantCount(variantResponses.size())
                .variants(variantResponses)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
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

    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        log.info("[PRODUCT] Cập nhật sản phẩm. id={}, name={}", id, request.getName());

        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("[PRODUCT] Sản phẩm không tìm thấy. id={}", id);
                    return new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
                });

        // 1. Cập nhật thông tin cơ bản
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSlug(request.getSlug());
        product.setMainImageUrl(request.getMainImageUrl());
        product.setActive(request.getActive() != null ? request.getActive() : product.isActive());

        // 2. Cập nhật category & brand
        updateReferences(product, request);

        // 3. Cập nhật ảnh phụ
        updateProductImages(product, request.getExtraImageUrls());

        // 4. Cập nhật variants
        updateVariants(product, request.getVariants());

        // 5. Lưu & trả về response
        Product saved = productRepository.save(product);
        log.info("[PRODUCT] Cập nhật thành công. id={}, name={}", saved.getId(), saved.getName());

        return buildProductResponse(saved);
    }


    private void updateReferences(Product product, ProductUpdateRequest request) {
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> {
                        log.warn("[PRODUCT] Danh mục không tìm thấy. categoryId={}", request.getCategoryId());
                        return new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
                    });
            product.setCategory(category);
        }
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> {
                        log.warn("[PRODUCT] Thương hiệu không tìm thấy. brandId={}", request.getBrandId());
                        return new BusinessException(ErrorCode.BRAND_NOT_FOUND);
                    });
            product.setBrand(brand);
        }
    }


    private void updateProductImages(Product product, List<String> newUrls) {
        product.getImages().clear();

        if (newUrls != null) {
            for (int i = 0; i < newUrls.size(); i++) {
                ProductImage img = new ProductImage();
                img.setImageUrl(newUrls.get(i));
                img.setDisplayOrder(i + 1);
                img.setProduct(product);
                product.getImages().add(img);
            }
            log.debug("[PRODUCT] Cập nhật {} ảnh phụ. id={}", newUrls.size(), product.getId());
        }
    }


    // ── updateVariants ────────────────────────────────────────────────────────────

    private void updateVariants(Product product, List<VariantUpdateRequest> variantRequests) {
        if (variantRequests == null) return;

        Set<Long> requestIds = variantRequests.stream()
                .map(VariantUpdateRequest::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        product.getVariants().removeIf(v -> !requestIds.contains(v.getId()));

        product.getVariants().removeIf(v -> !requestIds.contains(v.getId()));

        for (VariantUpdateRequest vReq : variantRequests) {
            if (vReq.getId() != null) {
                product.getVariants().stream()
                        .filter(v -> v.getId().equals(vReq.getId()))
                        .findFirst()
                        .ifPresent(v -> mapVariantData(v, vReq));
            } else {
                ProductVariant newVariant = new ProductVariant();
                newVariant.setProduct(product);
                newVariant.setVariantImages(new ArrayList<>());
                mapVariantData(newVariant, vReq);
                product.getVariants().add(newVariant);
            }
        }

        log.debug("[PRODUCT] Cập nhật {} variants. id={}", variantRequests.size(), product.getId());
    }

    private void mapVariantData(ProductVariant v, VariantUpdateRequest vReq) {
        v.setSku(vReq.getSku());
        v.setColor(vReq.getColor());
        v.setSize(vReq.getSize());
        v.setOriginalPrice(vReq.getOriginalPrice());
        v.setSalePrice(vReq.getSalePrice());
        v.setMainImageUrl(vReq.getMainImageUrl());
        v.setStockQuantity(vReq.getStockQuantity());
        v.setWeightGram(vReq.getWeightGram());

        v.getVariantImages().clear();

        if (vReq.getImageUrls() != null) {
            for (int i = 0; i < vReq.getImageUrls().size(); i++) {
                ProductVariantImage img = new ProductVariantImage();
                img.setImageUrl(vReq.getImageUrls().get(i));
                img.setDisplayOrder(i + 1);
                img.setVariant(v);
                v.getVariantImages().add(img);
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

                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)

                .extraImageUrls(product.getImages().stream()
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList()))

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

        boolean hasOrders = orderItemRepository.existsByProductVariant_Product_Id(id);
        if (hasOrders) {
            product.setActive(false);
            product.getVariants().forEach(v -> v.setActive(false));
            productRepository.save(product);
            log.info("[PRODUCT] Soft delete (đã có đơn hàng). id={}", id);
            return;
        }

        cartItemRepository.deleteByProductVariant_Product_Id(id);

        productRepository.delete(product);


        log.info("[PRODUCT] Hard delete thành công. id={}", id);
    }

    public Page<ProductAdminResponse> getProductsForAdmin(
            Pageable pageable, String keyword, String categorySlug, Boolean active) {

        Specification<Product> spec = Specification.where(null);

        if (StringUtils.hasText(keyword)) {
            spec = spec.and((root, q, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")),  "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("slug")),  "%" + keyword.toLowerCase() + "%")
            ));
        }

        if (StringUtils.hasText(categorySlug)) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.get("category").get("slug"), categorySlug));
        }

        if (active != null) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.get("active"), active));
        }

        return productRepository.findAll(spec, pageable)
                .map(ProductAdminResponse::from);
    }

    public List<VariantResponse> getVariantsByProductId(Long productId) {
        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);

        return variants.stream()
                .map(VariantResponse::buildVariantResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductCardResponse> searchProducts(String q, Pageable pageable) {
        if (q == null || q.isBlank()) {
            return PageResponse.from(Page.empty(pageable));
        }
        Page<ProductCardResponse> page = productRepository
                .searchProducts(q.trim(), pageable)
                .map(this::toProductCardResponse);
        return PageResponse.from(page);
    }


    private ProductCardResponse toProductCardResponse(Product p) {
        ProductVariant cheapest = p.getVariants().stream()
                .filter(v -> v.getStockQuantity() > 0)
                .min(Comparator.comparing(v -> {
                    BigDecimal price = v.getSalePrice() != null ? v.getSalePrice() : v.getOriginalPrice();
                    return price != null ? price : BigDecimal.ZERO;
                }))
                .orElse(null);

        BigDecimal originalPrice  = cheapest != null && cheapest.getOriginalPrice() != null
                ? cheapest.getOriginalPrice() : BigDecimal.ZERO;
        BigDecimal salePrice      = cheapest != null ? cheapest.getSalePrice() : null;
        BigDecimal effectivePrice = salePrice != null ? salePrice : originalPrice;

        int discountPercent = (salePrice != null && originalPrice.compareTo(BigDecimal.ZERO) > 0)
                ? (int) Math.round(
                originalPrice.subtract(salePrice)
                .multiply(BigDecimal.valueOf(100))
                .divide(originalPrice, 2, RoundingMode.HALF_UP)
                .doubleValue()
        )
                : 0;

        return ProductCardResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .mainImageUrl(p.getMainImageUrl())
                .brandName(p.getBrand() != null ? p.getBrand().getName() : "")
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .soldCount(p.getSoldCount())
                .originalPrice(originalPrice)
                .salePrice(salePrice)
                .effectivePrice(effectivePrice)
                .discountPercent(discountPercent)
                .isOnSale(salePrice != null)
                .isNew(p.getCreatedAt() != null
                        && p.getCreatedAt().isAfter(LocalDateTime.now().minusDays(30)))
                .isBestSeller(p.getSoldCount() > 100)
                .build();
    }

    public PageResponse<ProductCardResponse> filterProducts(ProductFilterRequest filter) {

        Sort sort = buildSort(filter.getSort());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        Specification<Product> spec = Specification.where(null);

        if (StringUtils.hasText(filter.getSubCategory())) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.get("category").get("slug"), filter.getSubCategory()));
        } else if (StringUtils.hasText(filter.getCategorySlug())) {
            spec = spec.and((root, q, cb) -> {
                Subquery<Long> categorySubquery = q.subquery(Long.class);
                Root<Category> categoryRoot = categorySubquery.from(Category.class);
                categorySubquery.select(categoryRoot.get("id"))
                        .where(cb.or(
                                cb.equal(categoryRoot.get("slug"), filter.getCategorySlug()),
                                cb.equal(categoryRoot.get("parent").get("slug"), filter.getCategorySlug())
                        ));
                return root.get("category").get("id").in(categorySubquery);
            });
        }

        if (!filter.getBrands().isEmpty()) {
            spec = spec.and((root, q, cb) ->
                    root.get("brand").get("name").in(filter.getBrands()));
        }

        spec = spec.and((root, q, cb) -> {
            if (q == null) return null;

            Join<Product, ProductVariant> v = root.join("variants", JoinType.LEFT);

            Expression<BigDecimal> effectivePrice = cb.<BigDecimal>selectCase()
                    .when(cb.and(
                            cb.isNotNull(v.get("salePrice")),
                            cb.greaterThan(v.get("salePrice"), BigDecimal.ZERO),
                            cb.lessThan(v.get("salePrice"), v.get("originalPrice"))
                    ), v.get("salePrice"))
                    .otherwise(v.get("originalPrice"));

            List<Predicate> predicates = new ArrayList<>();

            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(effectivePrice, filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(effectivePrice, filter.getMaxPrice()));
            }

            if (filter.getSort() != null && filter.getSort().startsWith("effectivePrice")) {
                q.orderBy(filter.getSort().endsWith("asc")
                        ? cb.asc(effectivePrice)
                        : cb.desc(effectivePrice));
            }
            q.distinct(true);
            return predicates.isEmpty()
                    ? cb.conjunction()
                    : cb.and(predicates.toArray(new Predicate[0]));
        });

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        List<ProductCardResponse> content = productPage.getContent()
                .stream()
                .map(this::toProductCardResponse)
                .toList();
        Page<ProductCardResponse> mappedPage = new PageImpl<>(
                content,
                pageable,
                productPage.getTotalElements()
        );
        return PageResponse.from(mappedPage);
    }

    private Sort buildSort(String sortParam) {
        if (!StringUtils.hasText(sortParam)) return Sort.by("soldCount").descending();
        String[] parts = sortParam.split(",");
        String field     = parts[0].trim();
        String direction = parts.length > 1 ? parts[1].trim() : "desc";

        if (field.equals("effectivePrice")) {
            return Sort.unsorted();
        }

        String entityField = switch (field) {
            case "soldCount"  -> "soldCount";
            case "createdAt"  -> "createdAt";
            default           -> "soldCount";
        };

        return direction.equalsIgnoreCase("asc")
                ? Sort.by(entityField).ascending()
                : Sort.by(entityField).descending();
    }
} 
