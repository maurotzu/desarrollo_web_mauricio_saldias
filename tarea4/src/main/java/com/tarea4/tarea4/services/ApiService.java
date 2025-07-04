package com.tarea4.tarea4.services;

import com.tarea4.tarea4.models.Actividad;
import com.tarea4.tarea4.models.Nota;
import com.tarea4.tarea4.models.ActividadRepository;
import com.tarea4.tarea4.models.NotaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApiService {
    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;

    public ApiService(ActividadRepository actividadRepository, 
                     NotaRepository notaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
    }

    public List<Actividad> getActividadesParaEvaluar() {
        return actividadRepository.findByDiaHoraTerminoBefore(LocalDateTime.now());
    }

    public Double agregarNota(Integer actividadId, Integer nota) {
        Actividad actividad = actividadRepository.findById(actividadId)
            .orElseThrow(() -> new IllegalArgumentException("Actividad no encontrada"));

        Nota nuevaNota = new Nota();
        nuevaNota.setActividad(actividad);
        nuevaNota.setNota(nota);
        notaRepository.save(nuevaNota);

        return notaRepository.findAverageByActividadId(actividadId);
    }
}