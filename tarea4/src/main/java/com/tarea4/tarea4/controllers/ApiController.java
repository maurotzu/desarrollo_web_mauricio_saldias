package com.tarea4.tarea4.controllers;

import com.tarea4.tarea4.models.Actividad;
import com.tarea4.tarea4.models.Nota;
import com.tarea4.tarea4.models.ActividadRepository;
import com.tarea4.tarea4.models.NotaRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/actividades")
public class ApiController {
    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;

    public ApiController(ActividadRepository actividadRepository, 
                       NotaRepository notaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
    }

    @GetMapping("/para-evaluar")
    public List<Map<String, Object>> getActividadesParaEvaluar() {
        LocalDateTime ahora = LocalDateTime.now();
        
        return actividadRepository.findByDiaHoraTerminoBefore(ahora).stream()
            .map(actividad -> {
                Double promedio = notaRepository.findAverageByActividadId(actividad.getId());
                
                // Crear el Map explícitamente para evitar problemas de inferencia de tipos
                Map<String, Object> actividadMap = new HashMap<>();
                actividadMap.put("id", actividad.getId());
                actividadMap.put("fechaInicio", actividad.getDiaHoraInicio().toString());
                actividadMap.put("sector", actividad.getSector() != null ? actividad.getSector() : "");
                actividadMap.put("nombre", actividad.getNombre());
                actividadMap.put("temas", actividad.getTemas().stream()
                    .map(t -> t.getTema().toString())
                    .collect(Collectors.joining(", ")));
                actividadMap.put("notaPromedio", promedio != null ? promedio : "-");
                
                return actividadMap;
            })
            .collect(Collectors.toList());
    }

    @PostMapping("/{id}/evaluar")
    public ResponseEntity<Map<String, Object>> agregarEvaluacion(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> request) {
        
        try {
            int notaValue = request.get("nota");
            if (notaValue < 1 || notaValue > 7) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "La nota debe estar entre 1 y 7"
                ));
            }

            Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Actividad no encontrada"));

            Nota nota = new Nota();
            nota.setActividad(actividad);
            nota.setNota(notaValue);
            notaRepository.save(nota);

            Double nuevoPromedio = notaRepository.findAverageByActividadId(id);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "nuevoPromedio", nuevoPromedio != null ? 
                    String.format("%.1f", nuevoPromedio) : "-"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }
}