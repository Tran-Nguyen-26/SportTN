package com.ttn.sporttn.modules.user.service;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpStore {

    private record OtpEntry(String otp, LocalDateTime expiresAt) {}

    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    public void save(String email, String otp, int expiryMinutes) {
        store.put(email, new OtpEntry(otp, LocalDateTime.now().plusMinutes(expiryMinutes)));
    }

    public boolean verify(String email, String otp) {
        OtpEntry entry = store.get(email);
        if (entry == null) return false;
        if (LocalDateTime.now().isAfter(entry.expiresAt())) {
            store.remove(email);
            return false;
        }
        return entry.otp().equals(otp);
    }

    public void remove(String email) {
        store.remove(email);
    }
}