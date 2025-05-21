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

export type RespuestaUsuario = {
  preguntaId: string;
  opcionSeleccionada: string;
};

// Hook personalizado para cargar y manejar los datos
export function usePreguntasData() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargamos los datos desde los archivos importados
    setPreguntas(preguntasData);
    setPartidos(puntosData);
    setIsLoaded(true);
  }, []);

  // Función para convertir la respuesta del usuario a un valor numérico
  const convertirRespuestaAValor = (pregunta: Pregunta, respuestaTexto: string): number => {
    const index = pregunta.opciones.indexOf(respuestaTexto);
    
    if (index === -1) return 0;
    
    if (pregunta.tipo === 'likert') {
      // Convertir de 0-4 escala a 1-5
      return 5 - index;
    } else if (pregunta.tipo === 'si/no') {
      // Convertir a 1 (Sí), 0 (Indiferente), -1 (No)
      if (respuestaTexto === 'Sí') return 1;
      if (respuestaTexto === 'No') return 0;
      return 0.5; // Indiferente
    }
    
    return 0;
  };

  return {
    preguntas,
    partidos,
    isLoaded,
    convertirRespuestaAValor,
  };
}
