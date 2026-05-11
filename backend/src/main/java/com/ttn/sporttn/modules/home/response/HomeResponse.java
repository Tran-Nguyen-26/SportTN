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
public class HomeResponse {
    private List<BannerResponse> heroBanners;
    private List<ProductCardResponse> mostSearched;
    private List<CategoryResponse> sportsPopular;
    private List<CategoryResponse> categories;
    private List<ProductCardResponse> bestSellers;
    private List<ProductCardResponse> cheapQuality;

    private List<CategorySectionResponse> categorySections;
}
