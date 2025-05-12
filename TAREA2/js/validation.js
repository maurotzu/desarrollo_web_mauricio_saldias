
const validateName = (name) => {
  if (!name) return false;
  const length = name.trim().length;
  return length >= 4 && length <= 200;
};


const validateEmail = (email) => {
  if (!email) return false;
  let lengthValid = email.length >= 15 && email.length <= 100;
  let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let formatValid = re.test(email);
  return lengthValid && formatValid;
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return true;
  let re = /^\+\d{3}\.\d{7,}$/;
  return re.test(phoneNumber);
};

const validateFiles = (files) => {
  if (!files) return false;

  // validación del número de archivos
  let lengthValid = 1 <= files.length && files.length <= 3;

  // validación del tipo de archivo
  let typeValid = true;

  for (const file of files) {
    // el tipo de archivo debe ser "image/<foo>" o "application/pdf"
    let fileFamily = file.type.split("/")[0];
    typeValid &&= fileFamily == "image" || file.type == "application/pdf";
  }

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && typeValid;
};

const validateSelect = (select) => {
  if(!select) return false;
  return true
}
const validateHoraFin = (horaInicio, horaFin) => {
  if (horaFin && horaFin <= horaInicio) { 
    return false; 
  } 
  return true; 
};

const validateTemaOtro = (tema, temaOtro) => {  
  if (tema === "otro") { 
    return temaOtro.length >= 3 && temaOtro.length <= 15; 
  } 
  return true; 
};

const validateDescripcion = (descripcion) => {  
  return descripcion.length >= 8; 
};

const validateForm = () => {
  // obtener elementos del DOM usando el nombre del formulario.
  console.log("llegue1");
  let myForm = document.forms["myForm"];
  let email = myForm["email"].value;
  let phoneNumber = myForm["phone"].value;
  let name = myForm["nombre"].value;
  let department = myForm["select-department"].value;
  let curso = myForm["select-course"].value;
  let fotos = myForm["imagenes"].files;
  let horaInicio = new Date(myForm["horaInicio"].value);
  let horaFin = myForm["horaFin"].value ? new Date(myForm["horaFin"].value) : null;
  let descripcion = myForm["descripcion"].value.trim();  
  let tema = myForm["select-tema"].value;
  let temaOtro = myForm["tema-especifico"] ? myForm["tema-especifico"].value.trim() : ""; 

  // variables auxiliares de validación y función.
  let invalidInputs = [];
  let isValid = true;


  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
  };

  // lógica de validación
  if (!validateName(name)) {
    setInvalidInput("Nombre");
  }
  if (!validateEmail(email)) {
    setInvalidInput("Email");
  }
  if (!validatePhoneNumber(phoneNumber)) {
    setInvalidInput("Número");
  }
  if (!validateFiles(fotos)) {
    setInvalidInput("Fotos (mínimo 1, máximo 5, solo imágenes o PDF)");
  }
  if (!validateSelect(department)) {
    setInvalidInput("Region");
  }
  if (!validateSelect(curso)) {
    setInvalidInput("Comuna");
  }
  if (!validateHoraFin(horaInicio, horaFin)) {  
    setInvalidInput("Hora de término debe ser mayor a la hora de inicio");  
  }  
  if (!validateDescripcion(descripcion)) {  
    setInvalidInput("Descripción (mínimo 8 caracteres)");  
  }  
  if (!validateTemaOtro(tema, temaOtro)) {  
    setInvalidInput("Descripción del tema (otro) debe tener entre 3 y 15 caracteres");  
  }  
  
  console.log("llegue2");

  // finalmente mostrar la validación
  let validationBox = document.getElementById("val-box");
  let validationMessageElem = document.getElementById("val-msg");
  let validationListElem = document.getElementById("val-list");
  let formContainer = document.querySelector(".main-container");
  console.log("llegue3");

  if (!isValid) {
    validationListElem.textContent = "";
    // agregar elementos inválidos al elemento val-list.
    for (input of invalidInputs) {
      let listElement = document.createElement("li");
      listElement.innerText = input;
      validationListElem.append(listElement);
    }
    // establecer val-msg
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";

    // aplicar estilos de error
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  } else {
    // Ocultar el formulario
    myForm.style.display = "none";
    document.getElementById("submit-btn").style.display = "none";

    // establecer mensaje de éxito
    validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
    validationListElem.textContent = "";

    // aplicar estilos de éxito
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    // Agregar botones para enviar el formulario o volver
    let submitButton = document.createElement("button");
    submitButton.innerText = "Enviar";
    submitButton.style.padding = "5px 10px";  // Reducido el padding
    submitButton.style.fontSize = "14px";  // Tamaño de la fuente más pequeño
    submitButton.style.marginRight = "10px";
    submitButton.style.cursor = "pointer";
    submitButton.style.borderRadius = "4px";  // Bordes redondeados
    submitButton.addEventListener("click", () => {
      validationBox.hidden = true;
      document.getElementById("val-box2").hidden = false;
    });

    let backButton = document.createElement("button");
    backButton.innerText = "Volver";
    backButton.style.padding = "5px 10px";  // Reducido el padding
    backButton.style.fontSize = "14px";  // Tamaño de la fuente más pequeño
    backButton.style.cursor = "pointer";
    backButton.style.borderRadius = "4px";  // Bordes redondeados
    backButton.addEventListener("click", () => {
      // Mostrar el formulario nuevamente
      myForm.style.display = "block";
      document.getElementById("submit-btn").style.display = "block";
      validationBox.hidden = true;
    });

    // Crear un contenedor para los botones y aplicar estilos de alineación
    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";  // Alinea los botones horizontalmente
    buttonContainer.style.justifyContent = "center";  // Centra los botones
    buttonContainer.style.marginTop = "10px";  // Espacio superior

    // Agregar los botones al contenedor
    buttonContainer.appendChild(submitButton);
    buttonContainer.appendChild(backButton);

    // Agregar el contenedor de botones al DOM
    validationListElem.appendChild(buttonContainer);

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  }
};


