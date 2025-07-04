
package com.tarea4.tarea4.models;

import com.tarea4.tarea4.models.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {
    
    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.actividad.id = :actividadId")
    Double findAverageByActividadId(Integer actividadId);
    
    @Query("SELECT AVG(n.nota) FROM Nota n")
    Double findAverageNota();
    
    List<Nota> findByActividadId(Integer actividadId);
}