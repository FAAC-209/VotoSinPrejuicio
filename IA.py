import json

# === Paso 1: Cargar archivos JSON ===
with open("preguntas/preguntasIA.json", "r", encoding="utf-8") as f:
    preguntas = json.load(f)

with open("preguntas/puntosIA.json", "r", encoding="utf-8") as f:
    partidos = json.load(f)

# === Paso 2: Mapa de valores para respuestas ===
mapa_valores = {
    "Muy de acuerdo": 5,
    "De acuerdo": 4,
    "Neutral": 3,
    "En desacuerdo": 2,
    "Muy en desacuerdo": 1,
    "Sí": 1,
    "No": 0,
    "Indiferente": 0.5
}

# === Paso 3: Pedir respuestas al usuario dinámicamente ===
respuestas_usuario = {}

print("🗳️ Responde a las siguientes preguntas según tu opinión.\n")

for pregunta in preguntas:
    opciones = pregunta["opciones"]
    print(f"{pregunta['id']}. {pregunta['texto']}")

    for idx, opcion in enumerate(opciones, start=1):
        print(f"   {idx}. {opcion}")

    # Validar respuesta
    while True:
        try:
            entrada = int(input("Elige una opción (número): "))
            if 1 <= entrada <= len(opciones):
                respuesta = opciones[entrada - 1]
                respuestas_usuario[pregunta["id"]] = respuesta
                break
            else:
                print("❌ Opción inválida. Intenta de nuevo.")
        except ValueError:
            print("❌ Ingresa un número válido.")

    print()

# === Paso 4: Calcular afinidad ===
def calcular_afinidad(usuario, partidos):
    afinidades = []

    for partido in partidos:
        nombre = partido["nombre"]
        respuestas_partido = partido["respuestas"]
        total = 0
        suma_diferencias = 0

        for pregunta_id, respuesta_usuario in usuario.items():
            valor_usuario = mapa_valores.get(respuesta_usuario)
            valor_partido = respuestas_partido.get(pregunta_id)

            if valor_usuario is not None and valor_partido is not None:
                diferencia = abs(valor_usuario - valor_partido)
                suma_diferencias += diferencia
                total += 1

        if total > 0:
            promedio = suma_diferencias / total
            afinidad = 100 - (promedio * 20)
            afinidades.append({
                "partido": nombre,
                "afinidad": round(afinidad, 2)
            })

    afinidades.sort(key=lambda x: x["afinidad"], reverse=True)
    return afinidades

# === Paso 5: Ejecutar y mostrar resultados ===
resultados = calcular_afinidad(respuestas_usuario, partidos)

print("\n🔍 Resultado de afinidad política:\n")
for r in resultados:
    print(f"✅ {r['partido']}: {r['afinidad']}%")

if resultados:
    print(f"\n🎯 El partido más afín a tus respuestas es: {resultados[0]['partido']} con {resultados[0]['afinidad']}% de afinidad.")
