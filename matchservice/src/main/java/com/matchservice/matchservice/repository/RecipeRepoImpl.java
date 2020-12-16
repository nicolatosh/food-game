package com.matchservice.matchservice.repository;

import com.google.gson.Gson;
import com.matchservice.matchservice.config.DataSourceRoutes;
import com.matchservice.matchservice.model.Ingredient;
import com.matchservice.matchservice.model.Recipe;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/****
 * This class can perform HTTP requests to the RecipesAdapter. It is a source of
 * data. Usually Converts Json data into java classes.
 * It uses the Spring WebClient {@link WebClient} to perform requests.
 */
@Repository
public class RecipeRepoImpl implements RecipeRepo{

    @Autowired
    private final WebClient.Builder webClient;

    public RecipeRepoImpl(WebClient.Builder webClient) {
        this.webClient = webClient;
    }

    /****
     * This method performs a call to get all Recipes.
     * @return List of {@link Recipe}
     */
    @Override
    public List<Recipe> getRecipes() {
        System.out.print("Requested all recipes: ");

        String recipe = webClient.build()
                .get()
                .uri(DataSourceRoutes.RECIPES_URL)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println(recipe != null ? "Correctly retrieved" : "Error in connecting to Adapter");
        Gson g = new Gson();
        Recipe[] recipes = g.fromJson(recipe,Recipe[].class);
        return Arrays.asList(recipes.clone());
    }

    /****
     * This method gets all Ingredients from all recipes.
     * @return List of {@link Ingredient}
     */
    @Override
    public List<String> getIngredients() {
        System.out.print("Requested all ingredients: ");

        String ingr = webClient.build()
                .get()
                .uri(DataSourceRoutes.INGREDIENTS_URL)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println(ingr);
        Gson g = new Gson();
        JSONArray test = new JSONArray(ingr);
        var temp = test.toList();
        return temp.stream().map(Object::toString).collect(Collectors.toList());
    }
}
