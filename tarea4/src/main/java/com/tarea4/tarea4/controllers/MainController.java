package com.tarea4.tarea4.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/")
    public String mostrarIndex() {
        return "index"; // Esto busca automáticamente en templates/index.html
    }
}