package vn.group16.jobhunter.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Skill;
import vn.group16.jobhunter.repository.SkillRepository;

@Service
public class SkillService {
    final private SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public Skill getSkillById(long id){
        Optional<Skill> tempSkill = this.skillRepository.findById(id);
        if(tempSkill.isPresent())
            return tempSkill.get();
        return null;
    }

    public List<Skill> getAllSkill() {
        return this.skillRepository.findAll();
    }
}
