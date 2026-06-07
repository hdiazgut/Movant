import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../supabase';

const serviciosDisponibles = [
  { id: 'mudanza', icon: '🏠', label: 'Mudanzas' },
  { id: 'carga', icon: '🏗️', label: 'Carga pesada' },
  { id: 'materiales', icon: '🌿', label: 'Materiales' },
  { id: 'comercial', icon: '🏢', label: 'Comercial' },
];

const TABLA = 'Transportistas';

export default function TransportistaScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Datos del perfil — nombres de columna con mayúscula igual que en Supabase
  const [nombre, setNombre] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [patente, setPatente] = useState('');
  const [precio, setPrecio] = useState(0);
  const [disponible, setDisponible] = useState(true);
  const [servicios, setServicios] = useState<string[]>([]);
  const [reputacion, setReputacion] = useState(5.0);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        Alert.alert('Sesión expirada', 'Por favor, vuelve a iniciar sesión.');
        return;
      }

      setUserId(user.id);

      // Buscar el perfil por user_id (columna que vincula con auth.users)
      const { data, error } = await supabase
        .from(TABLA)
        .select('*')
        .eq('user_id', user.id)   // ✅ busca por user_id, no por id
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          Alert.alert('Perfil incompleto', 'No encontramos tu perfil. ¿Ya completaste el registro?');
        } else {
          throw error;
        }
        return;
      }

      if (data) {
        setNombre(data.Nombre || 'Sin nombre');
        setVehiculo(data.Vehiculo || 'No especificado');
        setPatente(data.Patente || 'S/P');
        setPrecio(data.Precio || 0);
        setDisponible(data.Disponible ?? true);
        // Servicios viene como string "mudanza, carga" → convertir a array
        const srv = data.Servicios;
        if (Array.isArray(srv)) {
          setServicios(srv);
        } else if (typeof srv === 'string' && srv.length > 0) {
          setServicios(srv.split(',').map((s: string) => s.trim()));
        } else {
          setServicios([]);
        }
        setReputacion(data.Rating || 5.0);
      }
    } catch (error: any) {
      Alert.alert('Error al cargar perfil', error.message);
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async () => {
    if (!userId) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from(TABLA)
        .update({
          Disponible: disponible,
          Servicios: servicios.join(', '),  // guardar como string igual que al crear
        })
        .eq('user_id', userId);  // ✅ busca por user_id

      if (error) throw error;

      Alert.alert('FleteYa', '¡Cambios guardados con éxito!');
    } catch (error: any) {
      Alert.alert('Error al guardar', error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleServicio = (id: string) => {
    setServicios(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0F6E56" />
        <Text style={styles.loadingText}>Cargando tu perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Mi perfil</Text>
            <Text style={styles.headerSub}>Transportista verificado</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{disponible ? '● Activo' : '○ Apagado'}</Text>
            <Switch
              value={disponible}
              onValueChange={setDisponible}
              trackColor={{ false: '#555', true: '#9FE1CB' }}
              thumbColor={disponible ? '#fff' : '#aaa'}
            />
          </View>
        </View>

        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{nombre.substring(0, 2).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.driverName}>{nombre}</Text>
            <Text style={styles.driverStars}>★ {reputacion.toFixed(1)} · Conductor FleteYa</Text>
          </View>
        </View>
      </View>

      {/* Banner desconectado */}
      {!disponible && (
        <View style={styles.noDisponibleBanner}>
          <Text style={styles.noDisponibleText}>
            ⚠️ Estás en modo desconectado. Los clientes no pueden agendarte ahora.
          </Text>
        </View>
      )}

      {/* Vehículo */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MI VEHÍCULO</Text>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🚛</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{vehiculo} · {patente}</Text>
            <Text style={styles.cardSub}>Tarifa base: ${precio.toLocaleString('es-CL')}/hora</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Activo</Text>
          </View>
        </View>
      </View>

      {/* Servicios */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SERVICIOS QUE OFREZCO ({servicios.length})</Text>
        <View style={styles.serviceGrid}>
          {serviciosDisponibles.map((s) => {
            const activo = servicios.includes(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.serviceBtn, activo && styles.serviceBtnActive]}
                onPress={() => toggleServicio(s.id)}
              >
                <Text style={styles.serviceIcon}>{s.icon}</Text>
                <Text style={[styles.serviceLabel, activo && styles.serviceLabelActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Botón guardar */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.btnGuardar, saving && styles.btnGuardarDisabled]}
          onPress={guardarCambios}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnGuardarText}>Guardar cambios en la nube</Text>
          )}
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  loadingText: { marginTop: 12, color: '#555', fontSize: 14 },
  header: { backgroundColor: '#0F6E56', padding: 24, paddingTop: 60 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13, color: '#9FE1CB', marginTop: 2 },
  switchRow: { alignItems: 'center', gap: 6 },
  switchLabel: { color: '#9FE1CB', fontSize: 12, fontWeight: '600' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#9FE1CB', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '600', color: '#085041' },
  driverName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  driverStars: { fontSize: 12, color: '#9FE1CB', marginTop: 2 },
  noDisponibleBanner: { backgroundColor: '#FFF8E1', padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#FFD54F' },
  noDisponibleText: { fontSize: 13, color: '#795548', textAlign: 'center', fontWeight: '500' },
  section: { padding: 16, marginBottom: 4 },
  sectionLabel: { fontSize: 11, color: '#888', fontWeight: '600', marginBottom: 10, letterSpacing: 1 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 0.5, borderColor: '#eee' },
  cardIcon: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#222' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },
  activeBadge: { backgroundColor: '#E1F5EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  activeBadgeText: { fontSize: 11, color: '#0F6E56', fontWeight: '600' },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceBtn: { width: '47%', backgroundColor: '#fff', borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: '#ddd' },
  serviceBtnActive: { backgroundColor: '#E1F5EE', borderColor: '#5DCAA5' },
  serviceIcon: { fontSize: 20, marginBottom: 6 },
  serviceLabel: { fontSize: 13, color: '#555', fontWeight: '500' },
  serviceLabelActive: { fontSize: 13, color: '#0F6E56', fontWeight: '500' },
  btnGuardar: { backgroundColor: '#0F6E56', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnGuardarDisabled: { backgroundColor: '#7ABFB0' },
  btnGuardarText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});