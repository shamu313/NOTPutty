/***
 *      _____              __            __        ____      _   __         _      __   __
 *     / ___/__  ___  ___ / /____ ____  / /____   / __/___  | | / /__ _____(_)__ _/ /  / /__ ___
 *    / /__/ _ \/ _ \(_-</ __/ _ `/ _ \/ __(_-<   > _/_ _/  | |/ / _ `/ __/ / _ `/ _ \/ / -_|_-<
 *    \___/\___/_//_/___/\__/\_,_/_//_/\__/___/  |_____/    |___/\_,_/_/ /_/\_,_/_.__/_/\__/___/
 *
 */
const absolute_height = 24;
const body = document.getElementsByTagName("body")[0];
const container = document.getElementById("container");

var selected_term = "";


/***
 *       __ __    __               ____              __  _
 *      / // /__ / /__  ___ ____  / __/_ _____  ____/ /_(_)__  ___  ___
 *     / _  / -_) / _ \/ -_) __/ / _// // / _ \/ __/ __/ / _ \/ _ \(_-<
 *    /_//_/\__/_/ .__/\__/_/   /_/  \_,_/_//_/\__/\__/_/\___/_//_/___/
 *              /_/
 */
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
    title = " ".repeat((80 - title.length) / 2) + title.trim();

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

function display(object, desired_height) {

    let screen = "";

    if (typeof (object.body) === "function") {
        screen = `${object.header()}\n${object.body()}`;

    } else if (typeof (object.body) === "string") {
        screen = `${object.header()}\n${object.body}`;
    }

    // Add newlines until already at desired height
    while (screen.match(/\n/g).length < desired_height) {
        screen += '\n';
    }

    if (typeof (object.footer) === "function") {
        screen += object.footer();

    } else if (typeof (object.footer) === "string") {
        screen += object.footer;
    }


    container.textContent = screen;
}


/***
 *       ____                       ____  __     _         __
 *      / __/__________ ___ ___    / __ \/ /    (_)__ ____/ /____
 *     _\ \/ __/ __/ -_) -_) _ \  / /_/ / _ \  / / -_) __/ __(_-<
 *    /___/\__/_/  \__/\__/_//_/  \____/_.__/_/ /\__/\__/\__/___/
 *                                         |___/
 */
var main_menu = {
    header: function () { return header("SISTEMA ESTUDIANTIL COLEGIAL", true); },

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

    refresh: function () { this.handle_input(null); },

    handle_input: function (key) {

        switch (key) {
            case "2":
                current_menu = menu_2;
                current_menu.refresh();
                break;
            case "5":
                current_menu = menu_5;
                current_menu.refresh();
                break;
            default:
                display(this, absolute_height - 4);
        }

    }
};

/***
 *             __  ___                ___
 *            /  |/  /__ ___  __ __  |_  |
 *           / /|_/ / -_) _ \/ // / / __/
 *          /_/  /_/\__/_//_/\_,_/ /____/
 *
 */
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

    refresh: function () { this.handle_input(null); },

    handle_input: function (key) {
        let changed_menu = false;

        // If is not <Enter>
        if (typeof (key) === "string" && key !== "Enter") {

            // If <Backspace> is pressed
            if (key === "Backspace" || key === "Delete") {
                this.buffer = this.buffer.slice(0, -1);

                // Exclude any other keys like <AltGr> and such from being added to buffer
            } else if (key.length === 1) {
                this.buffer += key;
            }

            // Validate inputs and/or go on to next input
            switch (this.current_operation) {
                case 0:
                    // lines[0] = buffer + " " * (12 - len(buffer))
                    this.lines[0] = this.buffer + " ".repeat(12 - this.buffer.length);


                    if (this.buffer.length === 9) {

                        if (this.buffer.match(/^\d{9}$/g)) {
                            this.lines[0] = `(${this.buffer.slice(0, 3)})${this.buffer.slice(3, 5)}-${this.buffer.slice(5, 10)}`
                            this.buffer = ""
                            this.current_operation = 1;
                        } else {
                            this.buffer = "";
                            this.lines[0] = "_".repeat(12)
                            // DATOS ENTRADOS NO SON CORRECTOS
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
                            current_menu = term_selection;
                            current_menu.refresh();
                            changed_menu = true;
                        } else {
                            this.buffer = "";
                            this.lines[3] = "_".repeat(12)
                        }
                    }
                    break;

            }

        } else if (key === "Enter" && this.buffer === "9") {
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
            display(this, absolute_height - 4);
        }

    }

};

