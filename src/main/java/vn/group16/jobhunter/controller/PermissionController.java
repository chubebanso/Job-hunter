package vn.group16.jobhunter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.group16.jobhunter.domain.Permission;
import vn.group16.jobhunter.service.PermissionService;
import vn.group16.jobhunter.util.error.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
public class PermissionController {
    final private PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @PostMapping("/create/permission")
    public ResponseEntity<Permission> createController(@Valid @RequestBody Permission pemission)
            throws IdInvalidException {
        if (this.permissionService.isPermisisonService(pemission)) {
            throw new IdInvalidException("Permission da ton tai");
        }
        Permission newPermission = this.permissionService.createPermission(pemission);
        return ResponseEntity.status(HttpStatus.CREATED).body(newPermission);
    }

    @PutMapping("/update/permission")
    public ResponseEntity<Permission> updateController(@Valid @RequestBody Permission permission) {
        return ResponseEntity.ok(this.permissionService.updatePermission(permission));
    }

    @DeleteMapping("/delete/permission/{id}")
    public ResponseEntity<String> deletePermission(@PathVariable("id") long id) {
        this.permissionService.delete(id);
        return ResponseEntity.ok("Xoa thanh cong permission");
    }
}
