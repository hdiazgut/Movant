import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const dias = ['Hoy', 'Mañana', 'Mié 18', 'Jue 19'];
const horas = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
const horasTomadas = ['08:00', '10:00', '18:00'];
const servicios = [
  { id: 'mudanza', icon: '🏠', label: 'Mudanza' },
  { id: 'carga', icon: '🏗️', label: 'Carga pesada' },
  { id: 'materiales', icon: '🌿', label: 'Materiales' },
  { id: 'comercial', icon: '🏪', label: 'Comercial' },
];

export default function AgendaScreen() {
  const [diaSeleccionado, setDiaSeleccionado] = useState('Mañana');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState('mudanza');

  const puedeConfirmar = horaSeleccionada !== '';

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agendar con Carlos R.</Text>
        <Text style={styles.headerSub}>Camión 3/4 · Mudanzas y carga pesada</Text>
      </View>

      <View style={styles.content}>

        {/* Días */}
        <Text style={styles.sectionLabel}>SELECCIONA FECHA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.diaRow}>
            {dias.map((dia) => (
              <TouchableOpacity
                key={dia}
                style={[styles.diaBtn, diaSeleccionado === dia && styles.diaBtnActive]}
                onPress={() => setDiaSeleccionado(dia)}
              >
                <Text style={[styles.diaBtnText, diaSeleccionado === dia && styles.diaBtnTextActive]}>
                  {dia}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Horas */}
        <Text style={styles.sectionLabel}>HORARIO DISPONIBLE</Text>
        <View style={styles.timeGrid}>
          {horas.map((hora) => {
            const tomada = horasTomadas.includes(hora);
            const seleccionada = horaSeleccionada === hora;
            return (
              <TouchableOpacity
                key={hora}
                disabled={tomada}
                onPress={() => setHoraSeleccionada(hora)}
                style={[
                  styles.timeBtn,
                  tomada && styles.timeBtnTaken,
                  seleccionada && styles.timeBtnActive,
                ]}
              >
                <Text style={[
                  styles.timeBtnText,
                  tomada && styles.timeBtnTextTaken,
                  seleccionada && styles.timeBtnTextActive,
                ]}>{hora}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Servicio */}
        <Text style={styles.sectionLabel}>TIPO DE SERVICIO</Text>
        <View style={styles.serviceGrid}>
          {servicios.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.serviceBtn, servicioSeleccionado === s.id && styles.serviceBtnActive]}
              onPress={() => setServicioSeleccionado(s.id)}
            >
              <Text style={styles.serviceIcon}>{s.icon}</Text>
              <Text style={[styles.serviceLabel, servicioSeleccionado === s.id && styles.serviceLabelActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Aviso si no eligió hora */}
        {!puedeConfirmar && (
          <View style={styles.aviso}>
            <Text style={styles.avisoText}>👆 Selecciona una hora disponible para continuar</Text>
          </View>
        )}

        {/* Botón confirmar */}
        <TouchableOpacity
          style={[styles.btnConfirmar, !puedeConfirmar && styles.btnConfirmarDisabled]}
          disabled={!puedeConfirmar}
          onPress={() => router.push('/(tabs)/confirmacion')}
        >
          <Text style={styles.btnConfirmarText}>Confirmar reserva →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnVolver}
          onPress={() => router.back()}
        >
          <Text style={styles.btnVolverText}>← Volver</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#0F6E56', padding: 24, paddingTop: 60 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13, color: '#9FE1CB', marginTop: 4 },
  content: { padding: 16 },
  sectionLabel: { fontSize: 11, color: '#888', fontWeight: '600', marginBottom: 10, marginTop: 20, letterSpacing: 1 },
  diaRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  diaBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ddd' },
  diaBtnActive: { backgroundColor: '#0F6E56' },
  diaBtnText: { fontSize: 13, color: '#555' },
  diaBtnTextActive: { color: '#fff', fontWeight: '600' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeBtn: { width: '30%', backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 0.5, borderColor: '#ddd' },
  timeBtnActive: { backgroundColor: '#E1F5EE', borderColor: '#5DCAA5' },
  timeBtnTaken: { backgroundColor: '#f5f5f5', borderColor: '#eee' },
  timeBtnText: { fontSize: 13, color: '#222' },
  timeBtnTextActive: { color: '#0F6E56', fontWeight: '600' },
  timeBtnTextTaken: { color: '#ccc', textDecorationLine: 'line-through' },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceBtn: { width: '47%', backgroundColor: '#fff', borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: '#ddd' },
  serviceBtnActive: { backgroundColor: '#E1F5EE', borderColor: '#5DCAA5' },
  serviceIcon: { fontSize: 22, marginBottom: 6 },
  serviceLabel: { fontSize: 13, color: '#555', fontWeight: '500' },
  serviceLabelActive: { fontSize: 13, color: '#0F6E56', fontWeight: '500' },
  aviso: { backgroundColor: '#FFF8E1', padding: 12, borderRadius: 8, marginTop: 16, borderWidth: 0.5, borderColor: '#FFD54F' },
  avisoText: { fontSize: 13, color: '#795548', textAlign: 'center' },
  btnConfirmar: { backgroundColor: '#0F6E56', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  btnConfirmarDisabled: { backgroundColor: '#9FE1CB' },
  btnConfirmarText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnVolver: { backgroundColor: '#fff', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, borderWidth: 0.5, borderColor: '#ddd' },
  btnVolverText: { color: '#555', fontSize: 15 },
});