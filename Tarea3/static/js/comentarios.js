const validateName = (name) => {
  if (!name) return false;
  const length = name.trim().length;
  return length >= 3 && length <= 80;
};

const validateComment = (text) => {
  if (!text) return false;
  return text.trim().length >= 5;
};

const displayError = (element, message) => {
  element.textContent = message;
  element.style.display = 'block';
};

const clearError = (element) => {
  element.textContent = '';
  element.style.display = 'none';
};

const showSuccessMessage = (message) => {
  const successElement = document.getElementById('mensaje-exito');
  successElement.textContent = message;
  successElement.style.display = 'block';
  
  setTimeout(() => {
    successElement.style.display = 'none';
  }, 5000);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const addCommentToList = (comment) => {
  const commentsList = document.getElementById('lista-comentarios');
  
  const commentElement = document.createElement('div');
  commentElement.className = 'comentario';
  
  commentElement.innerHTML = `
    <div class="comentario-header">
      <span class="comentario-nombre">${comment.nombre}</span>
      <span class="comentario-fecha">${formatDate(comment.fecha)}</span>
    </div>
    <div class="comentario-texto">${comment.texto}</div>
  `;
  
  commentsList.insertBefore(commentElement, commentsList.firstChild);
};

const updateCommentCount = () => {
  const countElement = document.querySelector('.seccion-comentarios h3');
  const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]) || 0;
  countElement.textContent = `Comentarios (${currentCount + 1})`;
};

const handleCommentSubmit = async (event) => {
  event.preventDefault();
  
  const nombreInput = document.getElementById('nombre');
  const textoInput = document.getElementById('texto');
  const errorNombre = document.getElementById('error-nombre');
  const errorTexto = document.getElementById('error-texto');
  const actividadId = document.getElementById('actividad-id').value;
  
  clearError(errorNombre);
  clearError(errorTexto);
  
  const nombre = nombreInput.value.trim();
  const texto = textoInput.value.trim();
  let isValid = true;
  
  if (!validateName(nombre)) {
    displayError(errorNombre, 'El nombre debe tener entre 3 y 80 caracteres');
    isValid = false;
  }
  
  if (!validateComment(texto)) {
    displayError(errorTexto, 'El comentario debe tener al menos 5 caracteres');
    isValid = false;
  }
  
  if (!isValid) return;
  
  try {
    const response = await fetch('/api/comentarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actividad_id: actividadId,
        nombre: nombre,
        texto: texto
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al enviar el comentario');
    }
    
    const data = await response.json();
    nombreInput.value = '';
    textoInput.value = '';
    showSuccessMessage('Comentario agregado correctamente');
    addCommentToList(data.comentario);
    updateCommentCount();
    
  } catch (error) {
    console.error('Error:', error);
    showSuccessMessage('Error al enviar el comentario: ' + error.message);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const formComentario = document.getElementById('form-nuevo-comentario');
  if (formComentario) {
    formComentario.addEventListener('submit', handleCommentSubmit);
  }
});