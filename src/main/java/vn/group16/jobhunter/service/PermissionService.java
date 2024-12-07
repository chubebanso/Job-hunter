package vn.group16.jobhunter.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Permission;
import vn.group16.jobhunter.repository.PermissionRepository;

@Service
public class PermissionService {
    final private PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public Permission createPermission(Permission permission) {
        if (permission != null) {
            return this.permissionRepository.save(permission);
        }
        return null;
    }

    public Permission updatePermission(Permission permission) {
        Optional<Permission> optionalPermission = this.permissionRepository.findById(permission.getId());
        if (optionalPermission.isPresent()) {
            Permission newPermission = optionalPermission.get();
            newPermission.setName(permission.getName());
            newPermission.setApiPath(permission.getApiPath());
            newPermission.setMethod(permission.getMethod());
            newPermission.setModule(permission.getModule());
            this.permissionRepository.save(newPermission);
            return newPermission;
        }
        return null;
    }

    public boolean isPermisisonService(Permission permission) {
        return this.permissionRepository.existsByModuleAndApiPathAndMethod(
                permission.getModule(),
                permission.getApiPath(),
                permission.getMethod());
    }

    public void delete(Long id) {
        Optional<Permission> optionalPermission = this.permissionRepository.findById(id);
        if (optionalPermission.isPresent()) {
            Permission currentPermission = optionalPermission.get();
            currentPermission.getRoles().forEach(role -> role.getPermissions().remove(currentPermission));
            this.permissionRepository.delete(currentPermission);
        }
    }
}
