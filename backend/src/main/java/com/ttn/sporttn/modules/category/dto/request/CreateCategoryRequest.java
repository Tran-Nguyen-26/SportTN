package com.ttn.sporttn.modules.category.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryRequest {

    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(min = 3, max = 100, message = "Tên danh mục phải từ 3-100 ký tự")
    private String name;

    @Size(max = 500, message = "Mô tả không quá 500 ký tự")
    private String description;

    private String imageUrl;
}
