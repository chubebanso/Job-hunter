package vn.group16.jobhunter.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Permission;
import vn.group16.jobhunter.domain.Role;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.repository.PermissionRepository;
import vn.group16.jobhunter.repository.RoleRepository;

@Service
public class RoleService {
    final private RoleRepository roleRepository;
    final private PermissionRepository permissionRepository;

    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public Role createRole(Role role) {
        if (role.getPermissions() != null) {
            List<Long> rolePermission = role.getPermissions().stream()
                    .map(Permission::getId)
                    .collect(Collectors.toList());

            // Dùng findByIdIn để tìm các Permission từ danh sách rolePermission
            List<Permission> dbPermissions = this.permissionRepository.findByIdIn(rolePermission);
            role.setPermissions(dbPermissions);
        }
        return this.roleRepository.save(role);
    }
}
