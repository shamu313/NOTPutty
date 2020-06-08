// Thanks to https://keycode.info/ for helping so much with keycode assignments

const absolute_height = 24;
const body = document.getElementsByTagName("body")[0];
const container = document.getElementById("container");

function isStringKeyCode(keyCode) {
    if (keyCode === 8 || keyCode === 9 || keyCode === 13 || (32 <= keyCode && keyCode <= 126)) {
        return true;
    } else {
        return false;
    }
}

function header(title, long = true) {
    const today = new Date(Date.now());
    const year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let am_pm = "am";

    // Preprocessing ...
    switch (month) {
        case 0:
            month = 'ene';
            break;
        case 1:
            month = 'feb';
            break;
        case 2:
            month = 'mar';
            break;
        case 3:
            month = 'abr';
            break;
        case 4:
            month = 'may';
            break;
        case 5:
            month = 'jun';
            break;
        case 6:
            month = 'jul';
            break;
        case 7:
            month = 'ago';
            break;
        case 8:
            month = 'sep';
            break;
        case 9:
            month = 'oct';
            break;
        case 10:
            month = 'nov';
            break;
        case 11:
            month = 'dec';
            break;
    }

    if (hours > 12) {
        am_pm = "pm";
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    function pad_left(string, width = 2, padding = "0") {
        string = String(string).trim();
        width = parseInt(width);
        while (string.length < width) {
            string = padding + string;
        }
        return string;
    }


    day = pad_left(day);
    hours = pad_left(hours, 2, " ");
    minutes = pad_left(minutes);

    // Prepend spaces to title in order to centralize it
    title = title.trim();
    for (let c = 0; c < parseInt(Math.floor((80 - title.length - 2), 2)); c++) {
        title = " " + title;
    }

    // Compose time and date
    const time = `${hours}:${minutes} ${am_pm}`;
    const date = `${day}/${month}/${year}`;

    // Actually compose and return header;
    if (long) {
        const output = `                         UNIVERSIDAD DE PUERTO RICO
                      Recinto Universitario de Mayagüez
${date}                                                             ${time}
${title}`;
        return output;
    } else {
        const output = `${date}         U.P.R. - Recinto Universitario de Mayagüez         ${time}
${title}`;
        return output;
    }

}


var main_menu = {
    header: function () { return header("SISTEMA ESTUDIANTIL COLEGIAL", true) },

    body: `
    MENU PRINCIPAL:

       1.  ***>>>  LEE tu Correo Electronico en   https://home.uprm.edu
       2.  Seleccion de Secciones  (Matricula)
       3.  Modificar Codigo de Acceso Permanente
       4.  Informacion Correo Electronico
       5.  Ver otra informacion
       6.  Seleccion de Modalidad Pass/Fail




       0.  SALIR DEL SISTEMA`,

    footer: "Opcion deseada:",

    handle_input: function (keyCode) {
        keyCode = Number(keyCode);
        switch (keyCode) {
            case 50:
                current_menu = menu_2;
                current_menu.handle_input(0);
                break;
            case 53:
                current_menu = menu_5;
                current_menu.handle_input(0);
                break;
            default:
                let output = `${this.header()}\n${this.body}`;
                // Add newlines until already at desired height
                while (output.match(/\n/g).length < absolute_height - 4) {
                    output += '\n';
                }
                output += this.footer;

                container.textContent = output;
        }

    }
};

var menu_2 = {
    lines: Array(4).fill("____________"),
    current_operation: 0,
    buffer: "",
    header: function () { return header("E S T U D I A N T E", true) },

    body: function () {
        return `
              --------------------------------------------------
              |                                                |
              |   Número Identificación       : ${this.current_operation === 0 || !this.lines[0].match(/_/g) ? this.lines[0] : "            "}   |
              |       Ej. 802999999                            |
              |                                                |
              |   Código de Acceso Permanente : ${this.current_operation === 1 || !this.lines[1].match(/_/g) ? this.lines[1] : "            "}   |
              |       Ej. 1234                                 |
              |                                                |
              |   Seguro Social               : ${this.current_operation === 2 || !this.lines[2].match(/_/g) ? this.lines[2] : "            "}   |
              |       Ej. 1234  (Últimos 4)                    |
              |                                                |
              |   Fecha Nacimiento            : ${this.current_operation === 3 || !this.lines[3].match(/_/g) ? this.lines[3] : "            "}   |
              |       Ej. MMDDAAAA                             |
              |                                                |
              --------------------------------------------------`},

    footer: `${" ".repeat(69)}[6=Pantalla\n${" ".repeat(70)}9=Fin    ]`,

    handle_input: function (keyCode) {
        let changed_menu = false;

        // If is not <Enter>
        if (keyCode !== 13 && isStringKeyCode(keyCode)) {

            // If <Backspace> is pressed
            if (keyCode === 8) {
                this.buffer = this.buffer.slice(0, -1);
            } else {
                this.buffer += String.fromCharCode(keyCode);
            }

            // Validate inputs and/or go on to next input
            switch (this.current_operation) {
                case 0:
                    this.lines[0] = this.buffer + " ".repeat(12 - this.buffer.length);

                    if (this.buffer.length === 9) {

                        if (this.buffer.match(/^\d{9}$/g)) {
                            this.lines[0] = `(${this.buffer.slice(0, 3)})${this.buffer.slice(3, 5)}-${this.buffer.slice(5, 10)}`
                            this.current_operation = 1;
                            this.buffer = ""
                        } else {
                            this.buffer = "";
                            this.lines[0] = "_".repeat(12)
                        }
                    }
                    break;
                case 1:
                case 2:
                    if (this.buffer.length === 4) {
                        if (this.buffer.match(/^\d{4}$/g)) {
                            this.lines[this.current_operation] = "****" + " ".repeat(8);
                            this.current_operation += 1;
                            this.buffer = ""
                        } else {
                            this.buffer = "";
                            this.lines[this.current_operation] = "_".repeat(12)
                        }
                    }
                    break;
                case 3:
                    this.lines[3] = this.buffer + " ".repeat(12 - this.buffer.length);

                    if (this.buffer.length === 8) {

                        if (this.buffer.match(/^\d{8}$/g)) {
                            current_menu = main_menu;
                            current_menu.handle_input(0);
                            changed_menu = true;
                        } else {
                            this.buffer = "";
                            this.lines[3] = "_".repeat(12)
                        }
                    }
                    break;

            }

        } else if (keyCode === 13 && this.buffer === "9") {
            current_menu = main_menu;
            current_menu.handle_input(0);
            changed_menu = true;
        }


        // If the menu was changed throughout the previous processes ...
        if (changed_menu) {
            this.lines = Array(4).fill("____________");
            this.current_operation = 0;
            this.buffer = "";

            // if not, we can update the screen
        } else {
            let output = `${this.header()}\n${this.body()}`;
            // Add newlines until already at desired height
            while (output.match(/\n/g).length < absolute_height - 4) {
                output += '\n';
            }
            output += this.footer;

            container.textContent = output;
        }

    }

};

var menu_5 = {
    header: function () { return header("SISTEMA ESTUDIANTIL COLEGIAL", true) },

    body: `
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

       0.  Finalizar`,

    footer: "Opcion deseada:",

    handle_input: function (keyCode) {
        keyCode = Number(keyCode);
        switch (keyCode) {
            case 48:
                current_menu = main_menu;
                current_menu.handle_input(0);
                break;
            default:
                let output = `${this.header()}\n${this.body}`;
                // Add newlines until already at newline
                while (output.match(/\n/g).length < absolute_height - 4) {
                    output += '\n';
                }
                output += this.footer;

                container.textContent = output;
        }

    }
};



document.addEventListener("keydown", function (event) {
    current_menu.handle_input(event.keyCode);
});

var current_menu = main_menu;
current_menu.handle_input(0);