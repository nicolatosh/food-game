package com.matchservice.matchservice.repository;

import com.google.gson.Gson;
import com.matchservice.matchservice.model.Ingredient;
import com.matchservice.matchservice.model.Recipe;
import com.matchservice.matchservice.model.RecipeStep;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Repository
public class RecipeRepoImpl implements RecipeRepo{

    @Autowired
    private final WebClient.Builder webClient;

    public RecipeRepoImpl(WebClient.Builder webClient) {
        this.webClient = webClient;
    }

    @Override
    public List<Recipe> getAllrecipes() {

        String recipe = webClient.build()
                .get()
                .uri("http://127.0.0.1:5000/recipes")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println(recipe);
        Gson g = new Gson();
        Recipe[] Recipe = g.fromJson(recipe,Recipe[].class);
        System.out.println("LIST:" + " " + Recipe[0].getTitle());
        var ingr = new ArrayList<String>();
        ingr.add(new String("name"));
        var steps = new ArrayList<String>();
        steps.add(new String("do it"));
        var list = new ArrayList<Recipe>();
        list.add(new Recipe("obbbb",ingr,steps));
        return list;
    }

    @Override
    public List<Ingredient> getIngredients() {
        return null;
    }
}
