package com.ttn.sporttn.modules.user.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.user.dto.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SocialAuthService {

    private final UserService userService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.google.client-id}")
    private String googleClientId;

    @Value("${app.facebook.app-id}")
    private String fbAppId;

    public AuthResponse loginGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .setAcceptableTimeSkewSeconds(600)
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");

                return userService.processSocialLogin(email, name, pictureUrl, "GOOGLE");
            } else {
                throw new BusinessException(ErrorCode.UNAUTHORIZED);
            }
        } catch (Exception e) {
            log.error("Lỗi Exception: ", e);
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

    }

    public AuthResponse loginFacebook(String accessToken) {
        try {
            String fbUrl = String.format("https://graph.facebook.com/me?fields=id,name,email,picture&access_token=%s", accessToken);
            Map<String, Object> response = restTemplate.getForObject(fbUrl, Map.class);

            if (response != null) {
                String email = (String) response.get("email");
                if (email == null || email.isEmpty()) {
                    String fbId = response.get("id").toString();
                    email = fbId + "@facebook.com";
                }

                String name = (String) response.get("name");

                String pictureUrl = "";
                if (response.containsKey("picture")) {
                    Map<String, Object> picture = (Map<String, Object>) response.get("picture");
                    Map<String, Object> data = (Map<String, Object>) picture.get("data");
                    pictureUrl = (String) data.get("url");
                }
                return userService.processSocialLogin(email, name, pictureUrl, "FACEBOOK");
            }
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        } catch (Exception e) {
            log.error("Lỗi xác thực Facebook: ", e);
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
    }
}
