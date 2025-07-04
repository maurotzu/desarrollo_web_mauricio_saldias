package com.tarea4.tarea4.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.tarea4.tarea4.services.AppService;

import java.util.List;
import java.util.Map;

@Controller
public class AppController {
    private final AppService appService;
    
    public AppController(AppService appService) {
        this.appService = appService;
    }
    
    @GetMapping("/")
    public String indexRoute(Model model) {
        List<Map<String, String>> actividadesData = appService.getActividadesData();
        model.addAttribute("actividades", actividadesData);
        return "index";
    }
}