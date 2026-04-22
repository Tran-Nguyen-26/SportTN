package com.ttn.sporttn.modules.category.dto.response;

public interface CategoryAdminResponse {
    Long getCategoryId();
    String getName();
    String getSlug();
    String getParent();
    Long getProductCount();
    Integer getDisplayOrder();
    boolean getShowOnHome();
    boolean getActive();
}
