package com.ttn.sporttn.modules.category.dto.response;

public interface CategoryAdminResponse {
    Long getCategoryId();
    String getName();
    String getSlug();
    String getSectionTitle();
    Long getParentId();
    String getParentName();
    Long getProductCount();
    Integer getDisplayOrder();
    boolean getShowOnHome();
    boolean getActive();
}
