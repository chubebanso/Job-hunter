package vn.group16.jobhunter.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Skill;
import vn.group16.jobhunter.repository.SkillRepository;

@Service
public class SkillService {
    final private SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> getAllSkill() {
        return this.skillRepository.findAll();
    }
}
