package vn.group16.jobhunter.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.group16.jobhunter.domain.Subscriber;

public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {
    Subscriber findByEmail(String email);
}
