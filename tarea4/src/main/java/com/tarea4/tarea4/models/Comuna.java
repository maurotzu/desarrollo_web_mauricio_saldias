package com.tarea4.tarea4.models;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.List;


@Entity
@Table(name = "comuna")
public class Comuna {
    @Id
    @SequenceGenerator(
        name = "comuna_sequence",
        sequenceName = "comuna_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "comuna_sequence"
    )
    private Integer id;

    @NotNull
    @Column(name = "nombre", length = 200)
    private String nombre;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    @OneToMany(mappedBy = "comuna", cascade = CascadeType.ALL)
    private List<Actividad> actividades;

    public Comuna() {
    }

    public Comuna(String nombre, Region region) {
        this.nombre = nombre;
        this.region = region;
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Region getRegion() {
        return region;
    }

    public List<Actividad> getActividades() {
        return actividades;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setRegion(Region region) {
        this.region = region;
    }
}