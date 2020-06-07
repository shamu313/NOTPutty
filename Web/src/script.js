const body = document.getElementsByTagName("body")[0];
const container = document.getElementById("container");

document.addEventListener("keydown", function (event) {
    if (current_menu[0] === "main" && current_menu.length === 1) {
        // Menu 2
        if (parseInt(event.keyCode) === 50) {
            container.textContent = menus["2"]["main"];
            container.textContent += "_";
            current_menu.push("2");

            // Menu 5
        } else if (parseInt(event.keyCode) === 53) {
            container.textContent = menus["5"]["main"];
            container.textContent += "_";
            current_menu.push("5");
        }
    } else {
        container.textContent = menus["main"];
        container.textContent += "_";
        current_menu = ["main"];
    }

});


var menus = {
    "main":
        `                          UNIVERSIDAD DE PUERTO RICO
                      Recinto Universitario de Mayaguez
07/jun/2020                                                             7:32 pm
                         SISTEMA ESTUDIANTIL COLEGIAL

    MENU PRINCIPAL:

       1.  ***>>>  LEE tu Correo Electronico en   https://home.uprm.edu
       2.  Seleccion de Secciones  (Matricula)
       3.  Modificar Codigo de Acceso Permanente
       4.  Informacion Correo Electronico
       5.  Ver otra informacion
       6.  Seleccion de Modalidad Pass/Fail




       0.  SALIR DEL SISTEMA


Opcion deseada:`,
    "2": {
        "main": `04/jun/2020              Universidad de Puerto Rico                      2:47 pm
                     RECINTO UNIVERSITARIO DE MAYAGÜEZ
                           E S T U D I A N T E

              --------------------------------------------------
              |                                                |
              |   Número Identificación       :                |
              |       Ej. 802999999                            |
              |                                                |
              |   Código de Acceso Permanente :                |
              |       Ej. 1234                                 |
              |                                                |
              |   Seguro Social               :                |
              |       Ej. 1234  (Últimos 4)                    |
              |                                                |
              |   Fecha Nacimiento            :                |
              |       Ej. MMDDAAAA                             |
              |                                                |
              --------------------------------------------------
              << NO oprimir tecla <Enter> al entrar los datos >>
                                      [PF1=(6)Refrescar Pantalla   PF4=(9)Fin]`
    },
    "5": {
        "main": `                          UNIVERSIDAD DE PUERTO RICO
                      Recinto Universitario de Mayaguez
03/jun/2020                                                             6:41 pm
                         SISTEMA ESTUDIANTIL COLEGIAL

    MENU DESPLIEGUE:  (Ver otra informacion)

       1.  Evaluacion certificacion #4
       2.  Curriculo
       3.  Evaluo de facturacion de matricula
       4.  Matricula
       5.  Turno de seleccion de cursos/secciones o Examenes finales
       6.  Horario de cursos disponibles en Matricula
       7.  Titulo de cursos disponibles en Horario
       8.  Horario de matricula grafico
       9.  Evaluo de matricula e indicadores

       0.  Finalizar


Opcion deseada:`
    }
}


var current_menu = ["main"];
container.innerText = menus["main"];