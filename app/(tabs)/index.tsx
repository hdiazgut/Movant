import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>🚚</Text>
        </View>
        <Text style={styles.logoText}>FleteYa</Text>
        <Text style={styles.logoSubtitle}>Conecta con transportistas de confianza</Text>
      </View>

      {/* Botones de rol */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.btnPrimary}
          onPress={() => router.push('/(tabs)/cliente')}
        >
          <Text style={styles.btnPrimaryText}>📦  Necesito un flete</Text>
        </TouchableOpacity>

        <TouchableOpacity 
  style={styles.btnSecondary}
  onPress={() => router.push('/(tabs)/registro')}
>
  <Text style={styles.btnSecondaryText}>🚛  Soy transportista</Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.btnLogin}
  onPress={() => router.push('/(tabs)/login')}
>
  <Text style={styles.btnLoginText}>¿Ya tienes cuenta? Inicia sesión</Text>
</TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#0F6E56',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 36,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0F6E56',
    marginBottom: 8,
  },
  logoSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: '#0F6E56',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0F6E56',
  },
  btnSecondaryText: {
    color: '#0F6E56',
    fontSize: 16,
    fontWeight: '600',
  },
  btnLogin: { alignItems: 'center', padding: 12, marginTop: 4 },
btnLoginText: { fontSize: 14, color: '#0F6E56' },
});