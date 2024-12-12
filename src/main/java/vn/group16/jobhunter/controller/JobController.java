package vn.group16.jobhunter.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import vn.group16.jobhunter.domain.Company;
import vn.group16.jobhunter.domain.Job;
import vn.group16.jobhunter.domain.Profile;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.domain.Skill;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.repository.JobRepository;
import vn.group16.jobhunter.repository.ProfileRepository;
import vn.group16.jobhunter.repository.UserRepository;
import vn.group16.jobhunter.service.CompanyService;
import vn.group16.jobhunter.service.JobService;
import vn.group16.jobhunter.service.UserService;
import vn.group16.jobhunter.util.annotation.APIMessage;
import vn.group16.jobhunter.util.error.IdInvalidException;

@Controller
@RequestMapping("/api/v1")
public class JobController {

    private final JobService jobService;
    private final CompanyService companyService;
    private final ProfileRepository profileRepository;
    private final JobRepository jobRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    public JobController(JobService jobService, CompanyService companyService,
            ProfileRepository profileRepository, JobRepository jobRepository, UserService userService,
            UserRepository userRepository) {
        this.jobService = jobService;
        this.companyService = companyService;
        this.profileRepository = profileRepository;
        this.jobRepository = jobRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // === CREATE ===
    @PostMapping("/jobs/create/{company_id}")
    public ResponseEntity<?> createJob(
            @Valid @RequestBody Job job,
            @PathVariable("company_id") long company_id) throws IdInvalidException {
        Company company = this.companyService.getCompanyById(company_id);
        if (company == null)
            throw new IdInvalidException("Cannot find company");
        else {
            Job newJob = this.jobService.createJobWithCompany(company, job);
            newJob.setStatus("active");
            return ResponseEntity.status(HttpStatus.CREATED).body(newJob);
        }
    }

    @GetMapping("/jobs/{job_id}")
    public ResponseEntity<Job> getJobById(@PathVariable("job_id") long job_id) {
        Job job = this.jobService.getJobById(job_id);
        return ResponseEntity.ok(job);
    }

    // get job's skills
    @GetMapping("/jobs/{job_id}/skills/get")
    public ResponseEntity<List<Skill>> getJobSkillList(@PathVariable("job_id") long job_id) {
        Job job = this.jobService.getJobById(job_id);
        return ResponseEntity.ok(job.getSkills());
    }

    @GetMapping("/jobs/{job_id}/applicantList")
    public ResponseEntity<Set<User>> getApplicantListJobById(@PathVariable("job_id") long job_id) {
        Job job = this.jobService.getJobById(job_id);
        return ResponseEntity.ok(job.getApplicants());
    }

    @GetMapping("/jobs/{job_id}/acceptedList")
    public ResponseEntity<Set<User>> getAcceptedListJobById(@PathVariable("job_id") long job_id) {
        Job job = this.jobService.getJobById(job_id);
        return ResponseEntity.ok(job.getAcceptedApplicants());
    }

    @GetMapping("/jobs/{job_id}/rejectedList")
    public ResponseEntity<Set<User>> getRejectedListJobById(@PathVariable("job_id") long job_id) {
        Job job = this.jobService.getJobById(job_id);
        return ResponseEntity.ok(job.getRejectedApplicants());
    }

    @GetMapping("/jobs/all")
    @APIMessage("fetch all jobs without pagination")
    public ResponseEntity<List<Job>> getAllJobs() {
        List<Job> jobs = this.jobService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/jobs/pagination")
    @APIMessage("fetch jobs with pagination")
    public ResponseEntity<ResultPaginationDTO> getAllJobsPagination(Pageable pageable,
            @Filter Specification<Job> spec) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.jobService.getAllJobPageResultPaginationDTO(spec, pageable));
    }

    @GetMapping("/jobs/{company_id}/all")
    @APIMessage("get all jobs from a company")
    public ResponseEntity<List<Job>> getAllJobsFromCompany(@PathVariable("company_id") long companyId) {
        List<Job> jobs = jobService.getJobsByCompanyId(companyId);
        return ResponseEntity.ok(jobs);
    }

    @PutMapping("/jobs/update")
    public ResponseEntity<Job> updateCompany(@RequestBody Job job) {
        return ResponseEntity.ok(this.jobService.updateJob(job));
    }

    @DeleteMapping("/jobs/delete/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable("id") Long job_id) {
        this.jobService.deleteJob(job_id);
        return ResponseEntity.ok("Delete Job Success");
    }

    // === APPLY FOR JOB ===
    @PostMapping("/{jobId}/apply")
    public ResponseEntity<?> applyForJob(@PathVariable("jobId") Long jobId, @RequestBody Map<String, Long> request) {
        Long profileId = request.get("profileId");
        if (profileId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Profile ID is missing");
        }

        // Fetch job and profile
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Add the profile's user to the job's applicants
        job.getApplicants().add(profile.getUser());
        jobRepository.save(job);

        return ResponseEntity.ok("Profile successfully applied to the job");
    }

    @PutMapping("/jobs/{jobId}/status")
    public ResponseEntity<?> updateJobStatus(
            @PathVariable("jobId") Long jobId,
            @RequestParam("userId") Long userId,
            @RequestParam("status") String status) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User user = this.userService.getUserById(userId);
        if ("accepted".equalsIgnoreCase(status)) {
            job.getAcceptedApplicants().add(user);
            job.getApplicants().remove(user);
            user.getAcceptedJobs().add(job);
            user.getRejectedJobs().remove(job);
        } else if ("rejected".equalsIgnoreCase(status)) {
            job.getRejectedApplicants().add(user);
            job.getApplicants().remove(user);
            user.getRejectedJobs().add(job);
            user.getAcceptedJobs().remove(job);
        } else {
            return ResponseEntity.badRequest().body("Invalid status");
        }

        job.setStatus(status);
        jobRepository.save(job);
        userRepository.save(user);

        return ResponseEntity.ok("Job status updated successfully");
    }

}
