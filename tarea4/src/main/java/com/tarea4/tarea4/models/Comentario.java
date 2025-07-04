package com.tarea4.tarea4.models;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.List;


@Entity
@Table(name = "comentario")
public class Comentario {
    @Id
    @SequenceGenerator(
        name = "comentario_sequence",
        sequenceName = "comentario_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "comentario_sequence"
    )
    private Integer id;

    @NotNull
    @Column(name = "nombre", length = 80)
    private String nombre;

    @NotNull
    @Column(name = "texto", length = 300)
    private String texto;

    @NotNull
    @Column(name = "fecha")
    private LocalDateTime fecha = LocalDateTime.now();

    @NotNull
    @ManyToOne
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;

    public Comentario() {
    }

    public Comentario(String nombre, String texto, Actividad actividad) {
        this.nombre = nombre;
        this.texto = texto;
        this.actividad = actividad;
    }
    
    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTexto() {
        return texto;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public Actividad getActividad() {
        return actividad;
    }
}