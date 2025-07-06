package com.craftiv.templateservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.craftiv.templateservice.model.Template;

public interface TemplateRepository extends JpaRepository<Template, Long> {
}
