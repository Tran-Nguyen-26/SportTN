package com.ttn.sporttn.modules.product.dto.response;

import com.ttn.sporttn.modules.product.entity.ProductImage;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageResponse {
    private Long id;
    private String imageUrl;
    private Boolean isMain;

    public static ImageResponse buildImageResponse(ProductImage image) {
        ImageResponse response = new ImageResponse();
        response.setId(image.getId());
        response.setImageUrl(image.getImageUrl());
        response.setIsMain(image.isMain());
        return response;
    }
}
