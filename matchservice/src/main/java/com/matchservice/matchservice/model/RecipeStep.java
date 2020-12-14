package com.matchservice.matchservice.model;

public class RecipeStep {
    private final String step;

    private final Integer stepOrder;


    public RecipeStep(String step, Integer stepOrder) {
        this.step = step;
        this.stepOrder = stepOrder;
    }

    public String getStep() {
        return step;
    }

    public Integer getStepOrder() {
        return stepOrder;
    }
}
