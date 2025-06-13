from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

# Configuración de la base de datos
DATABASE_URL = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Region(Base):
    __tablename__ = 'region'
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)

class Comuna(Base):
    __tablename__ = 'comuna'
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)

class Actividad(Base):
    __tablename__ = 'actividad'
    
    id = Column(Integer, primary_key=True)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    sector = Column(String(100))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))
    dia_hora_inicio = Column(DateTime, nullable=False)
    dia_hora_termino = Column(DateTime)
    descripcion = Column(String(500))

class Foto(Base):
    __tablename__ = 'foto'
    
    id = Column(Integer, primary_key=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)

class ContactarPor(Base):
    __tablename__ = 'contactar_por'
    
    id = Column(Integer, primary_key=True)
    nombre = Column(Enum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra', name='contactar_por_nombre'), nullable=False)
    identificador = Column(String(150), nullable=False)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)

class ActividadTema(Base):
    __tablename__ = 'actividad_tema'
    
    id = Column(Integer, primary_key=True)
    tema = Column(Enum('música', 'deporte', 'ciencias', 'religión', 'política', 'tecnología', 
                      'juegos', 'baile', 'comida', 'otro', name='actividad_tema_tema'), nullable=False)
    glosa_otro = Column(String(15))
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)

class Comentario(Base):
    __tablename__ = 'comentario'
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(80), nullable=False)
    texto = Column(String(300), nullable=False)
    fecha = Column(DateTime, nullable=False, default=datetime.utcnow)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_region_by_id(id):
    session = SessionLocal()
    region = session.query(Region).filter_by(id=id).first()
    session.close()
    return region

def get_all_regiones():
    session = SessionLocal()
    regiones = session.query(Region).all()
    session.close()
    return regiones

def get_comuna_by_id(id):
    session = SessionLocal()
    comuna = session.query(Comuna).filter_by(id=id).first()
    session.close()
    return comuna

def get_comunas_by_region(region_id):
    session = SessionLocal()
    comunas = session.query(Comuna).filter_by(region_id=region_id).all()
    session.close()
    return comunas

def get_actividad_by_id(id):
    session = SessionLocal()
    actividad = session.query(Actividad).filter_by(id=id).first()
    session.close()
    return actividad

def get_actividades_by_comuna(comuna_id, page_size=10):
    session = SessionLocal()
    actividades = session.query(Actividad).filter_by(comuna_id=comuna_id).limit(page_size).all()
    session.close()
    return actividades

def create_actividad(comuna_id, sector, nombre, email, celular, dia_hora_inicio, dia_hora_termino, descripcion):
    session = SessionLocal()
    new_actividad = Actividad(
        comuna_id=comuna_id,
        sector=sector,
        nombre=nombre,
        email=email,
        celular=celular,
        dia_hora_inicio=dia_hora_inicio,
        dia_hora_termino=dia_hora_termino,
        descripcion=descripcion
    )
    session.add(new_actividad)
    session.commit()
    actividad_id = new_actividad.id
    session.close()
    return actividad_id

def add_foto_to_actividad(actividad_id, ruta_archivo, nombre_archivo):
    session = SessionLocal()
    new_foto = Foto(
        ruta_archivo=ruta_archivo,
        nombre_archivo=nombre_archivo,
        actividad_id=actividad_id
    )
    session.add(new_foto)
    session.commit()
    session.close()

def get_fotos_by_actividad(actividad_id):
    session = SessionLocal()
    fotos = session.query(Foto).filter_by(actividad_id=actividad_id).all()
    session.close()
    return fotos

def add_contacto_to_actividad(actividad_id, nombre, identificador):
    session = SessionLocal()
    new_contacto = ContactarPor(
        nombre=nombre,
        identificador=identificador,
        actividad_id=actividad_id
    )
    session.add(new_contacto)
    session.commit()
    session.close()

def get_contactos_by_actividad(actividad_id):
    session = SessionLocal()
    contactos = session.query(ContactarPor).filter_by(actividad_id=actividad_id).all()
    session.close()
    return contactos

def add_tema_to_actividad(actividad_id, tema, glosa_otro=None):
    session = SessionLocal()
    new_tema = ActividadTema(
        tema=tema,
        glosa_otro=glosa_otro,
        actividad_id=actividad_id
    )
    session.add(new_tema)
    session.commit()
    session.close()

def get_temas_by_actividad(actividad_id):
    session = SessionLocal()
    temas = session.query(ActividadTema).filter_by(actividad_id=actividad_id).all()
    session.close()
    return temas

