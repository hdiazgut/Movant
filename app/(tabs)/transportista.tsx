import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const serviciosDisponibles = [
  { id: 'mudanza', icon: '🏠', label: 'Mudanzas' },
  { id: 'carga', icon: '🏗️', label: 'Carga pesada' },
  { id: 'materiales', icon: '🌿', label: 'Materiales' },
  { id: 'comercial', icon: '🏪', label: 'Comercial' },
];

const horasDisponibles = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
const horasOcupadas = ['08:00'];

export default function TransportistaScreen() {
  const [disponible, setDisponible] = useState(true);
  const [servicios, setServicios] = useState(['mudanza', 'carga']);
  const [horas, setHoras] = useState(['10:00', '12:00', '16:00']);

  const toggleServicio = (id: string) => {
    setServicios(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleHora = (hora: string) => {
    if (horasOcupadas.includes(hora)) return;
    setHoras(prev =>
      prev.includes(hora) ? prev.filter(h => h !== hora) : [...prev, hora]
    );
  };

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Mi perfil</Text>
            <Text style={styles.headerSub}>Transportista</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{disponible ? '● Disponible' : '○ No disponible'}</Text>
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
            <Text style={styles.avatarText}>CR</Text>
          </View>
          <View>
            <Text style={styles.driverName}>Carlos Ramírez</Text>
            <Text style={styles.driverStars}>★★★★☆ 4.7 · 38 viajes</Text>
          </View>
        </View>
      </View>

      {/* No disponible aviso */}
      {!disponible && (
        <View style={styles.noDisponibleBanner}>
          <Text style={styles.noDisponibleText}>⚠️ Estás marcado como no disponible. Los clientes no te verán.</Text>
        </View>
      )}

      {/* Vehículo */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MI VEHÍCULO</Text>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🚛</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Camión 3/4 · BBCD 45</Text>
            <Text style={styles.cardSub}>Capacidad: 2 toneladas · Caja abierta</Text>
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

      {/* Disponibilidad */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MI DISPONIBILIDAD HOY</Text>
        <View style={styles.timeGrid}>
          {horasDisponibles.map((hora) => {
            const ocupada = horasOcupadas.includes(hora);
            const seleccionada = horas.includes(hora);
            return (
              <TouchableOpacity
                key={hora}
                disabled={ocupada}
                onPress={() => toggleHora(hora)}
                style={[
                  styles.timeBtn,
                  ocupada && styles.timeBtnTaken,
                  seleccionada && styles.timeBtnActive,
                ]}
              >
                <Text style={[
                  styles.timeBtnText,
                  ocupada && styles.timeBtnTextTaken,
                  seleccionada && styles.timeBtnTextActive,
                ]}>{hora}</Text>
                {ocupada && <Text style={styles.timeBtnSub}>Reservado</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Guardar */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.btnGuardar}>
          <Text style={styles.btnGuardarText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#0F6E56', padding: 24, paddingTop: 60 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13, color: '#9FE1CB', marginTop: 2 },
  switchRow: { alignItems: 'center', gap: 6 },
  switchLabel: { color: '#9FE1CB', fontSize: 12 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#9FE1CB', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '600', color: '#085041' },
  driverName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  driverStars: { fontSize: 12, color: '#9FE1CB', marginTop: 2 },
  noDisponibleBanner: { backgroundColor: '#FFF8E1', padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#FFD54F' },
  noDisponibleText: { fontSize: 13, color: '#795548', textAlign: 'center' },
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
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeBtn: { width: '30%', backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 0.5, borderColor: '#ddd' },
  timeBtnActive: { backgroundColor: '#E1F5EE', borderColor: '#5DCAA5' },
  timeBtnTaken: { backgroundColor: '#f5f5f5', borderColor: '#eee' },
  timeBtnText: { fontSize: 13, color: '#222' },
  timeBtnTextActive: { color: '#0F6E56', fontWeight: '600' },
  timeBtnTextTaken: { color: '#ccc', textDecorationLine: 'line-through' },
  timeBtnSub: { fontSize: 10, color: '#ccc', marginTop: 2 },
  btnGuardar: { backgroundColor: '#0F6E56', padding: 18, borderRadius: 12, alignItems: 'center' },
  btnGuardarText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});