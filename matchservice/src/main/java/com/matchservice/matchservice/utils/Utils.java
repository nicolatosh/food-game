package com.matchservice.matchservice.utils;

import java.util.*;
import java.util.stream.Collectors;

public class Utils {
    private static int MIN = 1;
    private Utils(){}

    /***
     * Method to "scramble" elements from a list.
     * @param list generic list of objects
     * @return List of scrambled elements.
     */
    public static List<String> scramble(final List<String> list){
        var out_list = new ArrayList<>(list);
        Collections.shuffle(out_list);
        return out_list;
    }

    /****
     * Method to "scramble" elements from 2 source lists. The first list has
     * to be a subset of the second one.
     * It removes half of source_one elements and replaces them with the right
     * amount of elements from the second source such that there is no repetition.
     * @param source_one source one
     * @param source_two source two (must include source one)
     * @return produces a list of distinct elements
     */
    public static List<String> scrambleDoubleSource(final List<String> source_one, final List<String> source_two){

        //subset check
        if(!source_two.containsAll(source_one)){
            return Collections.emptyList();
        }

        List<String> temp_list = new ArrayList<>();
        Random r = new Random();
        var source_list = new ArrayList<>(source_one);
        var elems_to_remove = Math.floorDiv(source_list.size(),2);
        var i = elems_to_remove;
        while (i>0){
            temp_list.add(source_list.remove(source_list.size()-1));
            i--;
        }

        Set<String> random_elems = source_two.stream()
                                                    .distinct()
                                                    .filter(s -> !temp_list.contains(s) && !source_list.contains(s))
                                                    .limit(elems_to_remove)
                                                    .collect(Collectors.toSet());

        source_list.addAll(random_elems);
        return source_list;
    }
}
