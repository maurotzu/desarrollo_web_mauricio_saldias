package com.tarea4.tarea4.models;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.List;


@Entity
@Table(name = "contactar_por")
public class ContactarPor {
    public enum ContactoNombre {
        whatsapp, telegram, X, instagram, tiktok, otra
    }

    @Id
    @SequenceGenerator(
        name = "contactar_por_sequence",
        sequenceName = "contactar_por_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "contactar_por_sequence"
    )
    private Integer id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "nombre")
    private ContactoNombre nombre;

    @NotNull
    @Column(name = "identificador", length = 150)
    private String identificador;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;

    public ContactarPor() {
    }

    public ContactarPor(ContactoNombre nombre, String identificador, Actividad actividad) {
        this.nombre = nombre;
        this.identificador = identificador;
        this.actividad = actividad;
    }

    public Integer getId() {
        return id;
    }

    public ContactoNombre getNombre() {
        return nombre;
    }

    public String getIdentificador() {
        return identificador;
    }

    public Actividad getActividad() {
        return actividad;
    }
}