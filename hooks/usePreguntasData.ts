import { useEffect, useState } from 'react';

// Importamos los datos directamente
import preguntasData from '../preguntas/preguntasIA.json';
import puntosData from '../preguntas/puntosIA.json';

// Definición de tipos
export type Pregunta = {
  id: string;
  texto: string;
  categoria: string;
  tipo: string; 
  opciones: string[];
};

export type Partido = {
  id: string;
  nombre: string;
  respuestas: Record<string, number>;
};

// export type RespuestaUsuario = { // Este tipo no se usa actualmente en el hook, pero podría ser útil
//   preguntaId: string;
//   opcionSeleccionada: string;
// };

// Nuevo tipo para el resultado de afinidad
export type AfinidadResultado = {
  id: string; // ID del partido
  partido: string; // Nombre del partido
  afinidad: number;
};

// Hook personalizado para cargar y manejar los datos
export function usePreguntasData() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargamos los datos desde los archivos importados
    setPreguntas(preguntasData as Pregunta[]);
    setPartidos(puntosData as Partido[]);
    setIsLoaded(true);
  }, []);

  // Función para convertir la respuesta del usuario a un valor numérico
  const convertirRespuestaAValor = (pregunta: Pregunta, respuestaTexto: string): number => {
    const index = pregunta.opciones.indexOf(respuestaTexto);
    
    if (index === -1) {
      console.warn(`Respuesta "${respuestaTexto}" no encontrada en opciones para pregunta ID ${pregunta.id}. Usando valor neutral.`);
      // Para likert, un valor medio sería (5+1)/2 = 3. Para si/no, 0.5 es neutral.
      return pregunta.tipo === 'likert' ? 3 : 0.5;
    }
    
    if (pregunta.tipo === 'likert') {
      // Escala de 5 (Muy de acuerdo) a 1 (Muy en desacuerdo)
      // Ejemplo: "Muy de acuerdo" (index 0) -> 5 - 0 = 5
      return 5 - index;
    } else if (pregunta.tipo === 'si/no') {
      // Sí: 1, No: 0, Indiferente: 0.5
      if (respuestaTexto === 'Sí') return 1;
      if (respuestaTexto === 'No') return 0;
      if (respuestaTexto === 'Indiferente') return 0.5;
      // Si la respuestaTexto está en las opciones pero no es Sí/No/Indiferente (improbable si el JSON es correcto)
      console.warn(`Respuesta tipo si/no "${respuestaTexto}" no mapeada directamente para pregunta ID ${pregunta.id}. Usando valor neutral.`);
      return 0.5;
    }
    
    console.warn(`Tipo de pregunta "${pregunta.tipo}" no reconocido para pregunta ID ${pregunta.id}. Usando valor neutral.`);
    return pregunta.tipo === 'likert' ? 3 : 0.5; // Valor neutral por defecto
  };

  const calcularAfinidad = (
    respuestasUsuario: Record<string, string>, // { preguntaId: respuestaTexto }
    todasLasPreguntas: Pregunta[],
    todosLosPartidos: Partido[]
  ): AfinidadResultado[] => {
    const afinidades: AfinidadResultado[] = [];

    todosLosPartidos.forEach(partido => {
      let sumaDiferencias = 0;
      let totalPreguntasConsideradas = 0;

      Object.entries(respuestasUsuario).forEach(([preguntaId, respuestaTextoUsuario]) => {
        const preguntaActual = todasLasPreguntas.find(p => p.id === preguntaId);
        if (!preguntaActual) {
          console.warn(`Pregunta con ID ${preguntaId} no encontrada en todasLasPreguntas.`);
          return; 
        }

        const valorUsuario = convertirRespuestaAValor(preguntaActual, respuestaTextoUsuario);
        const valorPartido = partido.respuestas[preguntaId];

        if (valorUsuario !== undefined && valorPartido !== undefined) {
          const diferencia = Math.abs(valorUsuario - valorPartido);
          sumaDiferencias += diferencia;
          totalPreguntasConsideradas += 1;
        } else {
          // console.warn(`Valores no encontrados para pregunta ${preguntaId} en partido ${partido.nombre}. Usuario: ${valorUsuario}, Partido: ${valorPartido}`);
        }
      });

      if (totalPreguntasConsideradas > 0) {
        const promedioDiferencias = sumaDiferencias / totalPreguntasConsideradas;
        // Rango de valores 0-5. Diferencia máxima 5.
        // Afinidad = 100 - (promedioDiferencias * 20)
        let afinidadCalculada = 100 - (promedioDiferencias * 20);
        afinidadCalculada = Math.max(0, Math.min(100, afinidadCalculada)); 

        afinidades.push({
          id: partido.id,
          partido: partido.nombre,
          afinidad: parseFloat(afinidadCalculada.toFixed(2)),
        });
      } else {
        afinidades.push({
          id: partido.id,
          partido: partido.nombre,
          afinidad: 0, 
        });
      }
    });

    afinidades.sort((a, b) => b.afinidad - a.afinidad);
    return afinidades;
  };

  return {
    preguntas,
    partidos,
    isLoaded,
    convertirRespuestaAValor,
    calcularAfinidad, // Exportar la nueva función
  };
}
