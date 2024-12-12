package vn.group16.jobhunter.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Company;
import vn.group16.jobhunter.domain.Job;
import vn.group16.jobhunter.domain.Meta;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.repository.JobRepository;

@Service
public class JobService {
    final private JobRepository jobRepository;

    public JobService(JobRepository jobRepository){
        this.jobRepository = jobRepository;
    }

    public Job createJob(Job job) {
        return this.jobRepository.save(job);
    }

    public Job createJobWithCompany(Company company, Job job) {
        job.setCompany(company);
        return this.jobRepository.save(job);
    }
    
    public Job getJobById(long id) {
        Optional<Job> jobOptional = this.jobRepository.findById(id);
        if (jobOptional.isPresent()) {
            return jobOptional.get();
        }
        return null;
    }

    public List<Job> getAllJobs() {
        return this.jobRepository.findAll();
    }

    public List<Job> getJobsByCompanyId(long companyId) {
        return jobRepository.findByCompanyId(companyId);  // Fetch jobs from the repository
    }

    public ResultPaginationDTO getAllJobPageResultPaginationDTO(Specification<Job> spec, Pageable pageable) {
        Page<Job> pageJob = this.jobRepository.findAll(pageable);
        ResultPaginationDTO res = new ResultPaginationDTO();
        Meta mt = new Meta();
        mt.setPage(pageJob.getNumber() + 1);
        mt.setPageSize(pageJob.getSize());
        mt.setPages(pageJob.getTotalPages());
        mt.setTotal(pageJob.getTotalElements());
        res.setMeta(mt);
        res.setResult(pageJob.getContent());
        return res;
    }

    public Job updateJob(Job job) {
        Optional<Job> updateJob = this.jobRepository.findById(job.getId());
        if (updateJob.isPresent()) {
            Job currentJob = updateJob.get();
            currentJob.setName(currentJob.getName());
            currentJob.setDescription(job.getDescription());
            currentJob.setSalary(job.getSalary());
            currentJob.setLocation(job.getLocation());
            currentJob.setJobType(job.getJobType());
            currentJob.setExperience(job.getExperience());
            currentJob.setPosition(job.getPosition());
            if(currentJob.getPosition()==0) currentJob.setStatus("inactive");
                else currentJob.setStatus("active");
            return this.jobRepository.save(currentJob);
        }
        return null;
    }

    public void deleteJob(Long job_id) {
        this.jobRepository.deleteById(job_id);
    }
}
