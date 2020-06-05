import datetime as dt

def header(title, long=True):
    # https://docs.python.org/3/library/datetime.html
    fecha = dt.datetime.now().strftime("%d/%b/%Y")
    hora = dt.datetime.now().strftime("%I:%M %p")

    if long:
        return f'''{fecha}               Universidad de Puerto Rico                    {hora}
                      RECINTO UNIVERSITARIO DE MAYAGUEZ
{title:^80s}'''
    else:
        return f'''{fecha}        U.P.R. - Recinto Universitario de Mayagüez           {hora}
{title:^80s}'''


def footer():
    pass

footer_leyenda = '''* Cursos :  {}       Créditos : {} *
--Leyenda:  @ =  No cumple con los prerrequisitos o correquisitos
            & =  Curso aprobado o matriculado actualmente
          Sec.=  Sección cerrada                Oprima <<Enter>> para Finalizar'''

if __name__ == "__main__":
    print(header("* HORARIO DE MATRICULA *"))
    print()
    print("═"*80)
    print()
    print(header("* MATRICULA  1er Sem  2020-2021 *", False))