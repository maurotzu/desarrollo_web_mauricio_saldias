let contador = 0;
const MAX_FOTOS = 4; 

const addfoto = () => {
    if (contador >= MAX_FOTOS) {
        const btn = document.getElementById("mostrar-mas");
        btn.disabled = true;
        btn.textContent = "Máximo alcanzado";
        return;
    }

    contador++;
    const container = document.getElementById("imagenes-container");
    const newInput = document.createElement("input");
    newInput.type = "file";
    newInput.name = "imagenes[]"; 
    newInput.className = "imagen-input";
    newInput.accept = "image/*,.pdf";
    
    container.appendChild(document.createElement("br"));
    container.appendChild(newInput);
};

const poblarDepartamentos = async () => {
  try {
    const response = await fetch('/api/regiones');
    const regiones = await response.json();
    
    let departmentSelect = document.getElementById("select-department");
    departmentSelect.innerHTML = '<option value="">Seleccione una Region</option>';
    
    regiones.forEach(region => {
      let option = document.createElement("option");
      option.value = region.id;
      option.text = region.nombre;
      departmentSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar regiones:", error);
  }
};

const updateCursos = async () => {
  let departmentSelect = document.getElementById("select-department");
  let courseSelect = document.getElementById("select-course");
  let selectedDepartmentId = departmentSelect.value;
  
  courseSelect.innerHTML = '<option value="">Seleccione una Comuna</option>';
  
  if (selectedDepartmentId) {
    try {
      const response = await fetch(`/api/comunas/${selectedDepartmentId}`);
      const comunas = await response.json();
      
      comunas.forEach(comuna => {
        let option = document.createElement("option");
        option.value = comuna.id;
        option.text = comuna.nombre;
        courseSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar comunas:", error);
    }
  }
  changeArguments();
};

const poblarTemas = async () => {
  try {
    const response = await fetch('/api/temas');
    const temas = await response.json();
    
    let temaSelect = document.getElementById("select-tema");
    temaSelect.innerHTML = '<option value="">Seleccione un Tema</option>';
    
    temas.forEach(tema => {
      let option = document.createElement("option");
      option.value = tema;
      option.text = tema;
      temaSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar temas:", error);
  }
};

function changeArguments() {
  const courseSelect = document.getElementById("select-course");
  const reasonLabel = document.querySelector("label[for='reason']");
  const reasonTextarea = document.getElementById("sector");
  
  if (courseSelect.value !== "") {
    reasonLabel.style.display = "block";
    reasonTextarea.style.display = "block";
  } else {
    reasonLabel.style.display = "none";
    reasonTextarea.style.display = "none";
  }
}

function changeTema() {
  const temaSelect = document.getElementById("select-tema");
  const temaLabel = document.querySelector("label[for='select-tema2']");
  const temaTextarea = document.getElementById("select-tema2");

  if (temaSelect.value == "otro") {
    temaLabel.style.display = "block";
    temaTextarea.style.display = "block";
  } else {
    temaLabel.style.display = "none";
    temaTextarea.style.display = "none";
  }
}

function revisaCheck(element){
  if (element.checked) {
    document.getElementById(element.name).style.display = "block";
  } else {
    document.getElementById(element.name).style.display = "none";
  }
}

document.getElementById("select-department").addEventListener("change", updateCursos);
document.getElementById("select-course").addEventListener("change", changeArguments);
document.getElementById("select-tema").addEventListener("change", changeTema);
document.getElementById("mostrar-mas").addEventListener("click", addfoto);

window.onload = async () => {
  await poblarDepartamentos();
  changeArguments();
  await poblarTemas();
  changeTema();
  ['whatsapp', 'instagram', 'telegram', 'x'].forEach(red => {
    const checkbox = document.querySelector(`input[name="${red}"]`);
    if(checkbox) checkbox.addEventListener("click", () => revisaCheck(checkbox));
  });
};