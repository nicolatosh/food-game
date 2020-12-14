package com.matchservice.matchservice.utils;

import com.matchservice.matchservice.model.Ingredient;
import com.matchservice.matchservice.model.RecipeStep;

import java.util.Collections;
import java.util.List;

public class Utils {
    private Utils(){

    }

    /***
     * Method to "scramble" elements from a list.
     * @param list generic list of objects
     * @return List of scrambled elements.
     */
    public static List<String> scramble(List<String> list){
        Collections.shuffle(list);
        return list;
    }
}
