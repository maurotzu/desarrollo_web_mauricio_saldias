package com.tarea4.tarea4.models;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.List;
@Entity
@Table(name = "region")
public class Region {
    @Id
    @SequenceGenerator(
        name = "region_sequence",
        sequenceName = "region_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "region_sequence"
    )
    private Integer id;

    @NotNull
    @Column(name = "nombre", length = 200)
    private String nombre;

    @OneToMany(mappedBy = "region", cascade = CascadeType.ALL)
    private List<Comuna> comunas;

    public Region() {
    }

    public Region(String nombre) {
        this.nombre = nombre;
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public List<Comuna> getComunas() {
        return comunas;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
