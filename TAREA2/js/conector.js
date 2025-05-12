document.addEventListener("DOMContentLoaded", () => {
    const cambio1 = () => {
        window.location.href = "addact.html";
    }
    const cambio2 = () => {
        window.location.href = "seeact.html";
    }
    const cambio3 = () => {
        window.location.href = "seestats.html";
    }
    const cambio4 = () => {
        window.location.href = "index2.html";
    }

    let portada = document.getElementById("portada");
    let b_add = document.getElementById("add_act");
    let b_see = document.getElementById("see_act");
    let b_stat = document.getElementById("see_stats");

    if (portada) portada.addEventListener("click", cambio4);
    if (b_add) b_add.addEventListener("click", cambio1);
    if (b_see) b_see.addEventListener("click", cambio2);
    if (b_stat) b_stat.addEventListener("click", cambio3);
});