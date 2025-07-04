package com.tarea4.tarea4.models;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name = "foto")
public class Foto {
    @Id
    @SequenceGenerator(
        name = "foto_sequence",
        sequenceName = "foto_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "foto_sequence"
    )
    private Integer id;

    @NotNull
    @Column(name = "ruta_archivo", length = 300)
    private String rutaArchivo;

    @NotNull
    @Column(name = "nombre_archivo", length = 300)
    private String nombreArchivo;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;

    public Foto() {
    }

    public Foto(String rutaArchivo, String nombreArchivo, Actividad actividad) {
        this.rutaArchivo = rutaArchivo;
        this.nombreArchivo = nombreArchivo;
        this.actividad = actividad;
    }

    public Integer getId() {
        return id;
    }

    public String getRutaArchivo() {
        return rutaArchivo;
    }

    public String getNombreArchivo() {
        return nombreArchivo;
    }

    public Actividad getActividad() {
        return actividad;
    }
}