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
const container = document.getElementById("container");
const textarea = document.getElementsByTagName("textarea")[0];
const enrollment_dates = {
  "1er Sem": "4/may/2019",
  "2do Sem": "23/nov/2019",
  "1er Verano": "4/may/2019",
};

const alternativas_nombres = [
  "Yasuri Yamileth",
  "Juan del Pueblo Rodríguez",
  "Benito Antonio Martínez", //made it shorter to avoid weird spacing while centralizing tittle
  "Karen", // 😂
  "Bob Esponja", // Sponge Bob
  "Michael Scott", // The Office
  "Dwight Schrute", // The Office
  "Leslie Knope", // Parks and Recreation
  "Jake Peralta", // Brooklyn 99
];

const default_user_name =
  alternativas_nombres[Math.floor(Math.random() * alternativas_nombres.length)];

var cursos_1er_sem = {};
var cursos_verano = {};
var cursos_2do_sem = {};

var selected_term = "";
var credits_selected = 0;
var student_number = "(802)00-0000";
var buffer = "";
var potential_courses = "";
var course_list = {};
var course_exist = "";
var curso_deseado = "";
var array_potential_courses = [];
var selected_courses = {
  "1er Sem": [],
  "2do Sem": [
    // cursos_2do_sem_2019["INGE3016-020"],
    // cursos_2do_sem_2019["FISI3171-061"],
    // cursos_2do_sem_2019["FISI3173-086"],
    // cursos_2do_sem_2019["QUIM3132-050"],
    // cursos_2do_sem_2019["QUIM3134-06R"],
    // cursos_2do_sem_2019["INGL3212-101"],
    // cursos_2do_sem_2019["MATE3063-081"]
  ],
  "1er Verano": [
    // cursos_1er_verano_2020["MATE4009-01A"]
  ],
};

/***
 *       __ __    __               ____              __  _
 *      / // /__ / /__  ___ ____  / __/_ _____  ____/ /_(_)__  ___  ___
 *     / _  / -_) / _ \/ -_) __/ / _// // / _ \/ __/ __/ / _ \/ _ \(_-<
 *    /_//_/\__/_/ .__/\__/_/   /_/  \_,_/_//_/\__/\__/_/\___/_//_/___/
 *              /_/
 */

function centralize(string, width = absolute_width, character = " ") {
  string = string.toString();
  width = parseInt(width);

  // Only centralize if length of string allows to do so
  if (width > string.length) {
    let output = character.repeat((width - string.length) / 2) + string;
    output += character.repeat(width - output.length);
    return output;
  } else {
    return string;
  }
}

function pad_right(string, width = absolute_width, character = " ") {
  string = string.toString();
  width = parseInt(width);

  // Only pad if necessary
  if (width > string.length) {
    return string + character.repeat(width - string.length);
  } else {
    return string;
  }
}

function pad_left(string, width = absolute_width, character = " ") {
  string = string.toString();
  width = parseInt(width);

  // Only pad if necessary
  if (width > string.length) {
    return character.repeat(width - string.length) + string;
  } else {
    return string;
  }
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

  start_time = new Date(`March 13, 2001 ${start_time}`);
  end_time = new Date(`March 13, 2001 ${end_time}`);

  return [start_time, end_time, days];
}

