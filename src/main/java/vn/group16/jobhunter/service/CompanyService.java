package vn.group16.jobhunter.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Company;
import vn.group16.jobhunter.domain.Meta;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.repository.CompanyRepository;

@Service
public class CompanyService {
    final private CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company createCompany(Company company) {
        Company newCompany = new Company();
        newCompany.setName(company.getName());
        newCompany.setAddress(company.getAddress());
        newCompany.setLogo(company.getLogo());
        newCompany.setWebsite(company.getWebsite());
        return this.companyRepository.save(company);

    }

    public Company getCompanyById(long id) {
        Optional<Company> companyOptional = this.companyRepository.findById(id);
        if (companyOptional.isPresent()) {
            return companyOptional.get();
        }
        return null;
    }

    public Company getCompanyByName(String name) {
        Company companyOptional = this.companyRepository.findByName(name);
        return companyOptional;
    }

    public List<Company> getAllCompanies() {
        return this.companyRepository.findAll();
    }

    public ResultPaginationDTO getAllCompaniesPageResultPaginationDTO(Specification<Company> spec, Pageable pageable) {
        Page<Company> pageCompany = this.companyRepository.findAll(pageable);
        ResultPaginationDTO res = new ResultPaginationDTO();
        Meta mt = new Meta();
        mt.setPage(pageCompany.getNumber() + 1);
        mt.setPageSize(pageCompany.getSize());
        mt.setPages(pageCompany.getTotalPages());
        mt.setTotal(pageCompany.getTotalElements());
        res.setMeta(mt);
        res.setResult(pageCompany.getContent());
        return res;
    }

    public Company updateCompany(Company company) {
        Optional<Company> updateCompany = this.companyRepository.findById(company.getId());
        if (updateCompany.isPresent()) {
            Company currentCompany = updateCompany.get();
            currentCompany.setName(currentCompany.getName());
            currentCompany.setDescription(company.getDescription());
            currentCompany.setWebsite(company.getWebsite());
            currentCompany.setAddress(company.getAddress());
            currentCompany.setLogo(currentCompany.getLogo());
            return this.companyRepository.save(currentCompany);
        }
        return null;
    }

    public void deleteCompany(Long company_id) {
        this.companyRepository.deleteById(company_id);
    }
}
