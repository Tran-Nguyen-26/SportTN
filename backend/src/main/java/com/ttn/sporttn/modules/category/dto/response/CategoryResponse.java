package com.ttn.sporttn.modules.category.dto.response;

import com.ttn.sporttn.modules.category.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private String linkUrl;
    private Boolean active;

    public static CategoryResponse from(Category category) {
        return CategoryResponse.builder()
            .id(category.getId())
            .name(category.getName())
            .slug(category.getSlug())
            .description(category.getDescription())
            .imageUrl(category.getImageUrl())
            .linkUrl(category.getLinkUrl())
            .active(category.getActive())
            .build();
    }
}
