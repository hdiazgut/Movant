import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabase';

type TransportistaRow = {
  id: string;
};

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
    try {
      if (esRegistro) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          alert('Error: ' + error.message);
        } else {
          alert('¡Cuenta creada! Revisa tu email para confirmar.');
        }
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert('Error: ' + error.message);
        return;
      }

      // Al iniciar sesión, verificamos si ya existe tu perfil en Transportistas.
      // Si existe, vamos directo a la pantalla del transportista.
      // Si no existe, te enviamos a /registro para completarlo.
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !user) {
        alert('Sesión expirada. Vuelve a iniciar sesión.');
        router.replace('/(tabs)/login');
        return;
      }

      // Nota: ajusta el nombre del campo PK/ID según tu tabla.
      // El error anterior indica que NO existe la columna `id` en `Transportitas/Transportistas`.
      // Intentamos consultar por una columna típica: `id` (auth user id) o `user_id`.
      const {
        data: perfil,
        error: perfilErr,
      } = await supabase
        .from('Transportistas')
        .select('user_id, id')
        .or(`user_id.eq.${user.id},id.eq.${user.id}`)
        .maybeSingle<TransportistaRow>();

      if (perfilErr) {
        // Si no hay perfil, mandamos a registro.
        // PGRST116 = No rows found (Supabase).
        if (perfilErr.code === 'PGRST116') {
          router.replace('/(tabs)/registro');
          return;
        }

        // Si el schema de tu tabla no coincide (por ejemplo, columnas con otros nombres),
        // para no bloquear el login: igual mandamos a registro.
        // Esto te permitirá guardar/crear tu perfil desde /registro.
        console.warn('Error al verificar perfil:', perfilErr);
        router.replace('/(tabs)/registro');
        return;
      }

      // Existe perfil -> vas al perfil.
      router.replace('/(tabs)/transportista');
    } finally {
      setLoading(false);
    }
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