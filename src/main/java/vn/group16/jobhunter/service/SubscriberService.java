package vn.group16.jobhunter.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Permission;
import vn.group16.jobhunter.domain.Skill;
import vn.group16.jobhunter.domain.Subscriber;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.repository.SkillRepository;
import vn.group16.jobhunter.repository.SubscriberRepository;

@Service
public class SubscriberService {
    final private SubscriberRepository subscriberRepository;
    final private SkillRepository skillRepository;

    public SubscriberService(SubscriberRepository subscriberRepository, SkillRepository skillRepository) {
        this.subscriberRepository = subscriberRepository;
        this.skillRepository = skillRepository;
    }

    public Subscriber creatSubscriber(Subscriber subscriber) {
        if (subscriber.getSkills() != null) {
            List<Long> skillId = subscriber.getSkills().stream()
                    .map(Skill::getId)
                    .collect(Collectors.toList());

            // Dùng findByIdIn để tìm các Permission từ danh sách rolePermission
            List<Skill> skills = this.skillRepository.findByIdIn(skillId);
            subscriber.setSkills(skills);
            ;
        }
        return this.subscriberRepository.save(subscriber);
    }

    public Subscriber getSubscriberByEmail(String email) {
        return this.subscriberRepository.findByEmail(email);
    }
}
