// Thanks to http://patorjk.com/software/taag/ for the ASCII art
// Thank you https://es6console.com/ for transforming the JS
// Thank you https://jscompress.com/ for compressing the JS
// Thank you https://www.outsystems.com/blog/javascript-events-unmasked-how-to-create-input-mask-for-mobile.html for helping me understand the input mask problems and https://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript for helping me solve the problem
// Thank you https://validatejavascript.com/ for helping me find problems with the code

/***
 *      _____              __            __        ____      _   __         _      __   __
 *     / ___/__  ___  ___ / /____ ____  / /____   / __/___  | | / /__ _____(_)__ _/ /  / /__ ___
 *    / /__/ _ \/ _ \(_-</ __/ _ `/ _ \/ __(_-<   > _/_ _/  | |/ / _ `/ __/ / _ `/ _ \/ / -_|_-<
 *    \___/\___/_//_/___/\__/\_,_/_//_/\__/___/  |_____/    |___/\_,_/_/ /_/\_,_/_.__/_/\__/___/
 *
 */
const absolute_height = 24;
const absolute_width = 80;
// const body = document.getElementsByTagName("body")[0];
const container = document.getElementById("container");
const input = document.getElementsByTagName("input")[0];
const enrollment_dates = {
  "1er Sem": "4/may/2019",
  "2do Sem": "23/nov/2019",
  "1er Verano": "4/may/2019"
};
const default_user_name = "Juan del Pueblo Rodríguez";

var selected_term = "";
var credits_selected = 0;
var student_number = "(802)00-0000";
var course_list = {};
var selected_courses = {
  "1er Sem": [],
  "2do Sem": [
    cursos_2do_sem_2019["INGE3016-020"],
    cursos_2do_sem_2019["FISI3171-061"],
    cursos_2do_sem_2019["FISI3173-086"],
    cursos_2do_sem_2019["QUIM3132-050"],
    cursos_2do_sem_2019["QUIM3134-06R"],
    cursos_2do_sem_2019["INGL3212-101"],
    cursos_2do_sem_2019["MATE3063-081"]

  ],
  "1er Verano": [
    cursos_1er_verano_2020["MATE4009-01A"]
  ]
};

/***
 *       __ __    __               ____              __  _
 *      / // /__ / /__  ___ ____  / __/_ _____  ____/ /_(_)__  ___  ___
 *     / _  / -_) / _ \/ -_) __/ / _// // / _ \/ __/ __/ / _ \/ _ \(_-<
 *    /_//_/\__/_/ .__/\__/_/   /_/  \_,_/_//_/\__/\__/_/\___/_//_/___/
 *              /_/
 */

function centralize(string, width = absolute_width, character = " ") {
  string = string.toString().trim();
  width = parseInt(width);

  return character.repeat((width - string.length) / 2) + string;
}


function pad_right(string, width = absolute_width, character = " ") {
  string = string.toString().trim();
  width = parseInt(width);

  return string + character.repeat(width - string.length);
}

function pad_left(string, width = absolute_width, character = " ") {
  string = string.toString().trim();
  width = parseInt(width);

  return character.repeat(width - string.length) + string;
}


function parse_itinerary(string) {
  let start_time = "";
  let end_time = "";
  let days = "";
  string = string.toLowerCase().trim();

  let match = string.match(/(\d\d?:\d\d (?:am|pm))/g);
  start_time = match[0];
  end_time = match[1];

  match = string.match(/([lmwjvsd]{1,5}$)/g);
  days = match[0];

  start_time = new Date(`January 1, 2000 ${start_time}`);
  end_time = new Date(`January 1, 2000 ${end_time}`);

  return [start_time, end_time, days];
}

