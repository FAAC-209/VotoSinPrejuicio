import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabTwoScreen() {
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
              name="chart.pie.fill"
              style={styles.headerIcon}
            />
          </View>
        </LinearGradient>
      }>
      <ThemedView style={styles.container}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>Resultados</ThemedText>
          <ThemedText style={styles.subtitle}>Análisis de tus preferencias políticas</ThemedText>
        </View>
        
        <ThemedView style={styles.cardContainer}>
          <ThemedText type="subtitle">Tu perfil político</ThemedText>
          <ThemedText style={styles.paragraph}>
            Aquí podrás ver los resultados de tu cuestionario y descubrir tu posición
            en el espectro político.
          </ThemedText>
        </ThemedView>
        
      <Collapsible title="Espectro político">
        <ThemedText style={styles.paragraph}>
          El espectro político es una representación de diferentes posiciones ideológicas
          que ayuda a entender dónde se sitúan las diferentes posturas políticas.
        </ThemedText>
        <ExternalLink href="https://es.wikipedia.org/wiki/Espectro_político">
          <ThemedText type="link">Más información</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="Progresismo vs. Conservadurismo">
        <ThemedText style={styles.paragraph}>
          Este eje representa las actitudes hacia el cambio social y cultural.
          El progresismo favorece reformas sociales y cambios en las tradiciones,
          mientras que el conservadurismo tiende a preservar las instituciones y valores tradicionales.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Liberalismo vs. Estatismo económico">
        <ThemedText style={styles.paragraph}>
          Este eje representa las posturas sobre el papel del Estado en la economía.
          El liberalismo económico favorece el libre mercado con mínima intervención estatal,
          mientras que las posturas más estatistas defienden mayor regulación y
          presencia del Estado en asuntos económicos.
        </ThemedText>
        <ExternalLink href="https://es.wikipedia.org/wiki/Liberalismo_económico">
          <ThemedText type="link">Más información</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="Nacionalismo vs. Globalismo">
        <ThemedText style={styles.paragraph}>
          Este eje representa las posturas sobre la soberanía nacional frente a la 
          integración internacional. El nacionalismo prioriza la identidad, cultura e 
          intereses nacionales, mientras que el globalismo favorece la cooperación 
          internacional y la integración supranacional.
        </ThemedText>
        <ExternalLink href="https://es.wikipedia.org/wiki/Nacionalismo">
          <ThemedText type="link">Más información</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="Interpretar tus resultados">
        <ThemedText style={styles.paragraph}>
          Recuerda que estos resultados son orientativos y que las posturas políticas
          son mucho más complejas que simples etiquetas. El objetivo de esta app
          es ayudarte a reflexionar sobre tus propias ideas sin prejuicios ideológicos.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Pronto aquí podrás ver gráficos que representarán de forma visual 
          tus preferencias y cómo se comparan con las propuestas de diferentes 
          partidos políticos y candidatos.
        </ThemedText>
      </Collapsible>
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
  headerIcon: {
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
  }
});