function add_course(object) {
  let conflicts = false;

  // Iterate through list of itineraries. End loop early if it conflicts
  const l0 = object["horario"].length;
  for (let i = 0; i < l0 && !conflicts; i++) {
    const itinerary = object["horario"][i];
    const [start_time, end_time, days] = parse_itinerary(itinerary);

    const this_terms_courses = selected_courses[selected_term];

    // Iterate through list of selected courses. End early if it conflicts
    const l1 = this_terms_courses.length;
    for (let j = 0; j < l1 && !conflicts; j++) {
      // Iterate through list of itineraries for selected course
      const l2 = this_terms_courses[j]["horario"].length;
      for (let k = 0; k < l2 && !conflicts; k++) {
        const [
          selected_course_start,
          selected_course_end,
          selected_course_days,
        ] = parse_itinerary(this_terms_courses[j]["horario"][k]);

        // Check if itinerary is for same day. End loop early if same day
        let same_day = false;

        for (let c = 0; c < days.length && !same_day; c++) {
          if (selected_course_days.includes(days[c])) {
            same_day = true;
          }
        }

        // This course ends after another starts and starts before another ends
        if (
          end_time > selected_course_start &&
          start_time < selected_course_end &&
          same_day
        ) {
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

function format_date(date_object) {
  const year = date_object.getFullYear();
  let month = date_object.getMonth();
  let day = date_object.getDate();
  let hours = date_object.getHours();
  let minutes = date_object.getMinutes();
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
  } else if (hours === 12) {
    am_pm = "pm";
  }

  day = pad_left(day, 2, "0");
  hours = pad_left(hours, 2, " ");
  minutes = pad_left(minutes, 2, "0");

  // Compose time and date
  const time = `${hours}:${minutes} ${am_pm}`;
  const date = `${day}/${month}/${year}`;

  return [time, date];
}

function update_credits() {
  const courses = selected_courses[selected_term];
  credits_selected = 0;

  const l0 = courses.length;
  for (let i = 0; i < l0; i++) {
    credits_selected += courses[i]["creditos"];
  }
}

function get_json(url, callback) {
  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(JSON.parse(request.responseText));
    }
  };
  request.open("GET", url, true);
  request.send();
}

function header(title, long = true) {
  const today = new Date(Date.now());

  const [time, date] = format_date(today);

  title = centralize(title, absolute_width);

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

function truncate(str, n = 34) {
  if (str.length > n) {
    return str.substr(0, n - 1) + "…";
  } else {
    return str;
  }
}

function display(object, desired_height, exception = false) {
  let screen = "";

  let body = "";
  if (typeof object.body === "function") {
    body = object.body();
  } else if (typeof object.body === "string") {
    body = object.body;
  }

  if (!exception) {
    let lines = body.split("\n");
    for (let i = 0, l0 = lines.length; i < l0; i++) {
      const line = lines[i];
      truncate(line, absolute_width);
    }
  }

  screen = `${object.header()}\n${body}`;

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
function WhiteSpace_counter(string) {
  counter_WhiteSpace = 0;
  for (i = 0; i < string.length; ++i) {
    if (string[i] == " ") {
      counter_WhiteSpace++;
    }
    console.log(counter_WhiteSpace);
  }
  return counter_WhiteSpace;
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
  },
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
       <span class='white-background'>!</span>         "Services for Students", luego a "Lista de Espera"           <span class='white-background'>!</span>`,
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
  },
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
    return `${this.user_name}
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

  footer: `${" ".repeat(
    35
  )}<span class='white-background'> [PF1=(6)Refrescar Pantalla    PF4=(9)Fin] </span>`,

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
            if (this.buffer.match(/^\d{9}$/)) {
              this.lines[0] =
                "<span class='white-background'>(" +
                this.buffer.slice(0, 3) +
                ")" +
                this.buffer.slice(3, 5) +
                "-" +
                this.buffer.slice(5, 10) +
                "</span>";

              this.buffer = "";

              // Change line from line 1 to 2
              this.current_operation = 1;

              student_number = this.lines[0].trim();

              this.user_name = centralize(
                `<span class="white-background"> ${default_user_name.toUpperCase()} </span>`,
                80 + 39
              );
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
              this.lines[this.current_operation] =
                "<span class='white-background'>****</span>" + " ".repeat(8);

              this.current_operation += 1;

              this.buffer = "";
            } else {
              this.buffer = "";
              this.lines[this.current_operation] = "_".repeat(12);
            }
          }
          break;
        case 3:
          this.lines[3] =
            "<span class='underline'>" +
            this.buffer +
            " ".repeat(12 - this.buffer.length) +
            "</span>";

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
      current_menu.refresh();
      changed_menu = true;
    } else if (key === "Enter" && this.buffer === "6") {
      this.buffer = "";
      current_menu = menu_2;
      current_menu.refresh();
      changed_menu = true;
    }

    // If the menu was changed throughout the previous processes ...
    if (changed_menu) {
      this.lines = Array(4).fill("____________");
      this.current_operation = 0;
      this.buffer = "";

      // if not, we can update the screen
    } else {
      display(this, absolute_height - 1);
    }
  },
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
        course_list = cursos_1er_sem;
        selected_term = "1er Sem";
        current_menu = alta_bajas_cambio;
        current_menu.refresh();
        break;
      case "2":
        course_list = cursos_2do_sem;
        selected_term = "2do Sem";
        current_menu = alta_bajas_cambio;
        current_menu.refresh();
        break;
      case "3":
        // Merge verano 1 and verano extendido courses
        course_list = cursos_verano;
        selected_term = "1er Verano";
        current_menu = alta_bajas_cambio;
        current_menu.refresh();
        break;
      default:
        display(this, absolute_height - 2);
    }
  },
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
    return ` ${student_number}  ${
      this.user_name + " ".repeat(30 - this.user_name.length)
    }  0000-0  00 ${enrollment_dates[selected_term]} Crs. TTY
                                                           2:00 pm    ${pad_left(
                                                             credits_selected,
                                                             2,
                                                             "0"
                                                           )}   04
     C U R S O   Sección  Cr. Grado
${this.body_list}`;
  },

  default_footer: `Indique:   A=Alta  B=Baja  C=Cambio  L=ListaEspera  H=HorEst  p=EvalúoPago
           M=MatEvalúo  F=HorEstGráfico  O=CódigoReservar S=Salir`,

  action_footer: function () {
    return `${centralize(this.footer_text, 80)}
Abreviatura y número de curso  o  FIN                                  [${
      this.mode === 1 ? "Altas" : this.mode === 2 ? "Bajas" : "Cambio"
    }]
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
      this.body_list += pad_left(i.toString(), 2) + ".  ";

      if (selected_courses[selected_term].length > i - 1) {
        const course = selected_courses[selected_term][i - 1];
        this.body_list += `${pad_right(
          course["codificacion"],
          10
        )}   ${pad_right(course["seccion"], 8)} ${pad_right(
          course["creditos"],
          4
        )} ${course["grado"] === "Sub-graduados" ? "S" : "G"}   █`;
      }

      // Also potentially print right panel
      if (this.right_panel[i - 1] !== undefined) {
        const lines = this.body_list.split(/\n/g);
        const last_line = lines.length - 1;
        this.body_list +=
          " ".repeat(41 - lines[last_line].length) + this.right_panel[i - 1];
      }
      this.body_list += "\n";
    }

    this.handle_input(null);
  },

  update_potential_courses: function (course_name) {
    course_name = course_name.toString().trim().toUpperCase();

    // Filter potential courses
    this.potential_courses = Object.keys(course_list).filter((name) =>
      name.startsWith(course_name)
    );
  },

  update_right_panel: function (how) {
    how = how.toString().trim().toLowerCase();
    if (how === "sections") {
      // Prepare right panel if there are multiple potential courses
      if (this.potential_courses.length > 0) {
        this.right_panel = [
          "SECCIONES DISPONIBLE CURSO: " +
            course_list[this.potential_courses[0]]["codificacion"],
          "",
        ];

        // Add course sections to right panel
        for (let i = 0; i < this.potential_courses.length; i++) {
          const last_index = this.right_panel.length - 1;
          if (this.right_panel[last_index].length < 40) {
            this.right_panel[last_index] +=
              course_list[this.potential_courses[i]]["seccion"] + "  ";
          } else {
            this.right_panel.push(
              `${course_list[this.potential_courses[i]]["seccion"]}  `
            );
          }
        }
      }
    }
  },

  select_section: function (section, index = null) {
    section = section.toString().trim().toUpperCase();

    // If user wants to cancel ...
    if (section === "CAN") {
      this.reset_screen();
    } else {
      // Try to add course
      const l0 = this.potential_courses.length;
      for (let i = 0; i < l0; i++) {
        const current_name = this.potential_courses[i];

        if (course_list[current_name]["seccion"] === section) {
          // In case of making section changes, remove old course to prevent conflicts
          let old_course = "";
          if (index !== null) {
            old_course = selected_courses[selected_term][index];
            this.remove_course(index);
          }

          // If course was successfully added
          if (add_course(course_list[current_name])) {
            // There is no more need for these variables
            this.course_code = "";
            this.selected_course_index = -1;
            this.potential_courses = [];
            this.choosing_section = false;

            this.reset_screen(true);
          } else {
            if (index !== null) {
              // Add previous course again
              add_course(old_course);
            }
            this.footer_text = "Horario de este curso conflige con otro";
            this.buffer = "";
            this.choosing_section = true;
          }

          return;
        }
      }

      this.footer_text = "Sección Inválida. Pruebe otra";
      this.buffer = "";
    }
  },

  remove_course: function (i) {
    selected_courses[selected_term].splice(i, 1);
  },

  search_selected_courses: function (code) {
    code = code.trim().toUpperCase();

    const l0 = selected_courses[selected_term].length;
    for (let i = 0; i < l0; i++) {
      if (selected_courses[selected_term][i]["codificacion"] === code) {
        return i;
      }
    }

    return -1;
  },

  handle_input: function (key) {
    if (key !== null) {
      // alert(key);
      console.log(key);
    }

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
          case "F":
          case "f":
            this.reset_screen();
            current_menu = graphical_itinerary;
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
            current_menu.refresh();

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
        } else if (typeof key === "string" && key === "Enter") {
          if (this.buffer.trim().toLowerCase() === "fin") {
            this.reset_screen();
          }

          // ENROLLING
          else if (this.mode === 1) {
            // If the buffer looks like a course code and not choosing sections
            if (
              this.buffer.match(/[A-Za-z]{4}\d{4}/g) &&
              !this.choosing_section
            ) {
              if (this.search_selected_courses(this.buffer) !== -1) {
                this.footer_text = "Ya está matriculado en este curso";
                this.buffer = "";
                this.choosing_section = false;

                break;
              }

              this.update_potential_courses(this.buffer);

              if (this.potential_courses.length > 0) {
                this.footer_text = "";
                this.choosing_section = true;
                this.buffer = "";
              } else {
                this.footer_text = "Curso no GRADO";
                this.choosing_section = false;
                this.buffer = "";
              }

              this.update_right_panel("sections");

              // If is choosing sections and there are potential courses
            } else if (
              this.choosing_section &&
              this.buffer.length > 0 &&
              this.mode === 1
            ) {
              this.select_section(this.buffer);
            }
            update_credits();
          }

          // UNENROLLING
          else if (this.mode === 2) {
            // If buffer is a plausible number to delete by index
            if (this.buffer.match(/^\d{1,2}$/g)) {
              // If number is in valid range
              if (
                1 <= parseInt(this.buffer) &&
                parseInt(this.buffer) <= selected_courses[selected_term].length
              ) {
                this.remove_course(parseInt(this.buffer) - 1);
                this.footer_text = "";
                this.reset_screen(true);
              } else {
                this.footer_text = "Curso solicitado está en BLANCO";
                this.buffer = "";
              }
            }

            // If buffer looks like a course code and is doing "bajas"
            else if (this.buffer.match(/[A-Za-z]{4}\d{4}/g)) {
              const result = this.search_selected_courses(this.buffer);
              if (result === -1) {
                this.buffer = "";
                this.footer_text = "Curso NO existe en matrícula";
              } else {
                this.remove_course(result);
                this.reset_screen(true);
              }
            }

            update_credits();
          }

          // CAMBIO
          else if (this.mode === 3) {
            if (this.course_code === undefined) {
              this.course_code = "";
              this.selected_course_index = -1;
            }

            // Extract course code and index for the course to be changed
            if (
              this.buffer.match(/[A-Za-z]{4}\d{4}/g) &&
              this.course_code === ""
            ) {
              const result = this.search_selected_courses(this.buffer);

              if (result === -1) {
                this.footer_text = "Curso NO existe en matrícula";
                this.buffer = "";
                this.course_code = "";
                this.selected_course_index = -1;
                this.choosing_section = false;
              } else {
                this.course_code = this.buffer.trim().toUpperCase();
                this.selected_course_index = result;
                this.buffer = "";
                this.choosing_section = true;
              }
            }

            // If buffer is a plausible number to delete by index
            else if (
              this.buffer.match(/^\d{1,2}$/g) &&
              this.course_code === ""
            ) {
              // If number is in valid range
              if (
                1 <= parseInt(this.buffer) &&
                parseInt(this.buffer) <= selected_courses[selected_term].length
              ) {
                this.selected_course_index = parseInt(this.buffer) - 1;
                this.course_code =
                  selected_courses[selected_term][this.selected_course_index][
                    "codificacion"
                  ];
                this.reset_screen(true);
                this.choosing_section = true;
              } else {
                this.footer_text = "Curso solicitado está en BLANCO";
                this.buffer = "";
                this.course_code = "";
                this.selected_course_index = -1;
                this.choosing_section = false;
              }
            }

            if (this.course_code !== "") {
              if (this.potential_courses.length === 0) {
                this.update_potential_courses(this.course_code);
                this.update_right_panel("sections");
              } else if (this.potential_courses.length === 1) {
                this.footer_text = "No hay otras secciones disponibles";
              } else if (this.buffer.length > 0) {
                const result = this.search_selected_courses(this.course_code);

                if (
                  selected_courses[selected_term][result]["seccion"] !==
                  this.buffer
                ) {
                  this.select_section(this.buffer, this.selected_course_index);
                } else {
                  this.footer_text = "Está seleccionando la misma sección!";
                  this.buffer = "";
                }
              }
            }

            update_credits();
          }

          this.refresh();
        }

        break;
    }
    display(this, absolute_height - 5);
  },
};

var graphical_itinerary = {
  sorted_courses: function (courses) {
    // Split multiple course itineraries into multiple different courses
    const l0 = courses.length;
    // Iterate through courses
    for (let i = 0; i < l0; i++) {
      // If there are more than 1 itineraries for course ...
      if (courses[i]["horario"].length > 1) {
        const l1 = courses[i]["horario"].length;
        for (let j = 1; j < l1; j++) {
          // Clone course
          const new_course = JSON.parse(JSON.stringify(courses[i]));
          // Only use 1 itinerary
          new_course["horario"] = [courses[i]["horario"][j]];
          // Set credits to 0 to not mess with total credits
          new_course["creditos"] = 0;

          // Clone too just in case
          courses.push(JSON.parse(JSON.stringify(new_course)));
        }

        // Only keep the first course
        courses[i]["horario"] = courses[i]["horario"].slice(0, 1);
      }
    }

    courses.sort(function (obj1, obj2) {
      if (obj1["horario"].length === 0) {
        return 1;
      } else if (obj2["horario"].length === 0) {
        return -1;
      }
      const start1 = parse_itinerary(obj1["horario"][0])[0];
      const start2 = parse_itinerary(obj2["horario"][0])[0];

      return start1.valueOf() - start2.valueOf();
    });

    return courses;
  },

  header: function () {
    let [time, date] = format_date(new Date(Date.now()));

    // Substitute slashes with unique dummy characters
    date = date.replace("/", "**");
    date = date.replace("/", "**");
    // Substitute unique dummy characters with spaced slashes
    date = date.replace("**", " / ");
    date = date.replace("**", " / ");

    // Add space after
    time = time.replace(":", ": ");

    const title =
      " ".repeat(32) +
      student_number +
      "     " +
      pad_right(default_user_name.toUpperCase(), 35) +
      "0000 0 (Concentración)";

    return `     ${date}                    U.P.R. - R.U.M. - Horario Matrícula - ${selected_term} - 2020                     ${time}\n
${title}`;
  },

  body: function () {
    // Prepare borders and header
    let table = "-".repeat(134) + "\n";

    const headers = [
      centralize("Periodos", 18),
      centralize("Lunes", 18),
      centralize("Martes", 18),
      centralize("Miércoles", 18),
      centralize("Jueves", 18),
      centralize("Viernes", 18),
      centralize("Sábado", 18),
    ];
    const l0 = headers.length;
    for (let i = 0; i < l0; i++) {
      table += "|" + headers[i];
    }

    table += "|\n";

    table += ("|" + "-".repeat(18)).repeat(headers.length) + "|\n";

    // Begin preparing body of table
    const empty_row = ("|" + " ".repeat(18)).repeat(headers.length) + "|\n";

    const amount_courses = selected_courses[selected_term].length.toString();
    const courses = this.sorted_courses(
      selected_courses[selected_term].slice()
    );

    // Iterate through courses
    const l1 = courses.length;
    for (let i = 0; i < l1; i++) {
      const course = courses[i];

      // Prepare generic cells to be reused later
      const cell = centralize(
        course["codificacion"] + " - " + course["seccion"],
        18
      );
      const empty_cell = " ".repeat(18);

      // Print empty row if course itinerary's length equals 0
      if (course["horario"].length === 0) {
        table +=
          "|" +
          cell +
          ("|" + centralize("  ---  ---  ---  ", 18)).repeat(
            headers.length - 1
          ) +
          "|\n";
        if (i < l1 - 1) {
          table += empty_row;
        }
        continue;
      }

      // If there is only one itinerary for the course
      if (course["horario"].length === 1) {
        const current_itinerary = course["horario"][0];

        const [start, end, days] = parse_itinerary(current_itinerary);
        let start_time = format_date(start)[0];
        const end_time = format_date(end)[0];

        start_time = start_time.replace(/ (?:am|pm)/, "");
        const periods = centralize(
          `${start_time.trim()} - ${end_time.trim()}`,
          18
        );

        table += `|${centralize(periods, 18)}`;

        if (days.includes("l")) {
          table += `|${cell}`;
        } else {
          table += `|${empty_cell}`;
        }

        if (days.includes("m")) {
          table += `|${cell}`;
        } else {
          table += `|${empty_cell}`;
        }

        if (days.includes("w")) {
          table += `|${cell}`;
        } else {
          table += `|${empty_cell}`;
        }

        if (days.includes("j")) {
          table += `|${cell}`;
        } else {
          table += `|${empty_cell}`;
        }

        if (days.includes("v")) {
          table += `|${cell}`;
        } else {
          table += `|${empty_cell}`;
        }

        if (days.includes("s")) {
          table += `|${cell}`;
        } else {
          table += `|${empty_cell}`;
        }

        table += "|\n";
      }

      if (i < l1 - 1) {
        table += empty_row;
      }
    }

    table += "|" + "-".repeat(132) + "|\n";

    update_credits();
    table += `|${centralize(
      "Cursos   " +
        amount_courses +
        "  -  Créditos  " +
        credits_selected.toString(),
      132
    )}|\n`;

    table += "-".repeat(134);

    return table;
  },

  footer: "",

  refresh: function () {
    display(this, absolute_height);
  },

  handle_input: function (key) {
    current_menu = alta_bajas_cambio;
    current_menu.refresh();
  },
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
      case "4":
        current_menu = menu_5_3B_login;
        current_menu.refresh();
        break;
      case "5":
        current_menu = menu_5_3A;
        current_menu.refresh();
        break;
      case "6":
        current_menu = menu_5_3C;
        current_menu.refresh();
        break;
      default:
        display(this, absolute_height - 4);
    }
  },
};

var menu_5_3A = {
  header: function () {
    return header("SISTEMA ESTUDIANTIL COLEGIAL", true);
  },

  body: `\n\n\n         <span class='white-background'>****************************************************************</span>
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
         <span class='white-background'>****************************************************************</span>`,

  footer: "",

  refresh: function () {
    display(this, absolute_height - 2);
  },

  handle_input: function (key) {
    current_menu = menu_5;
    menu_5.refresh();
  },
};

var menu_5_3B = {
  body_list: "",

  header: function () {
    return header(
      `[<span class='gray-background'>CONFIRMADA</span>]             * MATRICULA ${selected_term} 2019-2020 *                       `,
      false
    );
  },
  body: function () {
    return `\n ${" ".repeat(5) + student_number}        ${
      default_user_name + " ".repeat(34 - default_user_name.length)
    } [0000   0]
    \n\n     Curso    Sec.  Crs.  Salón     Días - Horas         Profesor\n     -----    ----  ----  -----     ------------         --------\n${
      this.body_list
    }`;
  },

  refresh: function () {
    // **!! Change every semester !!** **!! Change every semester !!**
    if (selected_term === "") {
      selected_term = "1er Sem";
    }

    this.body_list = "";

    // Print list of selected courses
    for (let i = 1; i <= 12; i++) {
      if (i <= selected_courses[selected_term].length) {
        this.body_list += "& ";
      }

      if (selected_courses[selected_term].length > i - 1) {
        const course = selected_courses[selected_term][i - 1];
        //
        counter_horario = 0; //last fix
        if (course["horario"].length === 0) {
          counter_horario = true; //last fix
          course["horario"][0] = "7:30 AM - 8:20 AM LMWJ";
        }

        //////////
        prof_names = course["profesor"].toString();
        if (WhiteSpace_counter(course["profesor"].toString()) >= 3) {
          prof_names = prof_names.replace(" ", ".");
          console.log(prof_names);
        }
        if (WhiteSpace_counter(course["profesor"].toString()) >= 3) {
          prof_names = prof_names.split(" ");
        } else {
          prof_names = course["profesor"].toString().split(" ");
        }
        /////////
        let formatted_prof_name = `${prof_names
          .slice(1)
          .toString()
          .replace(",", " ")}, ${prof_names[0]}`;
        formatted_prof_name = truncate(formatted_prof_name, 23);

        const current_itinerary = course["horario"][0];
        const [start, end, days] = parse_itinerary(current_itinerary);
        let start_time = format_date(start)[0];
        end_time = format_date(end)[0].replace(/ /g, "");
        start_time = start_time.replace(/ (?:am|pm)/, "");
        if (counter_horario === true) {
          formatted_horario = " ".repeat(20); //last fix
        } else {
          if (end_time.length === 6) {
            end_time = " " + end_time;
          }
          //last fix
          formatted_horario =
            pad_right(days.toUpperCase(), 6) +
            pad_right(start_time, 4) +
            "-" +
            pad_right(end_time, 8);
        }
        //
        if (formatted_horario.length === 0) {
          formatted_horario = "";
        }
        if (formatted_prof_name.toString().length === 2) {
          formatted_prof_name = "";
        }
        //
        this.body_list += `${pad_right(
          course["codificacion"].slice(0, 4),
          5
        )}${pad_right(course["codificacion"].slice(4), 7)}${pad_right(
          course["seccion"],
          6
        )} ${pad_right(course["creditos"], 4)} ${pad_right(
          course["salon"].toString(),
          8
        )}${pad_right(formatted_horario, 19)} ${pad_right(
          formatted_prof_name.toUpperCase(),
          23
        )}`;
      }
      this.body_list += "\n";
    }

    this.handle_input(null);
  },

  footer: function () {
    update_credits();

    const amount_courses = selected_courses[selected_term].length.toString();
    return `* Cursos :  ${amount_courses}       Créditos : ${credits_selected}
--Leyenda:  @ =  No cumple con los prerrequisitos o correquisitos
            & = Curso aprobado o matriculado actualmente
          Sec.= Sección cerrada             <span class='white-background'>Oprima << Enter >> para Finalizar</span>`;
  },

  handle_input: function (key) {
    switch (key) {
      case "Enter":
        current_menu = menu_5;
        current_menu.refresh();
        break;
      default:
        display(this, absolute_height - 4);
    }
  },
};

var menu_5_3B_login = {
  lines: Array(4).fill("____________"),
  current_operation: 0,
  user_name: "",
  buffer: "",
  header: function () {
    return header("E S T U D I A N T E", true);
  },

  body: function () {
    return `${this.user_name}
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
              |       Ej. 584849999                            |
              |                                                |
              |   Fecha Nacimiento            : ${
                this.current_operation === 3 || !this.lines[3].match(/_/g)
                  ? this.lines[3]
                  : "            "
              }   |
              |       Ej. MMDDAAAA                             |
              |                                                |
              --------------------------------------------------
${pad_left("[6=Pantalla     ", 85)}\n${pad_left("9=Fin    ]     ", 85)}`;
  },

  footer: ``,

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
            if (this.buffer.match(/^\d{9}$/)) {
              this.lines[0] =
                "<span class='white-background'>(" +
                this.buffer.slice(0, 3) +
                ")" +
                this.buffer.slice(3, 5) +
                "-" +
                this.buffer.slice(5, 10) +
                "</span>";

              this.buffer = "";

              // Change line from line 1 to 2
              this.current_operation = 1;

              student_number = this.lines[0].trim();

              this.user_name = centralize(
                `<span class="white-background"> ${default_user_name.toUpperCase()} </span>`,
                80 + 39
              );
            } else {
              this.buffer = "";
              this.lines[0] = "_".repeat(12);
              // DATOS ENTRADOS NO SON CORRECTOS
            }
          }
          break;

        case 1:
          if (this.buffer.length === 4) {
            if (this.buffer.match(/^\d{4}$/g)) {
              this.lines[this.current_operation] =
                "<span class='white-background'>****</span>" + " ".repeat(8);

              this.current_operation += 1;

              this.buffer = "";
            } else {
              this.buffer = "";
              this.lines[this.current_operation] = "_".repeat(12);
            }
          }
        case 2:
          if (this.buffer.length === 9) {
            if (this.buffer.match(/^\d{9}$/g)) {
              this.lines[this.current_operation] =
                "<span class='white-background'>*********</span>" +
                " ".repeat(3);

              this.current_operation += 1;

              this.buffer = "";
            } else {
              this.buffer = "";
              this.lines[this.current_operation] = "_".repeat(12);
            }
          }
          break;
        case 3:
          this.lines[3] =
            "<span class='underline'>" +
            this.buffer +
            " ".repeat(12 - this.buffer.length) +
            "</span>";

          if (this.buffer.length === 8) {
            if (this.buffer.match(/^\d{8}$/g)) {
              current_menu = menu_5_3B;
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
      current_menu.refresh();
      changed_menu = true;
    } else if (key === "Enter" && this.buffer === "6") {
      this.buffer = "";
      current_menu = menu_5;
      current_menu.refresh();
      changed_menu = true;
    }

    // If the menu was changed throughout the previous processes ...
    if (changed_menu) {
      this.lines = Array(4).fill("____________");
      this.current_operation = 0;
      this.buffer = "";

      // if not, we can update the screen
    } else {
      display(this, absolute_height - 1);
    }
  },
};

var menu_5_3C = {
  header: function () {
    return header("* HORARIO DE MATRICULA *", true);
  },

  body: "",

  footer: `<span class='white-background'>Indique Semestre  (1=1erVer   2=1er Sem   3=2doSem   4=2doVer)      [PF4=(9)Fin]</span>`,

  refresh: function () {
    this.handle_input(null);
  },

  handle_input: function (key) {
    switch (key) {
      case "9":
        current_menu = menu_5;
        current_menu.refresh();
        break;
      case "1":
        course_list = cursos_1er_ver;
        selected_term = "1er Verano";
        current_menu = course_selection;
        current_menu.refresh();
        break;
      case "2":
        course_list = cursos_1er_sem;
        selected_term = "1er Sem";
        current_menu = course_selection;
        current_menu.refresh();
        break;
      //
      case "3":
        course_list = cursos_2do_sem;
        selected_term = "2do Sem";
        current_menu = course_selection;
        current_menu.refresh();
        break;
      // Merge verano 1 and verano extendido courses
      case "4":
        course_list = cursos_2do_ver;
        selected_term = "2do Verano";
        current_menu = course_selection;
        current_menu.refresh();
        break;
      default:
        display(this, absolute_height - 2);
    }
  },

  // refresh: function () {
  //   this.handle_input(null);
  // },

  // handle_input: function (key) {
  //   switch (key) {
  //     case "S":
  //     case "s":
  //       current_menu = main_menu;
  //       current_menu.refresh();
  //       break;
  //     case "1":
  //       course_list = cursos_1er_sem;
  //       selected_term = "1er Sem";
  //       //current_menu = alta_bajas_cambio;
  //       current_menu.refresh();
  //       break;
  //     case "2":
  //       course_list = cursos_2do_sem;
  //       selected_term = "2do Sem";
  //       //current_menu = alta_bajas_cambio;
  //       current_menu.refresh();
  //       break;
  //     case "3":
  //       // Merge verano 1 and verano extendido courses
  //       course_list = cursos_verano;
  //       selected_term = "1er Verano";
  //       //current_menu = alta_bajas_cambio;
  //       current_menu.refresh();
  //       break;
  //     default:
  //       display(this, absolute_height - 2);
  //   }
  // }
};
var course_selection = {
  buffer: "",
  footer_text: "",
  course_code: "",
  potential_courses: "",
  header: function () {
    return header("* HORARIO DE MATRICULA *", true);
  },

  body: "",

  footer: function () {
    return `<span class="white-background">C u r s o    (Ej. QUIM3001L)   Puede indicar solo MATERIA            [PF4=(9)Fin]</span>\n<span class="underline">${pad_right(
      this.buffer,
      10
    )}</span>\n${" ".repeat(29)}${course_exist}`;
  },

  search_selected_courses: function (code) {
    code = code.trim().toUpperCase();

    const l0 = selected_courses[selected_term].length;
    for (let i = 0; i < l0; i++) {
      if (selected_courses[selected_term][i]["codificacion"] === code) {
        return i;
      }
    }

    return -1;
  },

  reset_screen: function () {
    this.buffer = "";
    this.body_list = "";
    this.user_name = "";
    this.course_code = "";
    this.footer_text = "";
  },

  refresh: function () {
    display(this, absolute_height - 2);
  },

  update_potential_courses: function (course_name) {
    course_name = course_name.toString().trim().toUpperCase();
    // Filter potential courses
    this.potential_courses = Object.keys(course_list).filter((name) =>
      name.startsWith(course_name)
    );
  },

  handle_input: function (key) {
    if (typeof key === "string" && key !== "Enter") {
      // If <Backspace> or <Delete> are pressed
      if (key === "Backspace" || key === "Delete") {
        this.buffer = this.buffer.slice(0, -1);
      } else if (key.length === 1 && this.buffer.length < 10) {
        // Exclude any other keys like <AltGr> and such from being added to buffer
        this.buffer += key;
      }
      this.refresh();
    } else if (typeof key === "string" && key === "Enter") {
      if (this.buffer.trim().toLowerCase() === "fin") {
        this.reset_screen();
        current_menu = menu_5_3C;
        course_exist = "";
        current_menu.refresh();
      } else {
        //course_code = this.buffer;
        this.update_potential_courses(this.buffer);
        array_potential_courses = this.potential_courses;
        console.log(this.potential_courses);
        if (this.potential_courses.length === 0) {
          this.reset_screen();
          course_exist =
            '<span class="white-background">*** Curso incorrecto ***</span>';
          this.refresh();
        } else {
          course_exist = "";
          course_code = this.buffer;
          console.log(potential_courses);
          current_menu = section_selection;
          this.reset_screen();
          current_menu.refresh();
        }
      }
    }
  },
};

var section_selection = {
  buffer: "",
  footer_text: "",
  course_code: "",
  potential_courses: "",
  header: function () {
    return header("* HORARIO DE MATRICULA *", true);
  },

  body: "",

  footer: function () {
    return `<span class="white-background">S e c c i o n     (Ej. 001#)${" ".repeat(
      40
    )}[PF4=(9)Fin]</span>                                 
