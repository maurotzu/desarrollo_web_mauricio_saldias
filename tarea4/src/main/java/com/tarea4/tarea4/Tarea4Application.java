package com.tarea4.tarea4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class Tarea4Application {
    public static void main(String[] args) {
        SpringApplication.run(Tarea4Application.class, args);
    }
}

/* 

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Tarea4Application {

	public static void main(String[] args) {
		SpringApplication.run(Tarea4Application.class, args);
	}

}

*/