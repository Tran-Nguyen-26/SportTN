package com.ttn.sporttn.security;

import org.springframework.security.core.Authentication;

public class AuthUtils {
    public static Long getCurrentUserId(Authentication auth) {
        return Long.parseLong(auth.getName());
    }
}