<span class="underline">${pad_right(this.buffer, 10)}</span>`;
  },

  reset_screen: function () {
    this.buffer = "";
    this.course_code = "";
    this.footer_text = "";
  },

  refresh: function () {
    display(this, absolute_height - 2);
  },

  handle_input: function (key) {
    if (typeof key === "string" && key !== "Enter") {
      // If <Backspace> or <Delete> are pressed
      if (key === "Backspace" || key === "Delete") {
        this.buffer = this.buffer.slice(0, -1);
      } else if (key.length === 1 && this.buffer.length < 8) {
        // Exclude any other keys like <AltGr> and such from being added to buffer
        this.buffer += key;
      }
      this.refresh();
    } else if (typeof key === "string" && key === "Enter") {
      if (this.buffer.trim().toLowerCase() === "fin") {
        this.reset_screen();
        current_menu = course_selection;
        current_menu.refresh();
      } else {
        //course_code = this.buffer;
        curso_deseado = course_code + "-" + this.buffer;
        console.log(array_potential_courses);
        if (this.buffer.length === 0) {
          // aparecen todas las secciones del curso disponible
        } else {
          for (let i = 0; i <= array_potential_courses.length; i++) {
            if (curso_deseado === array_potential_courses[i]) {
              current_menu = course_display;
              this.reset_screen();
              current_menu.refresh();
              break;
            } else if (i === array_potential_courses.length) {
              this.reset_screen();
              this.refresh();
            }
          }
        }
      }
    }
  },
};

var course_display = {
  header: function () {
    return header("*** HORARIO DE MATRICULA ***", false);
  },

  body: function () {
    return `${" ".repeat(
      21
    )}<span class="white-background">ESTADO DE SECCIONES ${selected_term} 2020-2021</span>\n\n${pad_right(
      `C u r s o:  ${curso_deseado
        .slice(0, 8)
        .replace(/(\w{4})/g, "$1 ")
        .replace(/(^\s+|\s+$)/, "")}         ---> ${
        course_list[curso_deseado]["nombre"]
      }\n\nSec.  Salon    Periodos            Crd.  Profesor              Cap.  Uti.  Disp.\n----  -----    --------            ----  --------              ----  ----  -----\n010   Q 251  LWV      7:30- 8:20     3   JORGE LABOY            54    52    02
011   Q 350  LWV      7:30- 8:20     3   FRANCIS B PATRON GEO   54    53    01
016   Q 344  MJ       7:30- 8:45     3   NAIRMEN MINA CAMILDE   55    55    00
017   Q 245  MJ       7:30- 8:45     3   MARIA GUNTIN BURGOS    55    55    00
021   Q 350  LWV      8:30- 9:20     3   FRANCIS B PATRON GEO   53    53    00
022   Q 251  LWV      8:30- 9:20     3   JOSE CORTES FIGUEROA   54    54    00
031   Q 350  LWV      9:30-10:20     3   VERONICA SANCHEZ MUN   54    54    00
036   Q 245  MJ       9:00-10:15     3   MARIA GUNTIN BURGOS    55    55    00
040   Q 350  LWV     10:30-11:20     3   VERONICA SANCHEZ MUN   54    54    00
041   Q 245  LWV     10:30-11:20     3   JOSE CORTES FIGUEROA   54    54    00
050   Q 245  LWV     11:30-12:20pm   3   JOSE CORTES FIGUEROA   54    54    00
051   Q 350  LWV     11:30-12:20pm   3   VERONICA SANCHEZ MUN   54    55    01-

`
    )}`;
  },

  footer: function () {
    return `<span class="white-background"><<<  Oprima Enter  >>>${" ".repeat(
      47
    )}[PF4=(9)Fin]</span>`;
  },

  reset_screen: function () {
    this.buffer = "";
    this.course_code = "";
    this.footer_text = "";
  },

  refresh: function () {
    display(this, absolute_height - 2);
  },

  handle_input: function (key) {
    switch (key) {
      case "Enter":
        current_menu = course_display_2;
        current_menu.refresh();
        break;
      default:
        this.refresh();
    }
  },
};

var course_display_2 = {
  header: function () {
    return header("*** HORARIO DE MATRICULA ***", false);
  },

  body: function () {
    return `${" ".repeat(
      21
    )}<span class="white-background">ESTADO DE SECCIONES ${selected_term} 2020-2021</span>\n\n${pad_right(
      `C u r s o:  ${curso_deseado
        .slice(0, 8)
        .replace(/(\w{4})/g, "$1 ")
        .replace(/(^\s+|\s+$)/, "")}         ---> ${
        course_list[curso_deseado]["nombre"]
      }\n\nSec.  Salon    Periodos            Crd.  Profesor              Cap.  Uti.  Disp.\n----  -----    --------            ----  --------              ----  ----  -----\n060   Q 151  LWV     12:30- 1:20pm   3   ARNALDO CARRASQUIL J   33    33    00
066   Q 125  MJ      12:30- 1:45pm   3   WANDA I. PEREZ MERCA   44    44    00
070   Q 245  LWV      1:30- 2:20pm   3   JOSE CORTES FIGUEROA   54    54    00
071   Q 151  LWV      1:30- 2:20pm   3   ARNALDO CARRASQUIL J   35    35    00
081   Q 151  LWV      2:30- 3:20pm   3   BESSIE B. RIOS GONZA   34    34    00
086   Q 350  MJ       2:00- 3:15pm   3   ARNALDO CARRASQUIL J   54    54    00
087   Q 251  MJ       2:00- 3:15pm   3   WANDA I. PEREZ MERCA   54    54    00
091   Q 151  LWV      3:30- 4:20pm   3   ARNALDO CARRASQUIL J   34    26    08
096   Q 350  MJ       3:30- 4:45pm   3   ARNALDO CARRASQUIL J   54    54    00
097   Q 251  MJ       3:30- 4:45pm   3   JORGE LABOY            54    42    12
116   Q 350  MJ       5:00- 6:15pm   3   ARNALDO CARRASQUIL J   54    53    01
117   Q 344  MJ       5:00- 6:15pm   3   ALBERTO SANTANA VARG   54    52    02

`
    )}`;
  },

  footer: function () {
    return `<span class="white-background"><<<  Oprima Enter  >>>${" ".repeat(
      47
    )}[PF4=(9)Fin]</span>`;
  },

  reset_screen: function () {
    this.buffer = "";
    this.course_code = "";
    this.footer_text = "";
  },

  refresh: function () {
    display(this, absolute_height - 2);
  },

  handle_input: function (key) {
    switch (key) {
      case "Enter":
        current_menu = course_display_3;
        current_menu.refresh();
        break;
      default:
        this.refresh();
    }
  },
};

var course_display_3 = {
  header: function () {
    return header("*** HORARIO DE MATRICULA ***", false);
  },

  body: function () {
    return `${" ".repeat(
      21
    )}<span class="white-background">ESTADO DE SECCIONES ${selected_term} 2020-2021</span>\n\n${pad_right(
      `C u r s o:  ${curso_deseado
        .slice(0, 8)
        .replace(/(\w{4})/g, "$1 ")
        .replace(/(^\s+|\s+$)/, "")}         ---> ${
        course_list[curso_deseado]["nombre"]
      }\n\nSec.  Salon    Periodos            Crd.  Profesor              Cap.  Uti.  Disp.\n----  -----    --------            ----  --------              ----  ----  -----\n
                     * Totales: QUIM 3132     24 secciones    1208  1183    25

`
    )}`;
  },

  footer: function () {
    return `<span class="white-background"><<<  Oprima Enter  >>>${" ".repeat(
      47
    )}[PF4=(9)Fin]</span>`;
  },

  reset_screen: function () {
    this.buffer = "";
    this.course_code = "";
    this.footer_text = "";
  },

  refresh: function () {
    display(this, absolute_height - 2);
  },

  handle_input: function (key) {
    switch (key) {
      case "Enter":
        current_menu = course_selection;
        current_menu.refresh();
        break;
      default:
        this.refresh();
    }
  },
};
/***
 *       __ __             __    ____      ____          __       ___  ____        _      __
 *      / // /__ ___ _____/ /_  / __/___  / __/__  __ __/ / ___  / _/ / __/_______(_)__  / /_
 *     / _  / -_) _ `/ __/ __/  > _/_ _/ _\ \/ _ \/ // / / / _ \/ _/ _\ \/ __/ __/ / _ \/ __/
 *    /_//_/\__/\_,_/_/  \__/  |_____/  /___/\___/\_,_/_/  \___/_/  /___/\__/_/ /_/ .__/\__/
 *                                                                               /_/
 */

