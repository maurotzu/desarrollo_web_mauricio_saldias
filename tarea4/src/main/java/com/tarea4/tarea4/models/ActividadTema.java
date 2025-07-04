package com.tarea4.tarea4.models;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.List;


@Entity
@Table(name = "actividad_tema")
public class ActividadTema {
    public enum Tema {
        música, deporte, ciencias, religión, política, tecnología, 
        juegos, baile, comida, otro
    }

    @Id
    @SequenceGenerator(
        name = "actividad_tema_sequence",
        sequenceName = "actividad_tema_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "actividad_tema_sequence"
    )
    private Integer id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tema")
    private Tema tema;

    @Column(name = "glosa_otro", length = 15)
    private String glosaOtro;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;

    public ActividadTema() {
    }

    public ActividadTema(Tema tema, Actividad actividad) {
        this.tema = tema;
        this.actividad = actividad;
    }

    public Integer getId() {
        return id;
    }

    public Tema getTema() {
        return tema;
    }

    public String getGlosaOtro() {
        return glosaOtro;
    }

    public Actividad getActividad() {
        return actividad;
    }

    public void setGlosaOtro(String glosaOtro) {
        this.glosaOtro = glosaOtro;
    }
}