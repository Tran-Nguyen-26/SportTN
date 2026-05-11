package com.ttn.sporttn.modules.user.dto.request.admin;

import lombok.Data;

@Data
public class UpdateCustomerRequest {
    private String fullName;
    private String phone;
    private String address;
    private String gender;
    private String birthday;
    private String note;
    private String status;
}
