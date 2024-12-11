package vn.group16.jobhunter.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.group16.jobhunter.domain.Job;
import vn.group16.jobhunter.domain.Skill;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    Job findByCompanyName(String companyName);

    List<Job> findByCompanyId(long companyId);

    List<Job> findBySkillsIn(List<Skill> skills);
}