textarea.addEventListener("input", function (event) {
  switch (event.inputType) {
    case "deleteContentForward":
    case "deleteContentBackward":
      current_menu.handle_input("Backspace");
      break;
    case "insertLineBreak":
      current_menu.handle_input("Enter");
      break;
    default:
      current_menu.handle_input(event.data.toString().toUpperCase());
  }
  textarea.value = " ";
});

var current_menu = main_menu;
current_menu.refresh();

// On document load request all the course information files
document.addEventListener("DOMContentLoaded", function () {
  textarea.focus();

  cursos_1er_sem = {};
  get_json("./assets/1erSem2020.json", function (data) {
    cursos_1er_sem = data;
  });

  cursos_2do_sem = {};
  get_json("./assets/2doSem2019.json", function (data) {
    cursos_2do_sem = data;
  });

  cursos_1er_ver = {};
  get_json("./assets/1erVerano2020.json", function (data) {
    cursos_1er_ver = data;
  }); //

  cursos_2do_ver = {};
  get_json("./assets/VeranoExtendido2020.json", function (data) {
    cursos_2do_ver = data;
  }); //

  cursos_verano = {};
  get_json("./assets/1erVerano2020.json", function (data) {
    Object.assign(cursos_verano, data);
  });
  get_json("./assets/VeranoExtendido2020.json", function (data) {
    Object.assign(cursos_verano, data);
  });
});

/*

var template = {
header: function () {
return header("[TITLE]", true);
},

body: "",

footer: "",

refresh: function () {
this.handle_input(null);
},

handle_input: function (key) {
switch (key) {
case "1":
// Some method
break;
default:
display(this, absolute_height - 2);
}
}

};



// */

//ultimo cut
// ${ pad_right(course["horario"].toString().slice(18), 6) } ${
//   pad_right(
//     course["horario"].toString().slice(0, 4),
//     4
//     //eliminate white-spaces from string//
//   )
// } ${
//   pad_right(
//     course["horario"]
//       .toString()
//       .slice(8, 18)
//       .toLowerCase()
//       .replace(/ /g, ""),
//     7
//   )
// }
//
