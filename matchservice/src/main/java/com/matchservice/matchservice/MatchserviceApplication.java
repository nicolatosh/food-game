package com.matchservice.matchservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.reactive.function.client.WebClientAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class MatchserviceApplication {

	@Bean
	public WebClient.Builder getWebClientBuilder(){
		return WebClient.builder();
	}
	public static void main(String[] args) {
		SpringApplication.run(MatchserviceApplication.class, args);
	}

}
