package vn.group16.jobhunter.domain;

import java.time.Instant;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import vn.group16.jobhunter.constant.GenderEnum;

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String email;
    private String password;
    private GenderEnum gender; // xóa trường này và age đi, hoặc vứt sang profile
    private Instant createdAt;
    private Instant updateAt;
    private long age;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    @JsonProperty("role")
    @JsonIgnore
    private Role role;

    @OneToOne(mappedBy = "user", fetch = FetchType.EAGER)
    @JsonIgnore
    private Profile profile;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_jobs", // Define a join table to map the relationship
            joinColumns = @JoinColumn(name = "user_id"), // User's foreign key
            inverseJoinColumns = @JoinColumn(name = "job_id") // Job's foreign key
    )
    @JsonIgnore
    private Set<Job> jobs;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    private Company company;

    //////////////////////////////////////////////// 2024/12/11

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_acceptedJobs", // Define a join table to map the relationship
            joinColumns = @JoinColumn(name = "user_id"), // User's foreign key
            inverseJoinColumns = @JoinColumn(name = "job_id") // Job's foreign key
    )
    @JsonIgnore
    private Set<Job> acceptedJobs;

    public Set<Job> getAcceptedJobs() {
        return acceptedJobs;
    }

    public void setAcceptedJobs(Set<Job> acceptedJobs) {
        this.acceptedJobs = acceptedJobs;
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_rejectedJobs", // Define a join table to map the relationship
            joinColumns = @JoinColumn(name = "user_id"), // User's foreign key
            inverseJoinColumns = @JoinColumn(name = "job_id") // Job's foreign key
    )
    @JsonIgnore
    private Set<Job> rejectedJobs;

    public Set<Job> getRejectedJobs() {
        return rejectedJobs;
    }

    public void setRejectedJobs(Set<Job> rejectedJobs) {
        this.rejectedJobs = rejectedJobs;
    }

    ////////////////////////////////////////////////

    @Enumerated(EnumType.STRING)

    public GenderEnum getGender() {
        return gender;
    }

    public void setGender(GenderEnum gender) {
        this.gender = gender;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(Instant updateAt) {
        this.updateAt = updateAt;
    }

    public long getAge() {
        return age;
    }

    public void setAge(long age) {
        this.age = age;
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public Set<Job> getJobs() {
        return jobs;
    }

    public void setJob(Set<Job> job) {
        this.jobs = job;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}
