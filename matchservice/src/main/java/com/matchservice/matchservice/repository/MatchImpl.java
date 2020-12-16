package com.matchservice.matchservice.repository;
import java.util.List;
import java.util.Objects;


public class MatchImpl implements Match{

    private final String id;
    private final String match_type;
    private final String recipe_name;
    private final List<String> scrambled_ingredients;
    private final List<String> scrambled_steps;
    private final List<String> answer;

    public MatchImpl(String id, String match_type, String recipe_name, List<String> scrambled_ingredients, List<String> scrambled_steps, List<String> answer) {
        this.id = id != null ? id : String.valueOf(Objects.hash(match_type,recipe_name));
        this.match_type = match_type;
        this.recipe_name = recipe_name;
        this.scrambled_ingredients = scrambled_ingredients;
        this.scrambled_steps = scrambled_steps;
        this.answer = answer;
    }

    public String getId() {
        return id;
    }

    public String getMatch_type() {
        return match_type;
    }

    public String getRecipe_name() {
        return recipe_name;
    }

    public List<String> getScrambled_ingredients() {
        return scrambled_ingredients;
    }

    public List<String> getScrambled_steps() {
        return scrambled_steps;
    }

    public List<String> getAnswer() {
        return answer;
    }

}
