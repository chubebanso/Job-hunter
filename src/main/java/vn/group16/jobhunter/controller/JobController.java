package vn.group16.jobhunter.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import vn.group16.jobhunter.domain.Company;
import vn.group16.jobhunter.domain.Job;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.service.CompanyService;
import vn.group16.jobhunter.service.JobService;
import vn.group16.jobhunter.util.annotation.APIMessage;
import vn.group16.jobhunter.util.error.IdInvalidException;

@Controller
@RequestMapping("/api/v1")
public class JobController {
    final private JobService jobService;
    final private CompanyService companyService;

    public JobController(JobService jobService, CompanyService companyService){
        this.jobService = jobService;
        this.companyService = companyService;
    }

    @PostMapping("/jobs/create/{company_id}")
    public ResponseEntity<?> createJob(
        @Valid @RequestBody Job job,
        @PathVariable("company_id") long company_id) throws IdInvalidException{
        Company company = this.companyService.getCompanyById(company_id);
        if (company == null) throw new IdInvalidException("Cannot find company");
        else{
            Job newJob = this.jobService.createJobWithCompany(company, job);
            return ResponseEntity.status(HttpStatus.CREATED).body(newJob);
        }
    }

    @GetMapping("/jobs/{job_id}")
    public ResponseEntity<Job> getJobById(@PathVariable("job_id") long job_id) {
        Job job = this.jobService.getJobById(job_id);
        return ResponseEntity.ok(job);
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
        return ResponseEntity.status(HttpStatus.OK).body(this.jobService.getAllJobPageResultPaginationDTO(spec, pageable));
    }

    @GetMapping("/jobs/{company_id}/all")
    @APIMessage("get all jobs from a company")
    public ResponseEntity<List<Job>> getAllJobsFromCompany(@PathVariable("company_id") long companyId){
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
}
