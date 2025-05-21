import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Pregunta, usePreguntasData } from '@/hooks/usePreguntasData';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
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
              { backgroundColor: respuestaSeleccionada === opcion 
                ? tintColor 
                : isDarkMode ? '#444654' : '#F7F7F8' 
              },
            ]}
            onPress={() => {
              onSelectOpcion(pregunta.id, opcion);
            }}
          >
            <ThemedText style={[
              styles.opcionTexto, 
              { color: respuestaSeleccionada === opcion ? '#ffffff' : textColor }
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
  const { preguntas, isLoaded } = usePreguntasData();
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  // Asegurarnos de llamar a todos los hooks de forma incondicional
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Estado para controlar la pregunta actual
  const [preguntaActualIndex, setPreguntaActualIndex] = useState(0);
  
  const handleSelectOpcion = (id: string, opcion: string) => {
    setRespuestas(prev => ({
      ...prev,
      [id]: opcion
    }));
  };
  
  // Funciones para navegar entre preguntas
  const irSiguientePregunta = () => {
    if (preguntaActualIndex < preguntas.length - 1) {
      setPreguntaActualIndex(preguntaActualIndex + 1);
    }
  };
  
  const irPreguntaAnterior = () => {
    if (preguntaActualIndex > 0) {
      setPreguntaActualIndex(preguntaActualIndex - 1);
    }
  };
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'light'];
  
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
      }>      <ThemedView style={styles.container}>
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

      {!isLoaded ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText>Cargando preguntas...</ThemedText>
        </ThemedView>
      ) : (
        <>
          {preguntas.length > 0 ? (
            <>              {/* Mostrar indicador de progreso estilo ChatGPT */}
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
              
              {/* Mostrar la pregunta actual */}
              <PreguntaItem 
                key={preguntas[preguntaActualIndex].id} 
                pregunta={preguntas[preguntaActualIndex]} 
                onSelectOpcion={handleSelectOpcion}
                respuestaSeleccionada={respuestas[preguntas[preguntaActualIndex].id]} 
              />
                {/* Botones de navegación estilo ChatGPT */}
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
                    color={preguntaActualIndex === 0 ? '#999' : '#fff'} 
                    style={{ marginRight: 8 }}
                  />
                  <ThemedText style={styles.navButtonText}>Anterior</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.navButton,
                    preguntaActualIndex === preguntas.length - 1 ? styles.disabledButton : null,
                    { flexDirection: 'row', alignItems: 'center' }
                  ]}
                  disabled={preguntaActualIndex === preguntas.length - 1}
                  onPress={irSiguientePregunta}
                >
                  <ThemedText style={styles.navButtonText}>Siguiente</ThemedText>
                  <IconSymbol 
                    size={20} 
                    name="chevron.right" 
                    color={preguntaActualIndex === preguntas.length - 1 ? '#999' : '#fff'} 
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </ThemedView>
                {/* Contador de respuestas estilo ChatGPT */}
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
            </>
          ) : (
            <ThemedView style={styles.emptyContainer}>
              <ThemedText>No hay preguntas disponibles.</ThemedText>
            </ThemedView>
          )}
        </>
      )}
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
};
