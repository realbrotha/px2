package com.px2.auth;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RefreshTokenStore {

    private final Map<String, String> store = new ConcurrentHashMap<>();

    public void put(String jti, String username) {
        store.put(jti, username);
    }

    public String get(String jti) {
        return store.get(jti);
    }

    public void remove(String jti) {
        store.remove(jti);
    }

    public boolean contains(String jti) {
        return store.containsKey(jti);
    }
}
