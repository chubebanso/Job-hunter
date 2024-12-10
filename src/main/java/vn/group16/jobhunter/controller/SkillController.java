package vn.group16.jobhunter.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.group16.jobhunter.domain.Skill;
import vn.group16.jobhunter.service.SkillService;

@RestController
@RequestMapping("/api/v1")
public class SkillController {
    final private SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/all/skills")
    public ResponseEntity<List<Skill>> getAllSkill() {
        return ResponseEntity.ok(this.skillService.getAllSkill());
    }
}
