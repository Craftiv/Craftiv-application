package com.craftiv.templateservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.craftiv.templateservice.model.Template;
import com.craftiv.templateservice.repository.TemplateRepository;

@Service
public class TemplateService {

    private final TemplateRepository repository;

    public TemplateService(TemplateRepository repository) {
        this.repository = repository;
    }

    public Template save(Template template) {
        return repository.save(template);
    }

    public List<Template> getAll() {
        return repository.findAll();
    }

    public Optional<Template> getById(Long id) {
        return repository.findById(id);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
