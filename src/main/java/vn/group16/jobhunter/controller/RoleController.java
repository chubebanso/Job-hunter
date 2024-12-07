package vn.group16.jobhunter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.group16.jobhunter.domain.Role;
import vn.group16.jobhunter.service.RoleService;
import vn.group16.jobhunter.util.error.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
public class RoleController {
    final private RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/create/role")
    public ResponseEntity<Role> createRole(@Valid @RequestBody Role role) throws IdInvalidException {
        if (this.roleService.existsByName(role)) {
            throw new IdInvalidException("Role nay da ton tai ");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.roleService.createRole(role));
    }
    // @GetMapping("/get-role-with-permission")
}
