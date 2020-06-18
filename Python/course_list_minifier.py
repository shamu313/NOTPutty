import json
import os

base = os.path.join("..", "Web", "assets")
files = [
        os.path.join(base, "1erSem2020.json"),
        os.path.join(base, "2doSem2019.json"),
        os.path.join(base, "1erVerano2020.json"),
        os.path.join(base, "VeranoExtendido2020.json"),
        ]

for file_name in files:
    obj = []
    with open(file_name, "r+") as fp:
        obj = json.load(fp)

    for key in obj.keys():
        obj[key] = {
                "codificacion": obj[key]["codificacion"],
                "creditos": obj[key]["creditos"],
                "seccion": obj[key]["seccion"],
                "horario": obj[key]["horario"],
                "grado": obj[key]["grado"],
                }

    with open(file_name[:-4] + "min." + file_name[-4:], "x+") as fp:
        json.dump(obj, fp)
