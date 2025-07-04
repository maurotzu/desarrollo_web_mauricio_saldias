package com.tarea4.tarea4.services;

import com.tarea4.tarea4.models.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppService {
    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;
    private final ActividadTemaRepository actividadTemaRepository;

    public AppService(ActividadRepository actividadRepository, 
                    NotaRepository notaRepository,
                    ActividadTemaRepository actividadTemaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
        this.actividadTemaRepository = actividadTemaRepository;
    }

    public List<Map<String, String>> getActividadesData() {
        List<Actividad> actividades = actividadRepository.findAllByOrderByIdDesc();
        List<Map<String, String>> actividadesData = new ArrayList<>();
        
        for (Actividad actividad : actividades) {
            Map<String, String> actividadData = new HashMap<>();
            actividadData.put("id", actividad.getId().toString());
            actividadData.put("nombre", actividad.getNombre());
            actividadData.put("sector", actividad.getSector() != null ? actividad.getSector() : "");
            actividadData.put("fechaInicio", formatDateTime(actividad.getDiaHoraInicio()));
            actividadData.put("fechaTermino", actividad.getDiaHoraTermino() != null ? 
                formatDateTime(actividad.getDiaHoraTermino()) : "");
            
            String temas = actividadTemaRepository.findByActividad(actividad).stream()
                .map(t -> t.getTema().toString())
                .collect(Collectors.joining(", "));
            actividadData.put("temas", temas);

            Double notaPromedio = notaRepository.findAverageByActividadId(actividad.getId());
            actividadData.put("notaPromedio", notaPromedio != null ? 
                String.format("%.1f", notaPromedio) : "N/A");
            
            actividadesData.add(actividadData);
        }
        return actividadesData;
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        return dateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }
}