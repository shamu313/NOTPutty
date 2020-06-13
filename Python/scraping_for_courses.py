from bs4 import BeautifulSoup
import json
import os
import re
import requests

if os.path.isfile("courses.json"):
    print("[!] El documento `courses.json` ya existe en este directorio")
    exit()

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
DEBUG = True

#     ____     __                   _  __            __      _____ __     ___             
#    / __/_ __/ /________ _________(_)/_/ ___    ___/ /__   / ___//_/ ___/ (_)__ ____  ___
#   / _/ \ \ / __/ __/ _ `/ __/ __/ / _ \/ _ \  / _  / -_) / /__/ _ \/ _  / / _ `/ _ \(_-<
#  /___//_\_\\__/_/  \_,_/\__/\__/_/\___/_//_/  \_,_/\__/  \___/\___/\_,_/_/\_, /\___/___/
#                                                                          /___/          

# Si no tenemos un file con los códigos de cursos ...
if not os.path.isfile("Undergraduate_Academic_Discipline_Codes.json"):
    if DEBUG:
        print("Recuperando códigos de cursos online ...")
    # Recuperar página ...
    link_codigos_cursos = 'https://www.uprm.edu/cms/index.php/page/1244'
    response = requests.get(link_codigos_cursos, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Buscar todos los <strong> bajo el td.cms_body (estos son los códigos de los cursos)
    bs4_td = soup.select_one('td.cms_body')
    codigos_cursos = [code.get_text()[:4].strip().upper() for code in bs4_td.select('strong')][1:]

    # Guardar códigos de cursos en file
    with open("Undergraduate_Academic_Discipline_Codes.json", "x+") as fp:
        json.dump(codigos_cursos, fp)
else:
    if DEBUG:
        print("Recuperando códigos de cursos de file ...")
    # Ya tenemos el file por lo que podemos sencillamente recuperar
    with open("Undergraduate_Academic_Discipline_Codes.json", "r+") as fp:
        codigos_cursos = json.load(fp)

if DEBUG:
    print(f'{codigos_cursos = }')





#     ____     __                   _  __            __      _____                    
#    / __/_ __/ /________ _________(_)/_/ ___    ___/ /__   / ___/_ _________ ___  ___
#   / _/ \ \ / __/ __/ _ `/ __/ __/ / _ \/ _ \  / _  / -_) / /__/ // / __(_-</ _ \(_-<
#  /___//_\_\\__/_/  \_,_/\__/\__/_/\___/_//_/  \_,_/\__/  \___/\_,_/_/ /___/\___/___/
#                                                                                     

registrars_link = 'https://www.uprm.edu/registrar/sections/index.php?v1={}&v2=&term={}&a=s&cmd1=Search'
term = '5-2020'
cursos = {}
# Para cada codificación en la lista de códigos de cursos ...
for i, code in enumerate(codigos_cursos):
    if DEBUG:
        print(f'[>>] Comenzamos con {code}. ', end='')
        progress = i / len(codigos_cursos)
        print(f'|{"█" * int(progress * 20):20s}|  ')
    # Recuperar página
    url = registrars_link.format(code, term)
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Buscar todos los tr dentro de table#results_table
    bs4_table = soup.select_one("table#results_table")
    try:
        bs4_trs = bs4_table.select("tr")
    except AttributeError:
        # Probably occurs when there are no records found
        print("[!!] Skipped")
        continue

    # Extraer toda la información de cada tr
    for bs4_tr in bs4_trs:
        try:
            bs4_tds = bs4_tr.select("td")

            # Extracción
            temp = bs4_tds[1].contents
            nombre = str(temp[0])
            curso_seccion = temp[2].get_text()

            creditos = bs4_tds[2].get_text()
            grado = bs4_tds[3].get_text()
            horario_salon = bs4_tds[4].contents
            profesor = bs4_tds[5].get_text()

            requisites = bs4_tr.next_sibling.next_sibling.get_text().strip()

            try:
                temp = re.search(r'Enrollment Requisites:([\*\{\}\[\]\(\)\-\>\<\_\w,!#= ]*), Co-Requisites:([\*\{\}\[\]\(\)\-\>\<\_\w,!#= ]*)', requisites)
                prerequisitos = temp.group(1).strip()
                corequisitos = temp.group(2).strip()
            except AttributeError:
                # Hay algunos requisitos anómalos formateados de forma extraña
                prerequisitos = ""
                corequisitos = ""
                if DEBUG:
                    print(f'{requisites =}')
                    breakpoint()


            # Procesamiento
            nombre = nombre.strip().title()

            temp = re.search(r'([A-Z{4}\d{4}]+)-(\w+)', curso_seccion)
            curso = temp.group(1).strip().upper()
            seccion = temp.group(2).strip().upper()

            creditos = int(creditos)

            if grado == "LowerDivision":
                grado = "Sub-graduados"
            else:
                grado = "Graduados"

            horario_salon = tuple(filter(lambda x: str(x) != '<br/>', horario_salon))
            horario_salon = [str(x).replace("\xa0", "").strip() for x in horario_salon]

            horario = []
            salon = []

            if len(horario_salon) > 0 and not all([len(x) == 0 for x in horario_salon]):
                for instance in horario_salon:
                    temp = re.search(r'(.+(?:am|pm) - .+(?:am|pm) [LMWJVSD]{1,4}) ?([\w ]+)?', instance)
                    try:
                        if len(temp.groups()) > 1 and temp.group(2) is not None:
                            horario.append(temp.group(1).strip().upper())
                            salon.append(temp.group(2).strip().upper())
                        else:
                            horario.append(temp.group(1).strip().upper())
                    except AttributeError:
                        if DEBUG:
                            print("Attribute error at horario_salon")
                            breakpoint()

            profesor = profesor.strip().title()

            info_curso = {
                    "nombre": nombre,
                    "codificacion": curso,
                    "seccion": seccion,
                    "creditos": creditos,
                    "grado": grado,
                    "horario": horario,
                    "salon": salon,
                    "profesor": profesor,
                    "requisitos": prerequisitos,
                    "corequisitos": corequisitos
                    }

            cursos[f'{curso}-{seccion}'] = info_curso
            
        except IndexError:
            # El table row no sigue el formato que nos interesa, por lo que lo vamos a ignorar
            continue

with open("courses.json", "x+") as fp:
    json.dump(cursos, fp)
