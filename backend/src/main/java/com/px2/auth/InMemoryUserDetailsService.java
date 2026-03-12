package com.px2.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryUserDetailsService implements UserDetailsService {

    private final Map<String, UserDetails> users = new ConcurrentHashMap<>();

    public InMemoryUserDetailsService(UserDetails... users) {
        for (UserDetails u : users) {
            this.users.put(u.getUsername(), u);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetails user = users.get(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        return user;
    }
}
