package vn.group16.jobhunter.controller;

import java.util.List;

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
import vn.group16.jobhunter.domain.Profile;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.service.ProfileService;
import vn.group16.jobhunter.service.UserService;
import vn.group16.jobhunter.util.annotation.APIMessage;
import vn.group16.jobhunter.util.error.IdInvalidException;

@Controller
@RequestMapping("/api/v1")
public class ProfileController {
    final private ProfileService profileService;
    final private UserService userService;

    public ProfileController(ProfileService profileService, UserService userService){
        this.profileService = profileService;
        this.userService = userService;
    }

    @PostMapping("/create/{user_id}/profile")
    public ResponseEntity<?> createProfile(
        @Valid @RequestBody Profile profile,
        @PathVariable("user_id") long user_id) throws IdInvalidException{
        User findUser = this.userService.getUserById(user_id);
        if (findUser == null) throw new IdInvalidException("Cannot find user.");
        else{
            Profile newProfile = this.profileService.createProfile(profile, findUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(newProfile);
        }
    }

    @GetMapping("/profiles/profileID/{profile_id}")
    public ResponseEntity<Profile> getProfileById(@PathVariable("profile_id") long profile_id) {
        Profile profile = this.profileService.getProfileById(profile_id);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profiles/userID/{user_id}")
    public ResponseEntity<Profile> getProfileByUserId(@PathVariable("user_id") long user_id)
    throws IdInvalidException{
        User findUser = this.userService.getUserById(user_id);
        if(findUser == null) throw new IdInvalidException("Cannot find user.");
        else return ResponseEntity.ok(findUser.getProfile());
    }

    @GetMapping("/profiles/all")
    @APIMessage("fetch all profiles without pagination")
    public ResponseEntity<List<Profile>> getAllProfiles() {
        List<Profile> profiles = this.profileService.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/profiles/pagination")
    @APIMessage("fetch profiles with pagination")
    public ResponseEntity<ResultPaginationDTO> getAllProfilesPagination(Pageable pageable,
            @Filter Specification<Profile> spec) {
        return ResponseEntity.status(HttpStatus.OK).body(this.profileService.getAllProfilesPageResultPaginationDTO(spec, pageable));
    }

    @PutMapping("/update/profile")
    public ResponseEntity<Profile> updateProfile(@RequestBody Profile profile) {
        return ResponseEntity.ok(this.profileService.updateProfile(profile));
    }

    @DeleteMapping("/delete/profile/profileID/{id}")
    public ResponseEntity<String> deleteProfileByProfileId(@PathVariable("id") Long id) {
        this.profileService.deleteProfile(id);
        return ResponseEntity.ok("Delete Job Success");
    }

    @DeleteMapping("/delete/profile/userID/{id}")
    public ResponseEntity<String> deleteProfileByUserId(@PathVariable("id") Long id) 
    throws IdInvalidException{
        User findUser = this.userService.getUserById(id);
        if (findUser == null) throw new IdInvalidException("Cannot find user.");
        else{
            this.profileService.deleteProfile(findUser.getProfile().getId());
            return ResponseEntity.ok("Delete Job Success");
        }
    }
}
