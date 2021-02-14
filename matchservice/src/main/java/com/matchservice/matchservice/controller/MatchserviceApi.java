package com.matchservice.matchservice.controller;

import com.google.gson.Gson;
import com.matchservice.matchservice.repository.*;
import com.matchservice.matchservice.config.GameModalities;
import com.matchservice.matchservice.model.Recipe;
import com.matchservice.matchservice.service.RecipeServiceImpl;
import com.matchservice.matchservice.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.json.JSONObject;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class MatchserviceApi {

    private static GameModalities modalities;
    @Autowired
    private RecipeServiceImpl recipeService;

    /****
     * This endpoint produces a new {@link Match} according to some parameters.
     * @return
     */
    @GetMapping(path = "match", produces = "application/json")
    public ResponseEntity<?> produceMatch(@RequestParam("type") String type) {
        JSONObject header;
        String body;
        JSONObject response;
        List<Recipe> recipes = recipeService.getRecipes();
        Random rand = new Random();
        var selectedRecipe = recipes.get(rand.nextInt(recipes.size()));
        var scrambledSteps = Utils.scramble(selectedRecipe.getSteps());
        var ingredientsPool = recipeService.getIngredients();
        var recipeIngredients = selectedRecipe.getIngredients();
        var scrambledIngredients = Utils.scrambleDoubleSource(recipeIngredients, ingredientsPool);
        System.out.println("Building new match of type: " + type);
        switch (type) {
            case "rearrange_steps":
                List<String> answer = selectedRecipe.getSteps();
                MatchImpl match = new MatchImpl(
                        null,
                        GameModalities.rearrange_steps.toString(),
                        selectedRecipe.getTitle(),
                        Collections.emptyList(),
                        scrambledSteps,
                        answer);
                Gson gson = new Gson();
                body = gson.toJson(match);
                return ResponseEntity
                        .ok()
                        .body(body);

            case "select_ingredients":

                List<String> answerIngredients = scrambledIngredients.stream().filter(recipeIngredients::contains)
                        .collect(Collectors.toList());
                MatchImpl matchIngr = new MatchImpl(
                        null,
                        GameModalities.select_ingredients.toString(),
                        selectedRecipe.getTitle(),
                        scrambledIngredients,
                        Collections.emptyList(),
                        answerIngredients);
                Gson gsonIngr = new Gson();
                body = gsonIngr.toJson(matchIngr);
                return ResponseEntity
                        .ok()
                        .body(body);
            default:
                return ResponseEntity
                        .badRequest()
                        .body("Error, such type of match does not exits");

        }
    }
}
