import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native'; // Quitar Modal, añadir ScrollView si es necesario para resultados

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AfinidadResultado, Pregunta, usePreguntasData } from '@/hooks/usePreguntasData'; // Importar AfinidadResultado
import { useThemeColor } from '@/hooks/useThemeColor';
import { styles } from './preguntas-styles';

// Componente para mostrar una pregunta individual
const PreguntaItem = ({ pregunta, onSelectOpcion, respuestaSeleccionada }: { 
  pregunta: Pregunta; 
  onSelectOpcion: (id: string, opcion: string) => void;
  respuestaSeleccionada?: string;
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const isDarkMode = useThemeColor({}, 'text') === '#FFFFFF';

  return (
    <ThemedView style={styles.preguntaContainer}>
      <ThemedView style={styles.chatBubbleAssistant}>
        <IconSymbol
          size={24}
          name="person.circle.fill"
          color={tintColor}
          style={styles.avatarIcon}
        />
        <ThemedView style={styles.bubbleContent}>
          <ThemedText type="subtitle" style={styles.preguntaText}>{pregunta.texto}</ThemedText>
          <ThemedText style={styles.categoria}>Categoría: {pregunta.categoria}</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.opcionesContainer}>
        {pregunta.opciones.map((opcion, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.opcion,
              {
                backgroundColor: respuestaSeleccionada === opcion
                  ? tintColor
                  : (isDarkMode ? '#606060' : '#3A7BC8'), // Mantener colores actuales para no seleccionadas
                borderWidth: respuestaSeleccionada === opcion ? 2 : 0,
                borderColor: respuestaSeleccionada === opcion ? textColor : 'transparent',
              },
            ]}
            onPress={() => {
              onSelectOpcion(pregunta.id, opcion);
            }}
          >
            <ThemedText style={[
              styles.opcionTexto,
              {
                color: respuestaSeleccionada === opcion ? '#FFFFFF' : textColor,
                fontWeight: respuestaSeleccionada === opcion ? 'bold' : styles.opcionTexto?.fontWeight,
              }
            ]}>
              {opcion}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

export default function PreguntasScreen() {
  const { preguntas, partidos, isLoaded, calcularAfinidad } = usePreguntasData();
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  const [preguntaActualIndex, setPreguntaActualIndex] = useState(0);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [resultadosAfinidad, setResultadosAfinidad] = useState<AfinidadResultado[]>([]);
  // const [modalVisible, setModalVisible] = useState(false); // Eliminado
  
  const handleSelectOpcion = (id: string, opcion: string) => {
    setRespuestas(prevRespuestas => {
      const nuevasRespuestas = {
        ...prevRespuestas,
        [id]: opcion
      };

      // Después de actualizar la respuesta, decidir si avanzar o mostrar resultados
      if (preguntaActualIndex < preguntas.length - 1) {
        setPreguntaActualIndex(preguntaActualIndex + 1);
      } else {
        // Es la última pregunta, calcular y mostrar resultados
        const resultados = calcularAfinidad(nuevasRespuestas, preguntas, partidos);
        setResultadosAfinidad(resultados);
        setMostrarResultados(true);
      }
      return nuevasRespuestas; // Devuelve el nuevo estado para setRespuestas
    });
  };
  
  // Funciones para navegar entre preguntas
  const irPreguntaAnterior = () => {
    if (preguntaActualIndex > 0) {
      setPreguntaActualIndex(preguntaActualIndex - 1);
    }
  };
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'light'];

  const reiniciarCuestionario = () => {
    setRespuestas({});
    setPreguntaActualIndex(0);
    setMostrarResultados(false);
    setResultadosAfinidad([]);
    // setModalVisible(false); // Eliminado
  };
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4A90E2', dark: '#2C3E50' }}
      headerImage={
        <LinearGradient
          colors={isDark ? ['#2C3E50', '#1A1A1A'] : ['#4A90E2', '#87CEEB']}
          style={styles.headerGradient}
        >
          <View style={styles.headerImageContainer}>
            <IconSymbol
              size={150}
              color={isDark ? "#FFFFFF" : "#FFFFFF"}
              name="doc.text.fill"
              style={styles.headerIcon}
            />
          </View>
        </LinearGradient>
      }>      
      {/* Contenido principal: Preguntas o Resultados */}
      {!isLoaded ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText>Cargando...</ThemedText>
        </ThemedView>
      ) : mostrarResultados ? (
        // Vista de Resultados
        <ThemedView style={[styles.container, styles.resultadosViewContainer]}>
          <ThemedText type="title" style={styles.resultadosTitle}>Resultados de Afinidad</ThemedText>
          <ScrollView contentContainerStyle={{paddingBottom: 20}}>
            {resultadosAfinidad.length > 0 ? (
              resultadosAfinidad.map((partido) => (
                <ThemedView key={partido.id} style={[styles.resultadoItemContainer, {backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}]}>
                  <ThemedText style={styles.resultadoPartidoNombre}>{partido.partido}:</ThemedText>
                  <ThemedText style={[styles.resultadoAfinidad, {color: tintColor}]}>{partido.afinidad}%</ThemedText>
                </ThemedView>
              ))
            ) : (
              <ThemedText style={{textAlign: 'center', marginTop: 20}}>Calculando resultados...</ThemedText>
            )}
            {resultadosAfinidad.length > 0 && (
              <ThemedText style={styles.partidoMasAfin}>
                El partido más afín es: <ThemedText style={{fontWeight: 'bold', color: tintColor}}>{resultadosAfinidad[0].partido}</ThemedText> con {resultadosAfinidad[0].afinidad}%.
              </ThemedText>
            )}
          </ScrollView>
          <TouchableOpacity
            style={[styles.navButton, {backgroundColor: tintColor, marginTop: 20, alignSelf: 'center'}] } // Reutilizando estilo navButton
            onPress={reiniciarCuestionario}
          >
            <ThemedText style={styles.navButtonText}>Volver a Empezar</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        // Vista de Preguntas
        <>
          {preguntas.length > 0 ? (
            <>
              <ThemedView style={styles.container}> {/* Contenedor para el título y la tarjeta de instrucciones */}
                <View style={styles.titleContainer}>
                  <ThemedText type="title" style={styles.title}>Cuestionario</ThemedText>
                  <ThemedText style={styles.subtitle}>Descubre tus preferencias políticas</ThemedText>
                </View>
                <ThemedView style={styles.instructionCard}>
                  <ThemedText type="subtitle">Instrucciones</ThemedText>
                  <ThemedText style={styles.paragraph}>
                    Responde con sinceridad a cada pregunta seleccionando la opción
                    que mejor represente tu opinión personal. No hay respuestas correctas o incorrectas.
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              {/* Contenedor para el progreso, la pregunta y la navegación, que debe estar dentro del ParallaxScrollView pero fuera del ThemedView anterior si queremos que todo scrollee junto con Parallax */}
              {/* O bien, si queremos que el título y las instrucciones sean parte del header del Parallax, la estructura debe cambiar */}
              {/* Por ahora, asumimos que todo el contenido de preguntas va junto y scrollea */}
              {/* Se quita flex:1 de este contenedor para mejorar el scroll en web, manteniendo el padding */}
              <ThemedView style={{ padding: 10 }}> 
                <ThemedView style={styles.progressContainer}>
                  <ThemedView style={styles.progressHeader}>
                    <IconSymbol 
                      size={18} 
                      name="chart.bar.fill" 
                      color={tintColor} 
                      style={{ marginRight: 8 }}
                    />
                    <ThemedText style={styles.progressText}>
                      Pregunta {preguntaActualIndex + 1} de {preguntas.length}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.progressBar}>
                    <ThemedView 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${((preguntaActualIndex + 1) / preguntas.length) * 100}%`,
                          backgroundColor: tintColor 
                        }
                      ]} 
                    />
                  </ThemedView>
                </ThemedView>
              
                <PreguntaItem 
                  key={preguntas[preguntaActualIndex].id} 
                  pregunta={preguntas[preguntaActualIndex]} 
                  onSelectOpcion={handleSelectOpcion}
                  respuestaSeleccionada={respuestas[preguntas[preguntaActualIndex].id]} 
                />
                
                <ThemedView style={styles.navigationButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.navButton,
                      preguntaActualIndex === 0 ? styles.disabledButton : null,
                      { flexDirection: 'row', alignItems: 'center' }
                    ]}
                    disabled={preguntaActualIndex === 0}
                    onPress={irPreguntaAnterior}
                  >
                    <IconSymbol 
                      size={20} 
                      name="chevron.left" 
                      color={preguntaActualIndex === 0 ? (isDark ? '#777' : '#aaa') : (isDark ? '#fff' : '#fff')} 
                      style={{ marginRight: 8 }}
                    />
                    <ThemedText style={[styles.navButtonText, preguntaActualIndex === 0 ? {color: (isDark ? '#777' : '#aaa')} : {}]}>Anterior</ThemedText>
                  </TouchableOpacity>
                  
                  {/* Botón Siguiente Opcional - Se podría añadir si se desea permitir avanzar sin responder, 
                      pero la lógica actual avanza al seleccionar una opción. 
                      Si se re-introduce, asegurarse que handleSelectOpcion no cause doble avance. 
                      Por ahora, lo mantenemos comentado para seguir la funcionalidad de avance automático al seleccionar.
                  */}
                  {/*
                  {preguntaActualIndex < preguntas.length - 1 && (
                    <TouchableOpacity 
                      style={[
                        styles.navButton,
                        { flexDirection: 'row', alignItems: 'center' }
                      ]}
                      onPress={() => setPreguntaActualIndex(preguntaActualIndex + 1)} // Lógica simple de avance
                    >
                      <ThemedText style={styles.navButtonText}>Siguiente</ThemedText>
                      <IconSymbol 
                        size={20} 
                        name="chevron.right" 
                        color={isDark ? '#fff' : '#fff'} 
                        style={{ marginLeft: 8 }}
                      />
                    </TouchableOpacity>
                  )}
                  */}
                </ThemedView>
                
                <ThemedView style={styles.contadorContainer}>
                  <ThemedView style={styles.contadorBadge}>
                    <IconSymbol 
                      size={16} 
                      name="checkmark.circle.fill" 
                      color="#FFFFFF"
                      style={{ marginRight: 6 }} 
                    />
                    <ThemedText style={styles.contadorText}>
                      {Object.keys(respuestas).length} de {preguntas.length} preguntas respondidas
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </>
          ) : (
            <ThemedView style={styles.emptyContainer}>
              <ThemedText>No hay preguntas disponibles.</ThemedText>
            </ThemedView>
          )}
        </>
      )}
      {/* Modal eliminado */}
    </ParallaxScrollView>
  );
}

// Los estilos han sido movidos a un archivo separado: preguntas-styles.tsx
// Esto solo está mantenido para compatibilidad hasta que se complete la migración
const oldStyles = {
  headerImage: {
    opacity: 0.15,
    transform: [{ rotate: '-10deg' }],
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  description: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 16,
  },
  preguntaContainer: {
    marginVertical: 12,
    padding: 8,
    borderRadius: 12,
  },
  chatBubbleAssistant: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 163, 127, 0.1)', // Verde teal transparente
  },
  avatarIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  bubbleContent: {
    flex: 1,
  },
  preguntaText: {
    fontSize: 16,
    marginBottom: 8,
  },
  categoria: {
    marginTop: 4,
    marginBottom: 4,
    fontStyle: 'italic',
    fontSize: 13,
    opacity: 0.8,
  },
  opcionesContainer: {
    marginTop: 20,
    paddingHorizontal: 8,
  },
  opcion: {
    marginVertical: 6,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  opcionTexto: {
    fontWeight: '500',
    fontSize: 15,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },  contadorContainer: {
    marginTop: 24,
    marginBottom: 8,
    padding: 8,
    alignItems: 'center',
  },
  contadorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10A37F', // Verde de ChatGPT
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  contadorText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },// Nuevos estilos para la navegación de preguntas
  progressContainer: {
    marginBottom: 24,
    padding: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparente para que funcione tanto en claro como oscuro
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 8,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#10A37F', // El verde de ChatGPT
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(16, 163, 127, 0.5)',
    opacity: 0.7,
  },  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  resultadosViewContainer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  resultadosTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultadoItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultadoPartidoNombre: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultadoAfinidad: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  partidoMasAfin: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonClose: {
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  textStyleButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
};
