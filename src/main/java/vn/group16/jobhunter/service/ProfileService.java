package vn.group16.jobhunter.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Meta;
import vn.group16.jobhunter.domain.Profile;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.domain.Skill;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.repository.ProfileRepository;
import vn.group16.jobhunter.repository.SkillRepository;

@Service
public class ProfileService {
    final private ProfileRepository profileRepository;
    final private SkillRepository skillRepository;

    public ProfileService(
            ProfileRepository profileRepository, SkillRepository skillRepository) {
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
    }

    public Profile createProfile(Profile profile, User user) {
        profile.setUser(user);
        if (profile.getSkills() != null) {
            List<Long> skillId = profile.getSkills().stream()
                    .map(Skill::getId)
                    .collect(Collectors.toList());
            // Dùng findByIdIn để tìm các Permission từ danh sách rolePermission
            List<Skill> skills = this.skillRepository.findByIdIn(skillId);
            profile.setSkills(skills);
        }
        return this.profileRepository.save(profile);
    }

    public Profile getProfileById(long id) {
        Optional<Profile> profileOptional = this.profileRepository.findById(id);
        if (profileOptional.isPresent()) {
            return profileOptional.get();
        }
        return null;
    }

    public List<Profile> getAllProfiles() {
        return this.profileRepository.findAll();
    }

    public ResultPaginationDTO getAllProfilesPageResultPaginationDTO(Specification<Profile> spec, Pageable pageable) {
        Page<Profile> pageProfile = this.profileRepository.findAll(pageable);
        ResultPaginationDTO res = new ResultPaginationDTO();
        Meta mt = new Meta();
        mt.setPage(pageProfile.getNumber() + 1);
        mt.setPageSize(pageProfile.getSize());
        mt.setPages(pageProfile.getTotalPages());
        mt.setTotal(pageProfile.getTotalElements());
        res.setMeta(mt);
        res.setResult(pageProfile.getContent());
        return res;
    }

    public Profile updateProfile(Profile profile) {
        Optional<Profile> updateProfile = this.profileRepository.findById(profile.getId());
        if (updateProfile.isPresent()) {
            Profile currentProfile = updateProfile.get();
            currentProfile.setBio(profile.getBio());
            currentProfile.setPhoneNumber(profile.getPhoneNumber());
            currentProfile.setSkills(profile.getSkills());
            currentProfile.setProfilePictureUrl(profile.getProfilePictureUrl());
            currentProfile.setDateOfBirth(profile.getDateOfBirth());

            currentProfile.setUser(profile.getUser());

            return this.profileRepository.save(currentProfile);
        }
        return null;
    }

    public void deleteProfile(Long profile_id) {
        this.profileRepository.deleteById(profile_id);
    }

    public Profile addSkillToProfile(Profile profile, Skill skill) {
        profile.getSkills().add(skill);
        skill.getProfile().add(profile);
        return this.profileRepository.save(profile);
    }

    public Profile removeSkillToProfile(Profile profile, Skill skill) {
        profile.getSkills().remove(skill);
        skill.getProfile().remove(profile);
        return this.profileRepository.save(profile);
    }
}
