package edu.ucsb.cs156.example.controllers;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Tag(name = "Articles")
@RequestMapping("/api/articles")
@RestController
@Slf4j
public class ArticlesController extends ApiController {

    @Autowired
    ArticlesRepository articlesRepository; //why this?

    @Operation(summary= "List blog posts, newspaper articles, etc. of interest")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Articles> allArticless() {
        Iterable<Articles> articles = articlesRepository.findAll();
        return articles;
    }

    @Operation(summary= "Create an article entry")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public Articles postArticles(
        @Parameter(name="title") @RequestParam String title,
        @Parameter(name="url") @RequestParam String url,
        @Parameter(name="explanation") @RequestParam String explanation,
        @Parameter(name="email") @RequestParam String email,
        @Parameter(name="dateAdded") @RequestParam LocalDateTime dateAdded
        )
        {

        Articles article = new Articles();
        article.setTitle(title);
        article.setUrl(url);
        article.setExplanation(explanation);
        article.setEmail(email);
        article.setDateAdded(dateAdded);

        Articles savedArticle = articlesRepository.save(article);

        return savedArticle;
    }

    @Operation(summary= "Get a single article")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Articles getById(
            @Parameter(name="id") @RequestParam Long id) {
        Articles article = articlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));

        return article;
    }

    @Operation(summary= "Delete an article")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteArticles(
            @Parameter(name="id") @RequestParam Long id) {
        Articles article = articlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));

        articlesRepository.delete(article);
        return genericMessage("Articles with id %s deleted".formatted(id));
    }

    @Operation(summary= "Update a single article")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public Articles updateArticles(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid Articles incoming) {

        Articles article = articlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));


        article.setTitle(incoming.getTitle());  
        article.setUrl(incoming.getUrl());
        article.setExplanation(incoming.getExplanation());
        article.setEmail(incoming.getEmail());
        article.setDateAdded(incoming.getDateAdded());


        articlesRepository.save(article);

        return article;
    }
}
