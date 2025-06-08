const validateName = (name) => {
  if (!name) return false;
  const length = name.trim().length;
  return length >= 4 && length <= 200;
};

const validateEmail = (email) => {
  if (!email) return false;
  let lengthValid = email.length >= 15 && email.length <= 100;
  let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let formatValid = re.test(email);
  return lengthValid && formatValid;
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return true;
  let re = /^\+\d{3}[\.]?\d{7,}$/;
  return re.test(phoneNumber);
};

const validateFiles = () => {
  const fileInputs = document.querySelectorAll('input[name="imagenes[]"]');
  let totalFiles = 0;
  let allValid = true;

  fileInputs.forEach(input => {
    if (input.files.length > 0) {
      totalFiles += input.files.length;
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      Array.from(input.files).forEach(file => {
        if (!validTypes.includes(file.type)) {
          allValid = false;
        }
      });
    }
  });

  if (totalFiles === 0) return false;
  if (totalFiles > 5) return false;
  return allValid;
};

const validateSelect = (select) => {
  if(!select) return false;
  return true;
};

const validateHoraInicio = (horaInicio) => {
  return horaInicio instanceof Date && !isNaN(horaInicio);
};

const validateHoraFin = (horaInicio, horaFin) => {
  if (!horaFin) return false;
  return horaFin > horaInicio;
};

const validateTema = (tema) => {
  return !!tema;
};

const validateTemaOtro = (tema, temaOtro) => {  
  if (tema === "otro") { 
    return temaOtro.length >= 3 && temaOtro.length <= 15; 
  } 
  return true; 
};

const validateDescripcion = (descripcion) => {  
  return descripcion.length >= 8 && descripcion.length <= 500; 
};

const validateRedesSociales = () => {
  const redes = ['whatsapp', 'instagram', 'telegram', 'x'];
  for (let red of redes) {
    const checkbox = document.querySelector(`input[name="${red}"]`);
    const input = document.getElementById(red);
    if (checkbox && checkbox.checked && input && input.value.trim() === '') {
      return false;
    }
  }
  return true;
};

const validateSector = (comunaSelected, sector) => {
  if (comunaSelected && sector.trim() === '') {
    return false;
  }
  return true;
};

