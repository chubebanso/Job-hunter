package vn.group16.jobhunter.controller;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import javax.print.DocFlavor.STRING;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.turkraft.springfilter.boot.Filter;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.dto.ApplicantDTO;
import jakarta.validation.Valid;
import vn.group16.jobhunter.domain.Company;
import vn.group16.jobhunter.domain.Job;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.repository.CompanyRepository;
import vn.group16.jobhunter.service.CompanyService;
import vn.group16.jobhunter.util.annotation.APIMessage;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequestMapping("/api/v1")
public class CompanyController {
    final private CompanyService companyService;
    final private CompanyRepository companyRepository;

    public CompanyController(CompanyService companyService, CompanyRepository companyRepository) {
        this.companyService = companyService;
        this.companyRepository = companyRepository;
    }

    @PostMapping("/companies/create")
    public ResponseEntity<?> createCompany(@Valid @RequestBody Company company) {
        Company newCompany = this.companyService.createCompany(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCompany);
    }

    @GetMapping("/companies/{company_id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable("company_id") long company_id) {
        Company company = this.companyService.getCompanyById(company_id);

        return ResponseEntity.ok(company);
    }

    @GetMapping("/companies/name/{company_name}")
    public ResponseEntity<Company> getCompanyByName(@PathVariable("company_name") String company_name) {
        Company company = this.companyService.getCompanyByName(company_name);
        return ResponseEntity.ok(company);
    }

    @GetMapping("/companies/all")
    @APIMessage("fetch all companies without pagination")
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = this.companyService.getAllCompanies();
        for (Company company : companies) {
            company.setJobCnt(company.getJobs().size());
        }
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/companies/pagination")
    @APIMessage("fetch companies with pagination")
    public ResponseEntity<ResultPaginationDTO> getAllCompaniesPagination(Pageable pageable,
            @Filter Specification<Company> spec) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.companyService.getAllCompaniesPageResultPaginationDTO(spec, pageable));
    }

    @PutMapping("/companies/update")
    public ResponseEntity<Company> updateCompany(@Valid @RequestBody Company company) {
        return ResponseEntity.ok(this.companyService.updateCompany(company));
    }

    @DeleteMapping("/companies/delete/{company_id}")
    public ResponseEntity<String> deleteCompany(@PathVariable("company_id") Long company_id) {
        this.companyService.deleteCompany(company_id);
        return ResponseEntity.ok("Delete Company Success");
    }

    @GetMapping("/{companyId}/profiles")
    public ResponseEntity<?> getAllProfilesForCompanyJobs(@PathVariable("companyId") Long companyId) {
        // Lấy thông tin công ty
        Company company = companyService.getCompanyById(companyId);
        Set<ApplicantDTO> applicantDTOs = new HashSet<>();
        // Lấy danh sách công việc của công ty
        List<Job> jobs = company.getJobs();

        for (Job job : jobs) {
            for (User applicant : job.getApplicants()) {
                applicantDTOs.add(new ApplicantDTO(
                        applicant.getId(),
                        job.getId(),
                        applicant.getName(),
                        applicant.getEmail()));
            }
        }

        return ResponseEntity.ok(applicantDTOs);
    }

}