def create_comentario(actividad_id, nombre, texto):
    session = SessionLocal()
    new_comentario = Comentario(
        actividad_id=actividad_id,
        nombre=nombre,
        texto=texto
    )
    session.add(new_comentario)
    session.commit()
    comentario_id = new_comentario.id
    session.close()
    return comentario_id

def get_comentarios_by_actividad(actividad_id, limit=None):
    session = SessionLocal()
    query = session.query(Comentario).filter_by(actividad_id=actividad_id).order_by(Comentario.fecha.desc())
    if limit:
        query = query.limit(limit)
    comentarios = query.all()
    session.close()
    return comentarios

def get_comentario_by_id(comentario_id):
    session = SessionLocal()
    comentario = session.query(Comentario).filter_by(id=comentario_id).first()
    session.close()
    return comentario

def get_total_comentarios(actividad_id):
    session = SessionLocal()
    total = session.query(Comentario).filter_by(actividad_id=actividad_id).count()
    session.close()
    return total

def create_complete_activity(activity_data, fotos, contactos, temas):
    session = SessionLocal()
    try:
        new_actividad = Actividad(
            comuna_id=activity_data['comuna_id'],
            sector=activity_data.get('sector'),
            nombre=activity_data['nombre'],
            email=activity_data['email'],
            celular=activity_data.get('celular'),
            dia_hora_inicio=activity_data['dia_hora_inicio'],
            dia_hora_termino=activity_data.get('dia_hora_termino'),
            descripcion=activity_data.get('descripcion')
        )
        session.add(new_actividad)
        session.flush()  
        actividad_id = new_actividad.id
        
        for foto in fotos:
            new_foto = Foto(
                ruta_archivo=foto['ruta_archivo'],
                nombre_archivo=foto['nombre_archivo'],
                actividad_id=actividad_id
            )
            session.add(new_foto)
        
        for contacto in contactos:
            new_contacto = ContactarPor(
                nombre=contacto['nombre'],
                identificador=contacto['identificador'],
                actividad_id=actividad_id
            )
            session.add(new_contacto)
        
        for tema in temas:
            new_tema = ActividadTema(
                tema=tema['tema'],
                glosa_otro=tema.get('glosa_otro'),
                actividad_id=actividad_id
            )
            session.add(new_tema)
        
        session.commit()
        return actividad_id
        
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def get_complete_activity(actividad_id):
    actividad = get_actividad_by_id(actividad_id)
    if not actividad:
        return None
    
    result = {
        'actividad': actividad,
        'fotos': get_fotos_by_actividad(actividad_id),
        'contactos': get_contactos_by_actividad(actividad_id),
        'temas': get_temas_by_actividad(actividad_id),
        'comuna': get_comuna_by_id(actividad.comuna_id),
        'region': get_region_by_id(get_comuna_by_id(actividad.comuna_id).region_id),
        'comentarios': get_comentarios_by_actividad(actividad_id)
    }
    
    return result

def get_activities(page_size=5):
    session = SessionLocal()
    actividades = session.query(Actividad).order_by(Actividad.dia_hora_inicio.desc()).limit(page_size).all()
    session.close()
    return actividades

def get_activity_data_for_display(page_size=5):
    data = []
    for actividad in get_activities(page_size):
        comuna = get_comuna_by_id(actividad.comuna_id)
        fotos = get_fotos_by_actividad(actividad.id)
        temas = get_temas_by_actividad(actividad.id)
        
        foto_url = "uploads/default.jpg"  
        if fotos:
            foto_filename = fotos[0].nombre_archivo
            foto_url = f"uploads/{foto_filename}"
        
        tema = "No especificado"
        if temas:
            tema = temas[0].tema
            if tema == "otro" and temas[0].glosa_otro:
                tema = temas[0].glosa_otro
        
        data.append({
            "inicio": actividad.dia_hora_inicio.strftime('%d/%m/%Y <br> %H:%M:%S'),
            "termino": actividad.dia_hora_termino.strftime('%d/%m/%Y <br> %H:%M:%S') if actividad.dia_hora_termino else "No especificado",
            "comuna": comuna.nombre if comuna else "No especificado",
            "sector": actividad.sector or "No especificado",
            "tema": tema,
            "foto_url": foto_url,
            "total_comentarios": get_total_comentarios(actividad.id)
        })
    
    return data