const validateForm = async (event) => {
  event.preventDefault();
  
  let myForm = document.forms["myForm"];
  let email = myForm["email"].value;
  let phoneNumber = myForm["phone"].value;
  let name = myForm["nombre"].value;
  let department = myForm["select-department"].value;
  let curso = myForm["select-course"].value;
  let horaInicio = myForm["horaInicio"].value ? new Date(myForm["horaInicio"].value) : null;
  let horaFin = myForm["horaFin"].value ? new Date(myForm["horaFin"].value) : null;
  let descripcion = myForm["descripcion"].value.trim();  
  let tema = myForm["select-tema"].value;
  let temaOtro = myForm["tema-especifico"] ? myForm["tema-especifico"].value.trim() : "";
  let sector = myForm["sector"] ? myForm["sector"].value.trim() : "";

  let invalidInputs = [];
  let isValid = true;

  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid = false;
  };

  if (!validateName(name)) {
    setInvalidInput("Nombre (debe tener entre 4 y 200 caracteres)");
  }
  if (!validateEmail(email)) {
    setInvalidInput("Email (formato inválido o longitud incorrecta)");
  }
  if (!validatePhoneNumber(phoneNumber)) {
    setInvalidInput("Número celular (formato: +569.12345678)");
  }
  if (!validateFiles()) {
    setInvalidInput("Fotos (mínimo 1, máximo 5, solo imágenes o PDF)");
  }
  if (!validateSelect(department)) {
    setInvalidInput("Debes seleccionar una Región");
  }
  if (!validateSelect(curso)) {
    setInvalidInput("Debes seleccionar una Comuna");
  }
  if (!validateHoraInicio(horaInicio)) {
    setInvalidInput("Debes ingresar una hora de inicio válida");
  }
  if (!validateHoraFin(horaInicio, horaFin)) {  
    setInvalidInput("Hora de término debe ser mayor a la hora de inicio");  
  }
  if (!validateDescripcion(descripcion)) {  
    setInvalidInput("Descripción (entre 8 y 500 caracteres)");  
  }
  if (!validateTema(tema)) {
    setInvalidInput("Debes seleccionar un tema");
  }
  if (!validateTemaOtro(tema, temaOtro)) {  
    setInvalidInput("Descripción del tema (otro) debe tener entre 3 y 15 caracteres");  
  }
  if (!validateRedesSociales()) {
    setInvalidInput("Debes completar los IDs de las redes sociales seleccionadas");
  }
  if (!validateSector(curso, sector)) {
    setInvalidInput("Debes ingresar un sector para la comuna seleccionada");
  }

  let validationBox = document.getElementById("val-box");
  let validationMessageElem = document.getElementById("val-msg");
  let validationListElem = document.getElementById("val-list");

  if (!isValid) {
    validationListElem.textContent = "";
    invalidInputs.forEach(input => {
      let listElement = document.createElement("li");
      listElement.innerText = input;
      validationListElem.append(listElement);
    });
    
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";
    validationBox.hidden = false;
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    return;
  }

  myForm.style.display = "none";
  document.getElementById("submit-btn").style.display = "none";

  validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
  validationListElem.textContent = "";
  validationBox.style.backgroundColor = "#ddffdd";
  validationBox.style.borderLeftColor = "#4CAF50";

  let submitButton = document.createElement("button");
  submitButton.innerText = "Enviar";
  submitButton.className = "btn-main";
  submitButton.style.marginRight = "10px";

  let backButton = document.createElement("button");
  backButton.innerText = "Volver";
  backButton.className = "btn-main";

  let buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.marginTop = "10px";
  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(backButton);
  validationListElem.appendChild(buttonContainer);
  validationBox.hidden = false;

  submitButton.addEventListener("click", async () => {
    submitButton.disabled = true;
    backButton.disabled = true;
    validationMessageElem.innerText = "Enviando datos al servidor...";
    validationBox.style.backgroundColor = "#c9ffcb";
    validationBox.style.borderLeftColor ="rgb(0, 59, 2)";

    try {
      const formData = new FormData();
      const formElements = myForm.elements;
      for (let element of formElements) {
        if (element.name && element.type !== 'file' && element.type !== 'submit' && element.type !== 'button') {
          formData.append(element.name, element.value);
        }
      }

      const fileInputs = document.querySelectorAll('input[name="imagenes[]"]');
      fileInputs.forEach(input => {
        Array.from(input.files).forEach(file => {
          formData.append('imagenes', file);
        });
      });
      
      const response = await fetch("/post-activity", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la validación del servidor");
      }

      validationMessageElem.innerText = "¡Actividad creada con éxito!";
      validationBox.style.backgroundColor = "#ddffdd";
      buttonContainer.removeChild(submitButton);

    } catch (error) {
      validationMessageElem.innerText = "Error con validación de database:";
      validationBox.style.backgroundColor = "#ffdddd";
      validationBox.style.borderLeftColor = "#f44336";
      
      let errorElement = document.createElement("li");
      errorElement.innerText = error.message;
      validationListElem.appendChild(errorElement);
      
      buttonContainer.removeChild(submitButton);
    } finally {
      backButton.disabled = false;
    }
  });

  backButton.addEventListener("click", () => {
    myForm.style.display = "block";
    document.getElementById("submit-btn").style.display = "block";
    validationBox.hidden = true;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  let submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", validateForm);

  const now = new Date();
  document.getElementById("horaInicio").value = now.toISOString().slice(0, 16);
  
  const fin = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  document.getElementById("horaFin").value = fin.toISOString().slice(0, 16);
});