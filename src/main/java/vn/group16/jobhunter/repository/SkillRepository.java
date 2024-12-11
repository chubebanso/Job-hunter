package vn.group16.jobhunter.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.group16.jobhunter.domain.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByIdIn(List<Long> id);

}
