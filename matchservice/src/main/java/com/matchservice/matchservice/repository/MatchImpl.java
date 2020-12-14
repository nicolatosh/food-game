package com.matchservice.matchservice.repository;

import com.matchservice.matchservice.model.Ingredient;
import com.matchservice.matchservice.model.RecipeStep;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public abstract class MatchImpl implements Match{

    private final String match_type;
    private final String recipe_name;
    private final Optional<List<Ingredient>> scrambled_ingredients;
    private final Optional<List<RecipeStep>> scrambled_steps;

    protected MatchImpl(String match_type, String recipe_name, Optional<List<Ingredient>> scrambled_ingredients, Optional<List<RecipeStep>> scrambled_steps) {
        this.match_type = match_type;
        this.recipe_name = recipe_name;
        this.scrambled_ingredients = scrambled_ingredients;
        this.scrambled_steps = scrambled_steps;
    }

    public String getMatch_type() {
        return match_type;
    }

    public String getRecipe_name() {
        return recipe_name;
    }

    public Optional<List<Ingredient>> getScrambled_ingredients() {
        return scrambled_ingredients;
    }

    public Optional<List<RecipeStep>> getScrambled_steps() {
        return scrambled_steps;
    }
}
