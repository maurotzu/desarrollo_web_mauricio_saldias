from flask import Flask, jsonify, request, render_template, redirect, url_for, session
from database import db
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import logging

UPLOAD_FOLDER = 'static/uploads'
app = Flask(__name__)
app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/")
def index():

    data = db.get_activity_data_for_display(page_size=5)
    return render_template("index2.html", actividades=data)

@app.route("/addact")
def add_activity():
    return render_template("addact.html")

#@app.route("/seeact")
#def see_activity():
#    return render_template("seeact.html")

@app.route("/actividades-table")
@app.route("/actividades-table/<int:page>")
def actividades_table(page=1):
    data = db.get_paginated_activities(page=page)
    return render_template("actividades_table.html", 
                         actividades=data['actividades'],
                         pagination=data)

@app.route("/detalle-actividad/<int:actividad_id>")
def detalle_actividad(actividad_id):

    actividad = db.get_complete_activity_details(actividad_id)
    if not actividad:
        return redirect(url_for('actividades_table'))
    
    return render_template("detalle_actividad.html", actividad=actividad)

@app.route("/seestats")
def see_stats():
    return render_template("seestats.html")

@app.route('/ver-actividad')
def ver_actividad():
    actividad_id = request.args.get('id')
    return render_template("ver_actividad.html", actividad_id=actividad_id)

@app.route('/api/regiones', methods=['GET'])
def get_regiones():
    regiones = db.get_all_regiones()
    return jsonify([{"id": r.id, "nombre": r.nombre} for r in regiones])

@app.route('/api/comunas/<int:region_id>', methods=['GET'])
def get_comunas(region_id):
    comunas = db.get_comunas_by_region(region_id)
    return jsonify([{"id": c.id, "nombre": c.nombre} for c in comunas])

@app.route('/api/temas', methods=['GET'])
def get_temas():
    temas = [
        "música", "deporte", "ciencias", "religión", "política",
        "tecnología", "juegos", "baile", "comida", "otro"
    ]
    return jsonify(temas)

@app.route('/post-activity', methods=['POST'])
def post_activity():
    try:
        logger.debug("Iniciando procesamiento de actividad")
        

        required_fields = ['comuna_id', 'nombre', 'email', 'horaInicio', 'tema']
        for field in required_fields:
            if not request.form.get(field):
                return jsonify({"message": f"El campo {field} es requerido"}), 400


        try:
            hora_inicio = datetime.strptime(request.form['horaInicio'], '%Y-%m-%dT%H:%M')
            hora_fin = datetime.strptime(request.form['horaFin'], '%Y-%m-%dT%H:%M') if request.form.get('horaFin') else None
        except ValueError as e:
            logger.error(f"Error en formato de fecha: {str(e)}")
            return jsonify({"message": "Formato de fecha inválido. Use YYYY-MM-DDTHH:MM"}), 400


        activity_data = {
            'comuna_id': request.form['comuna_id'],
            'sector': request.form.get('sector'),
            'nombre': request.form['nombre'],
            'email': request.form['email'],
            'celular': request.form.get('phone'),
            'dia_hora_inicio': hora_inicio,
            'dia_hora_termino': hora_fin,
            'descripcion': request.form.get('descripcion')
        }

        logger.debug(f"Datos de actividad: {activity_data}")


        tema = request.form['tema']
        temas = [{
            'tema': tema,
            'glosa_otro': request.form.get('tema-especifico') if tema == 'otro' else None
        }]

############### ME FALLA SI NO LO HAGO ASI; EL BACK RECLAMA NOSE PORQUE :(
        contactos = []
        for medio in ['whatsapp', 'instagram', 'telegram', 'x']:
            if request.form.get(medio) == 'on':  
                identificador = request.form.get(f'{medio}-id', 'N/A').strip() 
                contactos.append({
                    'nombre': medio,
                    'identificador': identificador if identificador else 'N/A' 
                })
###############

        fotos = []
        if 'imagenes' not in request.files:
            return jsonify({"message": "Debe subir al menos una imagen"}), 400

        for file in request.files.getlist('imagenes'):
            if file.filename == '':
                continue
                
            if file:
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                try:
                    file.save(filepath)
                    fotos.append({
                        'ruta_archivo': filepath,
                        'nombre_archivo': filename
                    })
                except Exception as e:
                    logger.error(f"Error al guardar archivo: {str(e)}")
                    return jsonify({"message": "Error al guardar imágenes"}), 500

        if not fotos:
            return jsonify({"message": "Debe subir al menos una imagen válida"}), 400

        actividad_id = db.create_complete_activity(activity_data, fotos, contactos, temas)
        logger.debug(f"Actividad creada con ID: {actividad_id}")
        logger.debug(f"Fotos a guardar: {fotos}")
        fotos_guardadas = db.get_fotos_by_actividad(actividad_id)
        logger.debug(f"Fotos guardadas en DB: {len(fotos_guardadas)}")

        return jsonify({
            "success": True,
            "actividad_id": actividad_id,
            "message": "Actividad creada exitosamente"
        }), 200

    except Exception as e:
        logger.error(f"Error al crear actividad: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": "Error interno al crear la actividad"
        }), 500

if __name__ == "__main__":
    app.run(debug=True)