document.addEventListener("DOMContentLoaded", () => {
  let submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", validateForm);
});

const verMas1Btn = document.getElementById("ver más1");
verMas1Btn.addEventListener("click", () => {
  const divisor = document.querySelector(".divisor");
  divisor.style.display = "none";

  const finalInfo = document.getElementById("fina1");
  finalInfo.hidden = false;
});

const verMas2Btn = document.getElementById("ver más2");
verMas2Btn.addEventListener("click", () => {
  const divisor = document.querySelector(".divisor");
  divisor.style.display = "none";

  const finalInfo = document.getElementById("fina2");
  finalInfo.hidden = false;
});

const verMas3Btn = document.getElementById("ver más3");
verMas3Btn.addEventListener("click", () => {
  const divisor = document.querySelector(".divisor");
  divisor.style.display = "none";

  const finalInfo = document.getElementById("fina3");
  finalInfo.hidden = false;
});

const verMas4Btn = document.getElementById("ver más4");
verMas4Btn.addEventListener("click", () => {
  const divisor = document.querySelector(".divisor");
  divisor.style.display = "none";

  const finalInfo = document.getElementById("fina4");
  finalInfo.hidden = false;
});

const verMas5Btn = document.getElementById("ver más5");
verMas5Btn.addEventListener("click", () => {
  const divisor = document.querySelector(".divisor");
  divisor.style.display = "none";

  const finalInfo = document.getElementById("fina5");
  finalInfo.hidden = false;
});

function volver(id) {
  // Mostrar la tabla
  const divisor = document.querySelector(".divisor");
  divisor.style.display = "block";

  // Ocultar la sección actual
  const actual = document.getElementById(id);
  actual.hidden = true;
}

document.addEventListener("DOMContentLoaded", () => {
  let submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", validateForm);

  const now = new Date();
  const formattedNow = now.toISOString().slice(0, 16);
  document.getElementById("horaInicio").value = formattedNow;

  // hora fin = 3 horas más
  const fin = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const formattedFin = fin.toISOString().slice(0, 16);
  document.getElementById("horaFin").value = formattedFin;
});