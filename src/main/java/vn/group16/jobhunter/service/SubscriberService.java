package vn.group16.jobhunter.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Job;
import vn.group16.jobhunter.domain.Permission;
import vn.group16.jobhunter.domain.Skill;
import vn.group16.jobhunter.domain.Subscriber;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.repository.JobRepository;
import vn.group16.jobhunter.repository.SkillRepository;
import vn.group16.jobhunter.repository.SubscriberRepository;

@Service
public class SubscriberService {
    final private SubscriberRepository subscriberRepository;
    final private SkillRepository skillRepository;
    final private JobRepository jobRepository;
    final private EmailService emailService;

    public SubscriberService(SubscriberRepository subscriberRepository, SkillRepository skillRepository,
            JobRepository jobRepository, EmailService emailService) {
        this.subscriberRepository = subscriberRepository;
        this.skillRepository = skillRepository;
        this.jobRepository = jobRepository;
        this.emailService = emailService;
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

    public void sendSubscribersEmailJobs() {
        List<Subscriber> listSubs = this.subscriberRepository.findAll();
        if (listSubs != null && listSubs.size() > 0) {
            for (Subscriber sub : listSubs) {
                List<Skill> listSkills = sub.getSkills();
                if (listSkills != null && listSkills.size() > 0) {
                    List<Job> listJobs = this.jobRepository.findBySkillsIn(listSkills);
                    if (listJobs != null && listJobs.size() > 0) {

                        // List<ResEmailJob> arr = listJobs.stream().map(
                        // job -> this.convertJobToSendEmail(job)).collect(Collectors.toList());

                        this.emailService.sendEmailFromTemplateSync(
                                sub.getEmail(),
                                "Cơ hội việc làm hot đang chờ đón bạn, khám phá ngay",
                                "job",
                                sub.getName(),
                                listJobs);
                    }
                }
            }
        }
    }

}
