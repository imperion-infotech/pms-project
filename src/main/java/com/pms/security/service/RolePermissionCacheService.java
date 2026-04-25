/**
 * 
 */
package com.pms.security.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.pms.security.entity.Role;
import com.pms.security.repository.PermissionRepository;
import com.pms.security.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

/**
 * 
 */
@Service
@RequiredArgsConstructor
public class RolePermissionCacheService {

	@Autowired
    private RoleRepository roleRepository;
	@Autowired
	private PermissionRepository permissionRepository;

    private final Map<Long, List<GrantedAuthority>> rolePermissionCache = new ConcurrentHashMap<>();

    public List<GrantedAuthority> getAuthoritiesByRoleIds(List<Long> roleIds) {

        if (roleIds == null || roleIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<GrantedAuthority> authorities = new ArrayList<>();

        for (Long roleId : roleIds) {

            List<GrantedAuthority> cachedAuthorities =
                    rolePermissionCache.computeIfAbsent(roleId, this::loadAuthoritiesFromDb);

            authorities.addAll(cachedAuthorities);
        }

        return authorities;
    }
    
    public Collection<? extends GrantedAuthority> getAllAuthorities() {
        return permissionRepository.findAll()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                .collect(Collectors.toSet());
    }

    private List<GrantedAuthority> loadAuthoritiesFromDb(Long roleId) {

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Set<String> permissions = new HashSet<>();

        permissions.add(role.getName());

        role.getPermissions().forEach(permission ->
                permissions.add(permission.getName())
        );

        return permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    public void evictRole(Long roleId) {
        rolePermissionCache.remove(roleId);
    }

    public void clearAll() {
        rolePermissionCache.clear();
    }
}
