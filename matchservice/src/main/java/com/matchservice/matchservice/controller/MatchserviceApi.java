package com.matchservice.matchservice.controller;

import com.matchservice.matchservice.config.GameModalities;
import com.matchservice.matchservice.model.Recipe;
import com.matchservice.matchservice.service.RecipeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import org.json.JSONObject;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@RestController
public class MatchserviceApi {

    private static GameModalities modalities;
    @Autowired
    private RecipeServiceImpl recipeService;

//    @GetMapping(value = "/match", path = "{type}", produces = "application/json")
//    public ResponseEntity<?> getMatch(@PathVariable("type") GameModalities type) {}

    @GetMapping(value = "hello")
    public List<Recipe> testHello() {
        JSONObject header;
        JSONObject response;

        List<Recipe> x = recipeService.getAllRecipes();
        return x;
    }
}
