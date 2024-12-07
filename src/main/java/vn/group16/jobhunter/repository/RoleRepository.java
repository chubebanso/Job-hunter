package vn.group16.jobhunter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.group16.jobhunter.domain.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
}