function add_course(object) {
  let conflicts = false;

  // Iterate through list of itineraries. End loop early if it conflicts
  const l0 = object["horario"].length;
  for (let i = 0; i < l0 && !conflicts; i++) {
    const itinerary = object["horario"][i];
    const [start_time, end_time, days] = parse_itinerary(itinerary);

    let this_terms_courses = selected_courses[selected_term];

    // Iterate through list of selected courses. End early if it conflicts
    const l1 = this_terms_courses.length;
    for (let j = 0; j < l1 && !conflicts; j++) {

      // Iterate through list of itineraries for selected course
      const l2 = this_terms_courses[j]["horario"].length;
      for (let k = 0; k < l2 && !conflicts; k++) {

        const [selected_course_start, selected_course_end, selected_course_days] = parse_itinerary(this_terms_courses[j]["horario"][k]);

        // Check if itinerary is for same day. End loop early if same day
        let same_day = false;

        for (let c = 0; c < days.length && !same_day; c++) {
          if (selected_course_days.includes(days[c])) {
            same_day = true;
          }
        }

        // This course ends after another starts and starts before another ends
        if ((end_time > selected_course_start && start_time < selected_course_end) && same_day) {
          conflicts = true;
        }
      }
    }
  }

  // Check conditions to add course
  if (!conflicts) {
    selected_courses[selected_term].push(object);

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
      month = "ene";
      break;
    case 1:
      month = "feb";
      break;
    case 2:
      month = "mar";
      break;
    case 3:
      month = "abr";
      break;
    case 4:
      month = "may";
      break;
    case 5:
      month = "jun";
      break;
    case 6:
      month = "jul";
      break;
    case 7:
      month = "ago";
      break;
    case 8:
      month = "sep";
      break;
    case 9:
      month = "oct";
      break;
    case 10:
      month = "nov";
      break;
    case 11:
      month = "dec";
      break;
  }

  if (hours > 12) {
    am_pm = "pm";
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  day = pad_left(day, 2, "0");
  hours = pad_left(hours, 2, " ");
  minutes = pad_left(minutes, 2, "0");

  // Prepend spaces to title in order to centralize it
  title = centralize(title, absolute_width)

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

  if (typeof object.body === "function") {
    screen = `${object.header()}\n${object.body()}`;
  } else if (typeof object.body === "string") {
    screen = `${object.header()}\n${object.body}`;
  }

  // Add newlines until already at desired height
  while (screen.match(/\n/g).length < desired_height) {
    screen += "\n";
  }

  if (typeof object.footer === "function") {
    screen += object.footer();
  } else if (typeof object.footer === "string") {
    screen += object.footer;
  }

  container.innerHTML = screen;
}

/***
 *       ____                       ____  __     _         __
 *      / __/__________ ___ ___    / __ \/ /    (_)__ ____/ /____
 *     _\ \/ __/ __/ -_) -_) _ \  / /_/ / _ \  / / -_) __/ __(_-<
 *    /___/\__/_/  \__/\__/_//_/  \____/_.__/_/ /\__/\__/\__/___/
 *                                         |___/
 */
var main_menu = {
  header: function () {
    return header("SISTEMA ESTUDIANTIL COLEGIAL", true);
  },

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

  refresh: function () {
    this.handle_input(null);
  },

  handle_input: function (key) {
    switch (key) {
      case "1":
        current_menu = main_menu_default;
        main_menu_default.message_key = 1;
        main_menu_default.last_menu = main_menu;
        current_menu.refresh();
        break;

      case "2":
        current_menu = menu_2;
        current_menu.refresh();
        break;

      case "3":
        current_menu = main_menu_default;

        main_menu_default.message_key = 3;
        main_menu_default.last_menu = main_menu;
        current_menu.refresh();
        break;

      case "4":
        current_menu = main_menu_default;
        main_menu_default.message_key = 4;
        main_menu_default.last_menu = main_menu;
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


var main_menu_default = {
  last_menu: main_menu,
  message_key: 3,
  messages: {
    "1": `leer y ver información        <span class='white-background'>!</span>
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!</span>          de su correo electrónico dándole click a "Gmail"            <span class='white-background'>!</span>`,

    "4": `leer y ver información        <span class='white-background'>!</span>
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!</span>          de su correo electrónico dándole click a "Gmail"            <span class='white-background'>!</span>`,

    "3": `modificar su código de        <span class='white-background'>!</span>
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!</span>      acceso permanente dándole click a "My Profile" y luego al       <span class='white-background'>!</span>
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!</span>             botón etiquetado "PIN" en la barra superior              <span class='white-background'>!</span>`,
    "9": `registrarse en la lista       <span class='white-background'>!</span>
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!</span>            de espera para el curso deseado. Dele click a             <span class='white-background'>!</span>
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!</span>         "Services for Students", luego a "Lista de Espera"           <span class='white-background'>!</span>`
  },

  header: function () {
    return header("SISTEMA ESTUDIANTIL COLEGIAL", true);
  },

  body: function () {
    return `
       <span class='white-background'>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</span>
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!</span>         Esta opción no está disponible a través de PuTTY             <span class='white-background'>!</span>
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!</span>   Si desea realizar esta operación vaya a <a href="https://home.uprm.edu">https://home.uprm.edu</a> y    <span class='white-background'>!</span>
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!</span>      Una vez ingrese a su cuenta podrá ${
      this.messages[this.message_key]
      }
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!</span>                                                                      <span class='white-background'>!</span>
       <span class='white-background'>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</span>`;
  },

  footer:
    " ".repeat(22) + "&lt;&lt;Presione cualquier tecla para salir&gt;&gt;",

  refresh: function () {
    display(this, absolute_height - 4);
  },

  handle_input: function (key) {
    current_menu = this.last_menu;
    current_menu.refresh();
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
  user_name: "",
  buffer: "",
  header: function () {
    return header("E S T U D I A N T E", true);
  },

  body: function () {
    return `
${this.user_name}
              --------------------------------------------------
              |                                                |
              |   Número Identificación       : ${
      this.current_operation === 0 || !this.lines[0].match(/_/g)
        ? this.lines[0]
        : "            "
      }   |
              |       Ej. 802999999                            |
              |                                                |
              |   Código de Acceso Permanente : ${
      this.current_operation === 1 || !this.lines[1].match(/_/g)
        ? this.lines[1]
        : "            "
      }   |
              |       Ej. 1234                                 |
              |                                                |
              |   Seguro Social               : ${
      this.current_operation === 2 || !this.lines[2].match(/_/g)
        ? this.lines[2]
        : "            "
      }   |
              |       Ej. 1234  (Últimos 4)                    |
              |                                                |
              |   Fecha Nacimiento            : ${
      this.current_operation === 3 || !this.lines[3].match(/_/g)
        ? this.lines[3]
        : "            "
      }   |
              |       Ej. MMDDAAAA                             |
              |                                                |
              --------------------------------------------------
${centralize("<<  NO oprimir tecla <Enter> al entrar los datos  >>", 85)}`;
  },

  footer: `${" ".repeat(35)}<span class='white-background'> [PF1=(6)Refrescar Pantalla    PF4=(9)Fin] </span>`,

  refresh: function () {
    this.handle_input(null);
  },

  handle_input: function (key) {
    let changed_menu = false;

    // If is not <Enter>
    if (typeof key === "string" && key !== "Enter") {
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
          this.lines[0] = this.buffer + " ".repeat(12 - this.buffer.length);
          this.lines[0] = `<span class="underline">${this.lines[0]}</span>`;

          if (this.buffer.length === 9) {
            if (this.buffer.match(/^\d{9}$/g)) {
              this.lines[0] = `<span class="white-background">(${this.buffer.slice(0, 3)})${this.buffer.slice(
                3,
                5
              )}-${this.buffer.slice(5, 10)}</span>`;
              this.buffer = "";
              this.current_operation = 1;
              student_number = this.lines[0].trim();
              this.user_name = centralize(`<span class="white-background"> ${default_user_name.toUpperCase()} </span>`, 80 + 39);
            } else {
              this.buffer = "";
              this.lines[0] = "_".repeat(12);
              // DATOS ENTRADOS NO SON CORRECTOS
            }
          }
          break;

        case 1:
        case 2:
          if (this.buffer.length === 4) {
            if (this.buffer.match(/^\d{4}$/g)) {
              this.lines[this.current_operation] = "<span class='white-background'>****</span>" + " ".repeat(8);
              this.current_operation += 1;
              this.buffer = "";
            } else {
              this.buffer = "";
              this.lines[this.current_operation] = "_".repeat(12);
            }
          }
          break;
        case 3:
          this.lines[3] = "<span class='underline'>" + this.buffer + " ".repeat(12 - this.buffer.length) + "</span>";

          if (this.buffer.length === 8) {
            if (this.buffer.match(/^\d{8}$/g)) {
              current_menu = term_selection;
              current_menu.refresh();
              changed_menu = true;
            } else {
              this.buffer = "";
              this.lines[3] = "_".repeat(12);
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
      student_number = this.lines[0].trim();
      this.lines = Array(4).fill("____________");
      this.current_operation = 0;
      this.buffer = "";

      // if not, we can update the screen
    } else {
      display(this, absolute_height - 1);
    }
  }

};


var term_selection = {
  header: function () {
    return header("M A T R I C U L A", true);
  },

  body: "",

  footer: `Indique Semestre  1=1er Sem,   2=2do Sem,   3=1er Verano o Verano Extendido
                  S=salir`,

  refresh: function () {
    this.handle_input(null);
  },

  handle_input: function (key) {
    switch (key) {
      case "S":
      case "s":
        current_menu = main_menu;
        current_menu.refresh();
        break;
      case "1":
        course_list = cursos_1er_sem_2020;
        selected_term = "1er Sem";
        current_menu = alta_bajas_cambio;
        current_menu.refresh();
        break;
      case "2":
        course_list = cursos_2do_sem_2019;
        selected_term = "2do Sem";
        current_menu = alta_bajas_cambio;
        current_menu.refresh();
        break;
      case "3":
        // Merge verano 1 and verano extendido courses
        Object.assign(course_list, cursos_1er_verano_2020, cursos_verano_extendido_2020);
        selected_term = "1er Verano";
        current_menu = alta_bajas_cambio;
        current_menu.refresh();
        break;
      default:
        display(this, absolute_height - 2);
    }
  }

};


var alta_bajas_cambio = {
  mode: 0,
  buffer: "",
  user_name: "",
  body_list: "",
  footer_text: "",
  choosing_section: false,
  right_panel: [],
  potential_courses: [],

  reset_screen: function (partial = false) {
    this.buffer = "";
    this.body_list = "";
    this.user_name = "";
    this.choosing_section = false;
    this.right_panel = [];
    this.footer_text = "";
    if (!partial) {
      this.mode = 0;
      this.potential_courses = [];
      this.footer = this.default_footer;
    }
  },

  header: function () {
    return header(`SELECCIÓN DE SECCIONES ${selected_term} ESTUDIANTE`, false);
  },

  body: function () {
    return ` ${student_number}  ${this.user_name + " ".repeat(25 - this.user_name.length)}       0000-0  00 ${enrollment_dates[selected_term]} Crs. TTY
                                                           2:00 pm    ${credits_selected}   04
     C U R S O   Sección  Cr. Grado
${this.body_list}`;
  },

  default_footer: `Indique:   A=Alta  B=Baja  C=Cambio  L=ListaEspera  H=HorEst  p=EvalúoPago
           M=MatEvalúo  F=HorEstGráfico  O=CódigoReservar S=Salir`,

  action_footer: function () {
    return `${centralize(this.footer_text, 80)}
Abreviatura y número de curso  o  FIN                                  [${this.mode === 1 ? "Altas" : this.mode === 2 ? "Bajas" : "Cambio"}]
<span class="underline">${pad_right(this.buffer, 10)}</span>`;
  },

  section_footer: function () {
    return `${centralize(this.footer_text, 80)}
Sección seleccionada, (PF3=(8)Secciones Disponibles  CAN=Regresar)
<span class="underline">${pad_right(this.buffer, 10)}</span>`;

  },

  footer: "",

  refresh: function () {
    this.user_name = default_user_name.toUpperCase();
    this.body_list = "";

    // Print list of selected courses
    for (let i = 1; i <= 12; i++) {
      this.body_list += centralize(i.toString(), 3) + ".  ";
      if (selected_courses[selected_term].length > i - 1) {
        const course = selected_courses[selected_term][i - 1];
        this.body_list += `${pad_right(course["codificacion"], 10)}   ${pad_right(course["seccion"], 8)} ${pad_right(course["creditos"], 4)} ${course["grado"] === "Sub-graduados" ? "S" : "G"}   █`;
      }

      // Also potentially print right panel
      if (this.right_panel[i - 1] !== undefined) {
        const lines = this.body_list.split(/\n/g);
        const last_line = lines.length - 1;
        this.body_list += " ".repeat(41 - lines[last_line].length) + this.right_panel[i - 1];
      }
      this.body_list += '\n';
    }



    this.handle_input(null);
  },

  handle_input: function (key) {

    switch (this.mode) {
      case 0:
        switch (key) {
          case "S":
          case "s":
            this.reset_screen();
            current_menu = term_selection;
            current_menu.refresh();
            // Force return. Otherwise the display at the bottom will force the screen to remain in this menu

            return;
          case "L":
          case "l":
          case "O":
          case "o":
            this.reset_screen();
            current_menu = main_menu_default;
            main_menu_default.message_key = 9;
            main_menu_default.last_menu = alta_bajas_cambio;
            current_menu.refresh()

            return;
          case "A":
          case "a":
            this.mode = 1;
            this.refresh();
            break;
          case "B":
          case "b":
            this.mode = 2;
            this.refresh();
            break;
          case "C":
          case "c":
            this.mode = 3;
            this.refresh();
            break;
          default:
            this.footer = this.default_footer;
        }
        break;
      case 1:
      case 2:
      case 3:
        if (this.choosing_section) {
          this.footer = this.section_footer;
        } else {
          this.footer = this.action_footer;
        }

        if (typeof key === "string" && key !== "Enter") {
          // If <Backspace> or <Delete> are pressed
          if (key === "Backspace" || key === "Delete") {
            this.buffer = this.buffer.slice(0, -1);
          } else if (key.length === 1 && this.buffer.length < 10) {
            // Exclude any other keys like <AltGr> and such from being added to buffer
            this.buffer += key;
          }

          this.refresh();


        } else if (typeof key === "string" && (key === "Enter" || key === "\n")) {
          if (this.buffer.trim().toLowerCase() === "fin") {
            this.reset_screen();


            // If the buffer looks like a course code and is doing "altas" and not choosing sections
          } else if (this.buffer.match(/[A-Za-z]{4}\d{4}/g) && this.mode === 1 && !this.choosing_section) {

            // Filter potential courses
            this.potential_courses = Object.keys(course_list).filter((k) => k.startsWith(this.buffer.trim().toUpperCase()));

            // Prepare right panel if there are multiple potential courses
            if (this.potential_courses.length > 0) {
              this.right_panel = [
                "SECCIONES DISPONIBLE CURSO: " + course_list[this.potential_courses[0]]["codificacion"],
                ""
              ];

              // Add course sections to right panel
              for (let i = 0; i < this.potential_courses.length; i++) {
                const last_index = this.right_panel.length - 1;
                if (this.right_panel[last_index].length < 40) {
                  this.right_panel[last_index] += course_list[this.potential_courses[i]]["seccion"] + "  ";
                } else {
                  this.right_panel.push(`${course_list[this.potential_courses[i]]["seccion"]}  `);
                }
              }

              this.choosing_section = true;
              this.buffer = "";
              this.footer = this.section_footer;

              // If there are no potential courses, warn the user
            } else {
              this.right_panel = [
                "CURSO NO ENCONTRADO"
              ];
              this.buffer = "";
            }
          }
          // If is choosing sections and there are potential courses
          else if (this.choosing_section && this.potential_courses.length > 0 && this.buffer.length > 0 && this.mode !== 3) {

            // If user wants to cancel ...
            if (this.buffer.toLowerCase() === "can") {
              this.reset_screen();

            } else {

              // Try to add course
              for (let i = 0; i < this.potential_courses.length; i++) {
                if (course_list[this.potential_courses[i]]["seccion"] === this.buffer.toUpperCase().trim()) {
                  if (add_course(course_list[this.potential_courses[i]])) {
                    credits_selected += course_list[this.potential_courses[i]]["creditos"];
                    this.reset_screen(true);
                  } else {
                    this.footer_text = "Horario de este curso conflige con otro";
                    this.buffer = "";
                  }

                  break;
                }
              }
            }

          }
          // If buffer is a plausible number to delete by index and is doing "bajas"
          else if (this.buffer.match(/^\d{1,2}$/g) && this.mode === 2) {
            if (1 <= parseInt(this.buffer) && parseInt(this.buffer) <= selected_courses[selected_term].length) {
              selected_courses[selected_term].splice(parseInt(this.buffer) - 1, 1);
              this.reset_screen(true);
            }
            else {
              this.footer_text = "Curso solicitado está en BLANCO";
              this.buffer = "";
            }
          }
          // If buffer looks like a course code and is doing "bajas"
          else if (this.buffer.match(/[A-Za-z]{4}\d{4}/g) && this.mode === 2) {
            let found_course = false;
            for (let i = 0; i < selected_courses[selected_term].length && !found_course; i++) {
              if (selected_courses[selected_term][i]["codificacion"] === this.buffer.trim().toUpperCase()) {
                selected_courses[selected_term].splice(i, 1);
                this.reset_screen(true)
                found_course = true;
              }
            }

            if (!found_course) {
              this.footer_text = "Curso NO existe en matrícula";
              this.buffer = "";
            }
          }



          // CAMBIO
          else if (this.mode === 3) {
            if (this.course_code === undefined) {
              this.course_code = "";
              this.selected_course_index = -1;
            }

            // Extract course code and index for the course to be changed
            if (this.buffer.match(/[A-Za-z]{4}\d{4}/g) && this.course_code === "") {
              for (let i = 0; i < selected_courses[selected_term].length && this.course_code === ""; i++) {
                if (selected_courses[selected_term][i]["codificacion"] === this.buffer.trim().toUpperCase()) {
                  this.course_code = this.buffer.trim().toUpperCase();
                  this.selected_course_index = i;
                  this.buffer = "";
                }
              }

              if (this.course_code === "") {
                this.footer_text = "Curso NO existe en matrícula";
                this.buffer = "";
                this.course_code = "";
                this.selected_course_index = -1;
              }
            }


            else if (this.buffer.match(/^\d{1,2}$/g) && this.course_code === "") {
              if (1 <= parseInt(this.buffer) && parseInt(this.buffer) <= selected_courses[selected_term].length) {
                this.selected_course_index = parseInt(this.buffer) - 1;
                this.course_code = selected_courses[selected_term][this.selected_course_index]["codificacion"];
                this.reset_screen(true);

              }
              else {
                this.footer_text = "Curso solicitado está en BLANCO";
                this.buffer = "";
                this.course_code = "";
                this.selected_course_index = -1;
              }
            }

            if (this.course_code !== "") {

              // If user wants to cancel ...
              if (this.buffer.toLowerCase() === "can") {
                this.reset_screen();
                this.course_code = "";
                this.selected_course_index = -1;

              } else {


                if (this.potential_courses.length === 0) {
                  // Filter potential courses
                  this.potential_courses = Object.keys(course_list).filter((k) => k.startsWith(this.course_code.trim().toUpperCase()));

                  // Prepare right panel if there are multiple potential courses
                  if (this.potential_courses.length > 0) {
                    this.right_panel = [
                      "SECCIONES DISPONIBLE CURSO: " + course_list[this.potential_courses[0]]["codificacion"],
                      ""
                    ];

                    // Add course sections to right panel
                    for (let i = 0; i < this.potential_courses.length; i++) {
                      const last_index = this.right_panel.length - 1;
                      if (this.right_panel[last_index].length < 40) {
                        this.right_panel[last_index] += course_list[this.potential_courses[i]]["seccion"] + "  ";
                      } else {
                        this.right_panel.push(`${course_list[this.potential_courses[i]]["seccion"]}  `);
                      }
                    }

                    this.buffer = "";
                    this.choosing_section = true;

                    // If there are no potential courses, warn the user
                  } else if (this.potential_courses.length === 0) {
                    this.footer_text = "Curso no GRADO";
                    this.buffer = "";
                  }
                }

                if (this.potential_courses.length > 1 && this.buffer.length > 0) {
                  // Try to add course
                  for (let i = 0; i < this.potential_courses.length; i++) {
                    if (course_list[this.potential_courses[i]]["seccion"] === this.buffer.toUpperCase().trim()) {
                      if (add_course(course_list[this.potential_courses[i]])) {
                        selected_courses[selected_term].splice(this.selected_course_index, 1)
                        this.course_code = "";
                        this.selected_course_index = -1;
                        this.potential_courses = [];
                        this.reset_screen(true);
                      } else {
                        this.footer_text = "Horario de este curso conflige con otro";
                        this.buffer = "";
                      }

                      break;
                    }
                  }
                }
                else if (this.potential_courses.length === 1) {
                  this.footer_text = "No hay otras secciones disponibles";
                }
              }
            }
          }


          this.refresh();
        }

        break;

    }
    display(this, absolute_height - 5);
  }

};


/***
 *             __  ___                ____
 *            /  |/  /__ ___  __ __  / __/
 *           / /|_/ / -_) _ \/ // / /__ \
 *          /_/  /_/\__/_//_/\_,_/ /____/
 *
 */
var menu_5 = {
  header: function () {
    return header("SISTEMA ESTUDIANTIL COLEGIAL", true);
  },

  body: `
    MENU DESPLIEGUE: (Ver otra informacion)

       1.  Evaluacion certificacion #4
       2.  Curriculo
       3.  Evaluo de facturacion de matricula
       4.  Matricula
       5.  Turno de seleccion de cursos / secciones o Examenes finales
       6.  Horario de cursos disponibles en Matricula
       7.  Titulo de cursos disponibles en Horario
       8.  Horario de matricula grafico
       9.  Evaluo de matricula e indicadores

       0.  Finalizar`,

  footer: "Opcion deseada:",

  refresh: function () {
    this.handle_input(null);
  },

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
 *       __ __             __    ____      ____          __       ___  ____        _      __
 *      / // /__ ___ _____/ /_  / __/___  / __/__  __ __/ / ___  / _/ / __/_______(_)__  / /_
 *     / _  / -_) _ `/ __/ __/  > _/_ _/ _\ \/ _ \/ // / / / _ \/ _/ _\ \/ __/ __/ / _ \/ __/
 *    /_//_/\__/\_,_/_/  \__/  |_____/  /___/\___/\_,_/_/  \___/_/  /___/\__/_/ /_/ .__/\__/
 *                                                                               /_/
 */

const ua = navigator.userAgent;
let browser = "Unknown Browser";
let OSName = "Unknown OS";

if (ua.indexOf("Opera") !== -1) { browser = "Opera"; }
if (ua.indexOf("Firefox") !== -1 && ua.indexOf("Opera") === -1) { browser = "Firefox"; }
if (ua.indexOf("Chrome") !== -1) { browser = "Chrome"; }
if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) { browser = "Safari"; }
if (ua.indexOf("MSIE") !== -1 && (ua.indexOf("Opera") === -1 && ua.indexOf("Trident") === -1)) { browser = "Internet Explorer"; }
if (ua.indexOf("Trident") !== -1) { browser = "Internet Explorer"; }

if (ua.indexOf("Win") !== -1) { OSName = "Windows"; }
if (ua.indexOf("Mac") !== -1) { OSName = "Macintosh"; }
if (ua.indexOf("Linux") !== -1) { OSName = "Linux"; }
if (ua.indexOf("Android") !== -1) { OSName = "Android"; }
if (ua.indexOf("like Mac") !== -1) { OSName = "iOS"; }


// Use text input to handle inputs if browser is other than Firefox or Safari or is using phone OS
if ((browser !== "Firefox" && browser !== "Safari") && (OSName === "Android" || OSName === "iOS")) {
  input.addEventListener("input", function (event) {
    current_menu.handle_input(input.value);
    input.value = "";
  });
} else {
  document.addEventListener("keydown", function (event) {
    current_menu.handle_input(event.key);
    input.value = "";
  });
}



var current_menu = main_menu;
current_menu.refresh();

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*

object.body = `         <span class='white-background'>****************************************************************</span>
         <span class='white-background'>*</span>                                                              <span class='white-background'>*</span>
         <span class='white-background'>*</span>                                                              <span class='white-background'>*</span>
         <span class='white-background'>*</span>                                                              <span class='white-background'>*</span>
         <span class='white-background'>*</span>    Su TURNO  para  seleccion  de  cursos  y  secciones  o    <span class='white-background'>*</span>
         <span class='white-background'>*</span>                                                              <span class='white-background'>*</span>
         <span class='white-background'>*</span>    las  fechas   de  los  examenes  finales   los  podran    <span class='white-background'>*</span>
         <span class='white-background'>*</span>                                                              <span class='white-background'>*</span>
         <span class='white-background'>*</span>    ver a traves de  Mi Portal Colegial  en  home.uprm.edu    <span class='white-background'>*</span>
         <span class='white-background'>*</span>                                             -------------    <span class='white-background'>*</span>
         <span class='white-background'>*</span>                                                              <span class='white-background'>*</span>
         <span class='white-background'>*</span>                                                              <span class='white-background'>*</span>
         <span class='white-background'>*</span>                                                              <span class='white-background'>*</span>
         <span class='white-background'>*</span>                                                              <span class='white-background'>*</span>
         <span class='white-background'>****************************************************************</span>`;
         */
