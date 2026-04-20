package com.ttn.sporttn.modules.product.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.ttn.sporttn.modules.product.dto.response.*;
import com.ttn.sporttn.modules.product.mapper.ProductMapper;
import com.ttn.sporttn.modules.product.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.category.entity.Category;
import com.ttn.sporttn.modules.category.repository.CategoryRepository;
import com.ttn.sporttn.modules.product.dto.request.ImageRequest;
import com.ttn.sporttn.modules.product.dto.request.ProductRequest;
import com.ttn.sporttn.modules.product.dto.request.VariantRequest;
import com.ttn.sporttn.modules.product.entity.Brand;
import com.ttn.sporttn.modules.product.entity.Product;
import com.ttn.sporttn.modules.product.entity.ProductImage;
import com.ttn.sporttn.modules.product.entity.ProductVariant;
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

    @Transactional
    public ProductDetailResponse updateProduct(Long id, ProductRequest productRequest) {
        log.info("[PRODUCT] Cập nhật sản phẩm. id={}, name={}", id, productRequest.getName());
        
        // Validate input
        if (productRequest == null || productRequest.getName() == null || productRequest.getName().isEmpty()) {
            log.warn("[PRODUCT] Tên sản phẩm không hợp lệ");
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        // Find product
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("[PRODUCT] Sản phẩm không tìm thấy. id={}", id);
                    return new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
                });

        // Update basic info
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());

        // Update category
        if (productRequest.getCategoryId() != null) {
            Category category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> {
                        log.warn("[PRODUCT] Danh mục không tìm thấy. categoryId={}", productRequest.getCategoryId());
                        return new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
                    });
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        // Update brand
        if (productRequest.getBrandId() != null) {
            Brand brand = brandRepository.findById(productRequest.getBrandId())
                    .orElseThrow(() -> {
                        log.warn("[PRODUCT] Thương hiệu không tìm thấy. brandId={}", productRequest.getBrandId());
                        return new BusinessException(ErrorCode.BRAND_NOT_FOUND);
                    });
            product.setBrand(brand);
        } else {
            product.setBrand(null);
        }

        // Update images
        if (productRequest.getImages() != null) {
            product.getImages().clear();
            for (ImageRequest imageRequest : productRequest.getImages()) {
                ProductImage image = new ProductImage();
                image.setImageUrl(imageRequest.getImageUrl());
                image.setMain(imageRequest.isMain());
                image.setProduct(product);
                product.getImages().add(image);
            }
            log.debug("[PRODUCT] Cập nhật {} ảnh cho sản phẩm. id={}", productRequest.getImages().size(), id);
        }

        // Update variants
        if (productRequest.getVariants() != null) {
            product.getVariants().clear();
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
            log.debug("[PRODUCT] Cập nhật {} biến thể cho sản phẩm. id={}", productRequest.getVariants().size(), id);
        }

        // Save updated product
        Product updatedProduct = productRepository.save(product);
        log.info("[PRODUCT] Cập nhật sản phẩm thành công. id={}, name={}", updatedProduct.getId(), updatedProduct.getName());

        return buildProductDetailResponse(updatedProduct);
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
} 
