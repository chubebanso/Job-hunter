package vn.group16.jobhunter.dto;

public class ApplicantDTO {
    private Long userId;
    private Long jobId;
    private String name;
    private String email;

    // Thêm các thuộc tính cần thiết từ User và Job nếu cần
    // Constructor, Getters, and Setters
    public ApplicantDTO(Long userId, Long jobId, String name, String email) {
        this.userId = userId;
        this.jobId = jobId;
        this.name = name;
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
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
}
