package com.ttn.sporttn.modules.home.response;

import com.ttn.sporttn.modules.category.dto.response.CategoryResponse;
import com.ttn.sporttn.modules.cms.dto.response.BannerResponse;
import com.ttn.sporttn.modules.product.dto.response.ProductCardResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategorySectionResponse {
    private Long categoryId;
    private String title;
    private String categorySlug;
    
    private List<BannerResponse> banners;
    private List<CategoryResponse> subCategories;
    private List<ProductCardResponse> products;
}
