class Persona:
    def __init__(self, n, a, e):
        self.nombre = n
        self.apellido = a
        self.edad = e

    def printName(self):
        print(self.nombre)


persona1 = Persona("Marcos", "Pesante Colón", 18)
persona2 = Persona('Samuel', 'Hernandez Colon', 19)

print(f'Nombre = {persona1.nombre}, Apellido = {persona1.apellido}')
print(f'Apellido = {persona2.apellido}, Edad = {persona2.edad}')
