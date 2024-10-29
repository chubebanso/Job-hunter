package vn.group16.jobhunter.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Company;
import vn.group16.jobhunter.repository.CompanyRepository;

@Service
public class CompanyService {
    final private CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company createCompany(Company company) {
        return this.companyRepository.save(company);

    }

    public List<Company> getAllCompanies() {
        return this.companyRepository.findAll();
    }

    public Company updateCompany(Company company) {
        Optional<Company> updateCompany = this.companyRepository.findById(company.getId());
        if (updateCompany.isPresent()) {
            Company currentCompany = updateCompany.get();
            currentCompany.setDescription(company.getDescription());
            currentCompany.setAddress(company.getAddress());
            currentCompany.setName(currentCompany.getName());
            currentCompany.setLogo(currentCompany.getLogo());
            return this.companyRepository.save(currentCompany);
        }
        return null;
    }

    public void deleteCompany(Long company_id) {
        this.companyRepository.deleteById(company_id);
    }
}
