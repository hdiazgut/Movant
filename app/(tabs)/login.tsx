import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [esRegistro, setEsRegistro] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    if (esRegistro) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert('Error: ' + error.message);
      } else {
        alert('¡Cuenta creada! Revisa tu email para confirmar.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert('Error: ' + error.message);
      } else {
        router.replace('/(tabs)');
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>🚚</Text>
        </View>
        <Text style={styles.logoText}>FleteYa</Text>
        <Text style={styles.logoSubtitle}>
          {esRegistro ? 'Crea tu cuenta' : 'Inicia sesión'}
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={styles.btnPrimaryText}>
            {loading ? 'Cargando...' : esRegistro ? 'Crear cuenta' : 'Ingresar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSwitch}
          onPress={() => setEsRegistro(!esRegistro)}
        >
          <Text style={styles.btnSwitchText}>
            {esRegistro
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { width: 72, height: 72, backgroundColor: '#0F6E56', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoEmoji: { fontSize: 32 },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#0F6E56' },
  logoSubtitle: { fontSize: 15, color: '#888', marginTop: 4 },
  form: { gap: 12 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 13, color: '#555', fontWeight: '500' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, fontSize: 14, color: '#222', borderWidth: 0.5, borderColor: '#ddd' },
  btnPrimary: { backgroundColor: '#0F6E56', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnDisabled: { backgroundColor: '#9FE1CB' },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnSwitch: { alignItems: 'center', padding: 12 },
  btnSwitchText: { fontSize: 14, color: '#0F6E56' },
});