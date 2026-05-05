package com.ttn.sporttn.modules.product.dto.request.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.util.List;

@Getter
public class ProductCreateRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String slug;

    private String description;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    @NotNull(message = "Thương hiệu không được để trống")
    private Long brandId;

    private Boolean active = true;

    private String mainImageUrl;

    @NotNull(message = "Sản phẩm phải có ít nhất một biến thể")
    @Size(min = 1, message = "Sản phẩm phải có ít nhất một biến thể")
    @Valid
    private List<ProductVariantRequest> variants;
}

