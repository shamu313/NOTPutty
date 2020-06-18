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
  "1er Verano": "4/may/2019"
};
const default_user_name = "Juan del Pueblo Rodríguez";

var selected_term = "";
// var selected_term = "2do Sem";
var credits_selected = 0;
var student_number = "(802)00-0000";
var course_list = {};
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
  ]
};

var cursos_1er_sem_2020 = {};
var cursos_2do_sem_2019 = {};

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

  let output = character.repeat((width - string.length) / 2) + string;
  output += character.repeat(width - output.length);

  return output;
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

function get_json(url, callback) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(request.responseText));
    }
  };
  request.open('GET', url, true);
  request.send();
}

function header(title, long = true) {
  const today = new Date(Date.now());

  const [time, date] = format_date(today);

  title = centralize(title, absolute_width)


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
      current_menu.refresh();
      changed_menu = true;
    } else if (key === "Enter" && this.buffer === "6") {
      this.buffer = "";
      current_menu = menu_2;
      current_menu.refresh()
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
        course_list = {};
        get_json("./assets/1erVerano2020.json", function (data) {
          Object.assign(course_list, data);
        });
        get_json("./assets/VeranoExtendido2020.json", function (data) {
          Object.assign(course_list, data);
        });

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
                                                           2:00 pm    ${pad_left(credits_selected, 2, "0")}   04
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
      this.body_list += pad_left(i.toString(), 2) + ".  ";
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

  update_potential_courses: function (course_name) {
    course_name = course_name.toString().trim().toUpperCase();

    // Filter potential courses
    this.potential_courses = Object.keys(course_list).filter((name) => name.startsWith(course_name));


  },

  update_right_panel: function (how) {
    how = how.toString().trim().toLowerCase();
    if (how === "sections") {
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
        const current_name = this.potential_courses[i]

        if (course_list[current_name]["seccion"] === section) {
          // Remove previous course before to prevent itinerary conflicts
          let old_course = "";
          if (index !== null) {
            old_course = selected_courses[selected_term][index];
            this.remove_course(index);
            credits_selected -= course_list[current_name]["creditos"];


          }

          // If course was successfully added
          if (add_course(course_list[current_name])) {
            credits_selected += course_list[current_name]["creditos"];

            // There is no more need for these variables
            this.course_code = "";
            this.selected_course_index = -1;
            this.potential_courses = [];
            this.choosing_section = false;

            this.reset_screen(true);
          }
          else {
            if (index !== null) {
              // Add previous course again
              add_course(old_course);
              credits_selected += course_list[current_name]["creditos"];
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
        return i
      }
    }
    return false;
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

        } else if (typeof key === "string" && key === "Enter") {
          if (this.buffer.trim().toLowerCase() === "fin") {
            this.reset_screen();

          }

          // ENROLLING
          else if (this.mode === 1) {
            // If the buffer looks like a course code and not choosing sections
            if (this.buffer.match(/[A-Za-z]{4}\d{4}/g) && !this.choosing_section) {

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
            } else if (this.choosing_section && this.buffer.length > 0 && this.mode === 1) {

              this.select_section(this.buffer);

            }
          }


          // UNENROLLING
          else if (this.mode == 2) {

            // If buffer is a plausible number to delete by index
            if (this.buffer.match(/^\d{1,2}$/g)) {

              // If number is in valid range
              if (1 <= parseInt(this.buffer) && parseInt(this.buffer) <= selected_courses[selected_term].length) {

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
              if (result === false) {
                this.buffer = "";
                this.footer_text = "Curso NO existe en matrícula";
              } else {
                this.remove_course(result);
                this.reset_screen(true)
              }
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
              const result = this.search_selected_courses(this.buffer);

              if (result === false) {
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
            else if (this.buffer.match(/^\d{1,2}$/g) && this.course_code === "") {

              // If number is in valid range
              if (1 <= parseInt(this.buffer) && parseInt(this.buffer) <= selected_courses[selected_term].length) {

                this.selected_course_index = parseInt(this.buffer) - 1;
                this.course_code = selected_courses[selected_term][this.selected_course_index]["codificacion"];
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
              }

              else if (this.potential_courses.length === 1) {
                this.footer_text = "No hay otras secciones disponibles";
              }

              else if (this.buffer.length > 0) {
                this.select_section(this.buffer, this.selected_course_index);
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


var graphical_itinerary = {
  sorted_courses: function (courses) {
    // Split multiple course itineraries into multiple different courses
    const l0 = courses.length;
    // Iterate through courses
    for (let i = 0; i < l0; i++) {
      // If there are more than 1 itineraries for course ...
      if (courses[i]["horario"].length > 1) {
        for (let j = 1; j < courses[i]["horario"].length; j++) {
          // Clone course
          let new_course = courses[i].slice();
          // Only use 1 itinerary
          new_course["horario"] = [courses[i]["horario"][j]];
          // Set credits to 0 to not mess with total credits
          new_course["creditos"] = 0;

          // Clone too just in case
          courses.push(new_course.slice());
        }
      }
    }

    courses.sort(function (obj1, obj2) {

      const [start1, end1, days1] = parse_itinerary(obj1["horario"][0]);
      const [start2, end2, days2] = parse_itinerary(obj2["horario"][0]);

      return start1.valueOf() - start2.valueOf()
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

    title = " ".repeat(32) + student_number + "     " + pad_right(default_user_name.toUpperCase(), 35) + "0000 0 (Concentración)"



    return `     ${date}                    U.P.R. - R.U.M. - Horario Matrícula - ${selected_term} - 2021                     ${time}\n
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
      centralize("Sábado", 18)
    ];
    headers.forEach(function (element, i) {
      table += "|" + element;
    });

    table += "|\n";

    table += ("|" + "-".repeat(18)).repeat(headers.length) + "|\n";

    // Begin preparing body of table
    const empty_row = ("|" + " ".repeat(18)).repeat(headers.length) + "|\n";


    const amount_courses = selected_courses[selected_term].length.toString();
    let courses = this.sorted_courses(selected_courses[selected_term].slice());
    let amount_credits = 0;

    // Iterate through courses
    const l0 = courses.length;
    courses.forEach(function (course, i) {

      amount_credits += course["creditos"];

      const cell = centralize(course["codificacion"] + "  - " + course["seccion"], 18);
      const empty_cell = " ".repeat(18)

      // Iterate through the course's itineraries. Most generally there will only be 1 per course
      course["horario"].forEach(function (current_itinerary, j) {
        const [start, end, days] = parse_itinerary(current_itinerary);
        let [start_time, start_date] = format_date(start);
        const [end_time, end_date] = format_date(end);

        start_time = start_time.replace(/ (?:am|pm)/, "");
        const periods = centralize(`${start_time}- ${end_time}`, 18);

        table += `|${centralize(periods, 18)}`;

        if (days.includes("l")) { table += `|${cell}`; }
        else { table += `|${empty_cell}`; }

        if (days.includes("m")) { table += `|${cell}`; }
        else { table += `|${empty_cell}`; }

        if (days.includes("w")) { table += `|${cell}`; }
        else { table += `|${empty_cell}`; }

        if (days.includes("j")) { table += `|${cell}`; }
        else { table += `|${empty_cell}`; }

        if (days.includes("v")) { table += `|${cell}`; }
        else { table += `|${empty_cell}`; }

        if (days.includes("s")) { table += `|${cell}`; }
        else { table += `|${empty_cell}`; }

        table += "|\n";
      });

      if (i < l0 - 1) { table += empty_row; }
    });

    table += "|" + "-".repeat(132) + "|\n";

    table += `|${centralize("Cursos   " + amount_courses + "  -  Créditos  " + amount_credits.toString(), 132)}|\n`;

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


// TO DO:
// Preservar solo ...
// Codificacion
// Creditos
// Seccion
// Horario

// get_json al principio asincrono

var current_menu = main_menu;
current_menu.refresh();

document.addEventListener('DOMContentLoaded', function () {

  get_json("./assets/1erSem2020.json", function (data) {
    cursos_1er_sem_2020 = data;
  });

  get_json("./assets/2doSem2019.json", function (data) {
    cursos_2do_sem_2019 = data;
  });

});

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
