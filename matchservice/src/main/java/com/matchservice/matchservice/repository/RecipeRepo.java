package com.matchservice.matchservice.repository;
import com.matchservice.matchservice.model.Recipe;

import java.util.List;

public interface RecipeRepo {

    List<Recipe> getRecipes();

    List<String> getIngredients();

}
