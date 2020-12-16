package com.matchservice.matchservice.service;

import com.matchservice.matchservice.model.Ingredient;
import com.matchservice.matchservice.model.Recipe;
import java.util.List;

public interface RecipeService {

    List<Recipe> getRecipes();

    List<String> getIngredients();
}