def get_activities_for_summary(page_size=5):
    session = SessionLocal()
    try:
        actividades = session.query(Actividad)\
            .order_by(Actividad.dia_hora_inicio.desc())\
            .limit(page_size)\
            .all()

        result = []
        for act in actividades:
            comuna = session.query(Comuna).filter_by(id=act.comuna_id).first()
            fotos = session.query(Foto).filter_by(actividad_id=act.id).count()
            temas = session.query(ActividadTema).filter_by(actividad_id=act.id).first()

            result.append({
                'id': act.id,
                'inicio': act.dia_hora_inicio.strftime('%d/%m/%Y <br> %H:%M:%S'),
                'termino': act.dia_hora_termino.strftime('%d/%m/%Y <br> %H:%M:%S') if act.dia_hora_termino else "No especificado",
                'comuna': comuna.nombre if comuna else "No especificado",
                'sector': act.sector or "No especificado",
                'tema': temas.tema if temas else "No especificado",
                'nombre_organizador': act.nombre,
                'total_fotos': fotos
            })
        return result
    finally:
        session.close()

def get_complete_activity_details(actividad_id):
    """Obtiene TODOS los detalles de una actividad específica"""
    session = SessionLocal()
    try:
        actividad = session.query(Actividad).filter_by(id=actividad_id).first()
        if not actividad:
            return None

        comuna = session.query(Comuna).filter_by(id=actividad.comuna_id).first()
        region = session.query(Region).filter_by(id=comuna.region_id).first() if comuna else None
        fotos = session.query(Foto).filter_by(actividad_id=actividad_id).all()
        temas = session.query(ActividadTema).filter_by(actividad_id=actividad_id).all()
        contactos = session.query(ContactarPor).filter_by(actividad_id=actividad_id).all()
        comentarios = session.query(Comentario).filter_by(actividad_id=actividad_id).order_by(Comentario.fecha.desc()).all()

        tema_principal = None
        glosa_otro = None
        if temas:
            tema_principal = temas[0].tema
            if tema_principal == 'otro':
                glosa_otro = temas[0].glosa_otro

        contactos_por_tipo = {}
        for contacto in contactos:
            if contacto.nombre not in contactos_por_tipo:
                contactos_por_tipo[contacto.nombre] = []
            contactos_por_tipo[contacto.nombre].append(contacto.identificador)

        return {
            'id': actividad.id,
            'comuna_id': actividad.comuna_id,
            'comuna': comuna.nombre if comuna else "No especificado",
            'region': region.nombre if region else "No especificado",
            'sector': actividad.sector or "No especificado",
            'nombre_organizador': actividad.nombre,
            'email': actividad.email,
            'celular': actividad.celular or "No especificado",
            'dia_hora_inicio': actividad.dia_hora_inicio.strftime('%d/%m/%Y %H:%M:%S'),
            'dia_hora_termino': actividad.dia_hora_termino.strftime('%d/%m/%Y %H:%M:%S') if actividad.dia_hora_termino else "No especificado",
            'descripcion': actividad.descripcion or "No especificada",
            'tema_principal': tema_principal or "No especificado",
            'glosa_otro': glosa_otro,
            'fotos': [{'nombre_archivo': foto.nombre_archivo} for foto in fotos],
            'contactos': contactos_por_tipo,
            'comentarios': [{
                'id': c.id,
                'nombre': c.nombre,
                'texto': c.texto,
                'fecha': c.fecha.strftime('%d/%m/%Y %H:%M:%S')
            } for c in comentarios],
            'total_fotos': len(fotos),
            'total_contactos': len(contactos),
            'total_comentarios': len(comentarios)
        }
    finally:
        session.close()

def get_paginated_activities(page=1, per_page=5):
    session = SessionLocal()
    try:
        offset = (page - 1) * per_page
        
        actividades = session.query(Actividad)\
            .order_by(Actividad.dia_hora_inicio.desc())\
            .offset(offset)\
            .limit(per_page)\
            .all()

        total_actividades = session.query(Actividad).count()

        result = []
        for act in actividades:
            comuna = session.query(Comuna).filter_by(id=act.comuna_id).first()
            fotos = session.query(Foto).filter_by(actividad_id=act.id).count()
            temas = session.query(ActividadTema).filter_by(actividad_id=act.id).first()

            result.append({
                'id': act.id,
                'inicio': act.dia_hora_inicio.strftime('%d/%m/%Y <br> %H:%M:%S'),
                'termino': act.dia_hora_termino.strftime('%d/%m/%Y <br> %H:%M:%S') if act.dia_hora_termino else "No especificado",
                'comuna': comuna.nombre if comuna else "No especificado",
                'sector': act.sector or "No especificado",
                'tema': temas.tema if temas else "No especificado",
                'nombre_organizador': act.nombre,
                'total_fotos': fotos
            })
        
        return {
            'actividades': result,
            'total': total_actividades,
            'page': page,
            'per_page': per_page,
            'total_pages': (total_actividades + per_page - 1) // per_page
        }
    finally:
        session.close()