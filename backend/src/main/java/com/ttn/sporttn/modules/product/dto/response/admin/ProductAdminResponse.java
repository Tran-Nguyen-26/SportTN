package com.ttn.sporttn.modules.product.dto.response.admin;


//trang product
public interface ProductAdminResponse {
    Long getId();
    String getName();
    String getCategoryName();
    String getBrandName();
    Double getMinPrice();
    Integer getTotalStock();
    Integer getSoldCount();
    Double getRating();
    String getActive();
    String getMainImageUrl();
}
