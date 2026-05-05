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
    private String sectionTitle;
    private String linkUrl;
    private String parentName;
    private Integer displayOrder;
    private Boolean showOnHome;
    private Boolean active;

    public static CategoryResponse from(Category category) {
        return CategoryResponse.builder()
            .id(category.getId())
            .name(category.getName())
            .slug(category.getSlug())
            .sectionTitle(category.getSectionTitle())
            .parentName(category.getParent() != null ? category.getParent().getName() : null)
            .showOnHome(category.isShowOnHome())
            .displayOrder(category.getDisplayOrder())
            .description(category.getDescription())
            .imageUrl(category.getImageUrl())
            .linkUrl(category.getLinkUrl())
            .active(category.getActive())
            .build();
    }
}
