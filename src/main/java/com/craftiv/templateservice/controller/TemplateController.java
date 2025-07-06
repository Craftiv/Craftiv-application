package com.craftiv.templateservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.craftiv.templateservice.model.Template;
import com.craftiv.templateservice.service.TemplateService;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    private final TemplateService service;

    // 🔽 Manual constructor added
    public TemplateController(TemplateService service) {
        this.service = service;
    }

    @PostMapping
    public Template create(@RequestBody Template template) {
        return service.save(template);
    }

    @GetMapping
    public List<Template> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Template getById(@PathVariable Long id) {
        return service.getById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
