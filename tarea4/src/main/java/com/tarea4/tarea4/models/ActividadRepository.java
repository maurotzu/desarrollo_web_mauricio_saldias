package com.tarea4.tarea4.models;

import com.tarea4.tarea4.models.Actividad;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Integer> {
    
    Page<Actividad> findAllByOrderByIdDesc(Pageable pageable);
    
    @Query("SELECT a FROM Actividad a ORDER BY a.id DESC")
    List<Actividad> findAllByOrderByIdDesc();
    
    Page<Actividad> findByComunaId(Integer comunaId, Pageable pageable);
    
    Page<Actividad> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

    List<Actividad> findByDiaHoraTerminoBefore(LocalDateTime fecha);
    
    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.actividad.id = :actividadId")
    Double findAverageNotaByActividadId(Integer actividadId);
}