package com.matchservice.matchservice.repository;

import com.matchservice.matchservice.model.Ingredient;
import com.matchservice.matchservice.model.Recipe;

import java.util.List;
import java.util.Optional;

public interface RecipeRepo {

    List<Recipe> getRecipes();

    List<Ingredient> getIngredients();

}
