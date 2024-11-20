package vn.group16.jobhunter.controller;

import java.util.List;

import javax.print.DocFlavor.STRING;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.validation.Valid;
import vn.group16.jobhunter.domain.Company;
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

    @PostMapping("/create/companies")
    public ResponseEntity<?> createCompany(@Valid @RequestBody Company company) {
        Company newCompany = this.companyService.createCompany(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCompany);
    }

    @GetMapping("/companies")
    @APIMessage("fetch companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = this.companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    @PutMapping("/update/company")
    public ResponseEntity<Company> updateCompany(@RequestBody Company company) {
        return ResponseEntity.ok(this.companyService.updateCompany(company));
    }

    @DeleteMapping("/delete/company/{id}")
    public ResponseEntity<String> deleteCompany(@PathVariable("id") Long company_id) {
        this.companyService.deleteCompany(company_id);
        return ResponseEntity.ok("Delete Company Success");
    }
}