var term_selection = {
    header: function () { return header("S E L E C C I Ó N  D E  S E C C I O N E S", true) },

    body: ``,

    footer: `Indique Semestre  1=1er Sem,   2=2do Sem,   3=1er Verano o Verano Extendido
                  S=salir`,

    refresh: function () { this.handle_input(null); },

    handle_input: function (key) {
        switch (key) {
            case "S":
            case "s":
                current_menu = main_menu;
                current_menu.refresh();
                break;
            case "1":
                selected_term = "1er Sem"
                current_menu = course_selection;
                current_menu.refresh();
                break;
            case "2":
                selected_term = "2do Sem"
                current_menu = course_selection;
                current_menu.refresh();
                break;
            case "3":
                selected_term = "1er Verano"
                current_menu = course_selection;
                current_menu.refresh();
                break;
            default:
                display(this, absolute_height - 2);
        }

    }
};

var course_selection = {
    header: function () { return header(`SELECCIÓN DE SECCIONES ${selected_term} ESTUDIANTE`, false) },

    body: `${menu_2.lines[0].trim()}  JUAN DEL PUEBLO RODRÍGUEZ        0507-1  23 10/ago/2019 Crs. TTY
                                                           2:00 pm    21   04
     C U R S O   Sección  Cr. Grado
 1.  ICOM 4015     100H    4    S   █
 2.  ICOM 4015 L   050L             █
 3.
 4.
 5.
 6.
 7.
 8.
 9.
10.
11.
12.`,

    footer: `Indique:   A=Alta  B=Baja  C=Cambio  L=ListaEspera  H=HorEst  p=EvalúoPago
           M=MatEvalúo  F=HorEstGráfico  O=CódigoReservar S=Salir`,

    refresh: function () { this.handle_input(null); },

    handle_input: function (key) {
        switch (key) {
            case "S":
            case "s":
                current_menu = main_menu;
                current_menu.refresh();
                break;
            default:
                display(this, absolute_height - 4);
        }

    }

}

/***
 *             __  ___                ____
 *            /  |/  /__ ___  __ __  / __/
 *           / /|_/ / -_) _ \/ // / /__ \
 *          /_/  /_/\__/_//_/\_,_/ /____/
 *
 */
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

    refresh: function () { this.handle_input(null); },

    handle_input: function (key) {
        switch (key) {
            case "0":
                current_menu = main_menu;
                current_menu.refresh();
                break;
            default:
                display(this, absolute_height - 4);
        }

    }
};


/***
 *       __ __             __                 __  ____          __       ___  ____        _      __
 *      / // /__ ___ _____/ /_  ___ ____  ___/ / / __/__  __ __/ / ___  / _/ / __/_______(_)__  / /_
 *     / _  / -_) _ `/ __/ __/ / _ `/ _ \/ _  / _\ \/ _ \/ // / / / _ \/ _/ _\ \/ __/ __/ / _ \/ __/
 *    /_//_/\__/\_,_/_/  \__/  \_,_/_//_/\_,_/ /___/\___/\_,_/_/  \___/_/  /___/\__/_/ /_/ .__/\__/
 *                                                                                      /_/
 */

document.addEventListener("keydown", function (event) {
    current_menu.handle_input(event.key);
});


var current_menu = main_menu;
current_menu.refresh();