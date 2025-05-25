import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'light'];

  const navigateToPreguntas = () => {
    router.push('/preguntas');
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
            {/* <Image
              source={require('@/assets/images/vote-header.png')}
              style={styles.headerImage}
              contentFit="contain"
            /> */}
          </View>
        </LinearGradient>
      }>
      <ThemedView style={styles.container}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>Voto Sin Prejuicio</ThemedText>
          <ThemedText style={styles.subtitle}>Tu voz, tu elección informada</ThemedText>
        </View>
        
        <ThemedView style={styles.cardContainer}>
          <ThemedText type="subtitle">¿Qué es Voto Sin Prejuicio?</ThemedText>
          <ThemedText style={styles.paragraph}>
            Esta aplicación te ayuda a descubrir tus verdaderas preferencias políticas 
            sin sesgos ideológicos, para que puedas tomar decisiones informadas basadas 
            en propuestas concretas.
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.stepsContainer}>
          <ThemedText type="subtitle">¿Cómo funciona?</ThemedText>
          
          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, {backgroundColor: colors.stepNumber}]}>
              <ThemedText style={styles.stepNumberText}>1</ThemedText>
            </View>
            <ThemedText style={styles.stepText}>
              Responde preguntas sobre temas políticos y sociales
            </ThemedText>
          </View>
          
          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, {backgroundColor: colors.stepNumber}]}>
              <ThemedText style={styles.stepNumberText}>2</ThemedText>
            </View>
            <ThemedText style={styles.stepText}>
              Descubre tu perfil político real basado en tus respuestas
            </ThemedText>
          </View>
          
          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, {backgroundColor: colors.stepNumber}]}>
              <ThemedText style={styles.stepNumberText}>3</ThemedText>
            </View>
            <ThemedText style={styles.stepText}>
              Compara tus resultados con las propuestas de los candidatos
            </ThemedText>
          </View>
        </ThemedView>
        
        <TouchableOpacity 
          style={[styles.button, {backgroundColor: colors.buttonPrimary}]}
          onPress={navigateToPreguntas}
        >
          <ThemedText style={styles.buttonText}>
            Comenzar Cuestionario
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerGradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 200,
    height: 200,
    opacity: 0.9,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  stepsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 0.3)',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
