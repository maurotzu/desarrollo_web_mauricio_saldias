package com.tarea4.tarea4.models;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name = "actividad")
public class Actividad {
    @Id
    @SequenceGenerator(
        name = "actividad_sequence",
        sequenceName = "actividad_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "actividad_sequence"
    )
    private Integer id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "comuna_id", nullable = false)
    private Comuna comuna;

    @Column(name = "sector", length = 100)
    private String sector;

    @NotNull
    @Column(name = "nombre", length = 200)
    private String nombre;

    @NotNull
    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "celular", length = 15)
    private String celular;

    @NotNull
    @Column(name = "dia_hora_inicio")
    private LocalDateTime diaHoraInicio;

    @Column(name = "dia_hora_termino")
    private LocalDateTime diaHoraTermino;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
    private List<Foto> fotos;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
    private List<ContactarPor> contactos;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
    private List<ActividadTema> temas;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
    private List<Comentario> comentarios;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
    private List<Nota> notas;

    @Transient
    private Double notaPromedio;

    public Actividad() {
    }

    public Actividad(Comuna comuna, String sector, String nombre, String email, 
                   LocalDateTime diaHoraInicio, String descripcion) {
        this.comuna = comuna;
        this.sector = sector;
        this.nombre = nombre;
        this.email = email;
        this.diaHoraInicio = diaHoraInicio;
        this.descripcion = descripcion;
    }

    public Integer getId() {
        return id;
    }

    public Comuna getComuna() {
        return comuna;
    }

    public String getSector() {
        return sector;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getCelular() {
        return celular;
    }

    public LocalDateTime getDiaHoraInicio() {
        return diaHoraInicio;
    }

    public LocalDateTime getDiaHoraTermino() {
        return diaHoraTermino;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public List<Foto> getFotos() {
        return fotos;
    }

    public List<ContactarPor> getContactos() {
        return contactos;
    }

    public List<ActividadTema> getTemas() {
        return temas;
    }

    public List<Comentario> getComentarios() {
        return comentarios;
    }

    public List<Nota> getNotas() {
        return notas;
    }

    public Double getNotaPromedio() {
        return notaPromedio;
    }

    public void setNotaPromedio(Double notaPromedio) {
        this.notaPromedio = notaPromedio;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
}
