package com.tarea4.tarea4.models;

import com.tarea4.tarea4.models.ActividadTema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActividadTemaRepository extends JpaRepository<ActividadTema, Integer> {
    List<ActividadTema> findByActividadId(Integer actividadId);
    List<ActividadTema> findByActividad(Actividad actividad);
}