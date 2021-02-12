package com.matchservice.matchservice.config;

public class DataSourceRoutes {
    private static final String ADAPTER_URL = "http://recipes_db_adapter:";
    private static final String ADAPTER_PORT = "5000";
    public static final String INGREDIENTS_URL= ADAPTER_URL + ADAPTER_PORT + "/ingredients";
    public static final String RECIPES_URL= ADAPTER_URL + ADAPTER_PORT + "/recipes";

    private DataSourceRoutes(){

    }
}
