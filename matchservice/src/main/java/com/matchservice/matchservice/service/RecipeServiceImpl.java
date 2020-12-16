package com.matchservice.matchservice.service;

import com.matchservice.matchservice.model.Ingredient;
import com.matchservice.matchservice.model.Recipe;
import com.matchservice.matchservice.repository.RecipeRepoImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeServiceImpl implements RecipeService {

    @Autowired
    private final RecipeRepoImpl recipeRepo;

    public RecipeServiceImpl(RecipeRepoImpl recipeRepo) {
        this.recipeRepo = recipeRepo;
    }

    @Override
    public List<Recipe> getRecipes() {
        return recipeRepo.getRecipes();
    }

    @Override
    public List<String> getIngredients() {
        return recipeRepo.getIngredients();
    }
}
