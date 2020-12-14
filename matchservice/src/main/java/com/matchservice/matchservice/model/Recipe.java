package com.matchservice.matchservice.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Recipe {

    private final String name;
    private final List<String> ingredients;
    private final List<String> steps;

    public Recipe(String name, List<String> ingredients, List<String> steps) {
        this.name = name;
        this.ingredients = ingredients;
        this.steps = steps;
    }

    public String getTitle() {
        return name;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public List<String> getSteps() {
        return steps;
    }

}
