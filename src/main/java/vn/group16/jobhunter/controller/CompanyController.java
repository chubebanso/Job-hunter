package vn.group16.jobhunter.controller;

import java.util.List;

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

import jakarta.validation.Valid;
import vn.group16.jobhunter.domain.Company;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
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

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
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
    public ResponseEntity<Company> getCompanyByName(@PathVariable("company_name") String company_name){
        Company company = this.companyService.getCompanyByName(company_name);
        return ResponseEntity.ok(company);
    }

    @GetMapping("/companies/all")
    @APIMessage("fetch all companies without pagination")
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = this.companyService.getAllCompanies();
        for(Company company : companies){
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
}
