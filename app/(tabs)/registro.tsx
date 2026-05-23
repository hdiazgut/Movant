import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabase';

const vehiculos = [
  { id: 'camioneta', icon: '🚐', label: 'Camioneta', capacidad: 'hasta 700 kg' },
  { id: 'camion34', icon: '🚛', label: 'Camión 3/4', capacidad: 'hasta 2 ton' },
  { id: 'camiongrande', icon: '🚚', label: 'Camión grande', capacidad: 'hasta 5 ton' },
];

const servicios = [
  { id: 'mudanza', icon: '🏠', label: 'Mudanzas' },
  { id: 'carga', icon: '🏗️', label: 'Carga pesada' },
  { id: 'materiales', icon: '🌿', label: 'Materiales' },
  { id: 'comercial', icon: '🏪', label: 'Comercial' },
];

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [patente, setPatente] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([]);
  const [precio, setPrecio] = useState('');

  const toggleServicio = (id: string) => {
    setServiciosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const puedeRegistrarse =
    nombre !== '' &&
    patente !== '' &&
    vehiculo !== '' &&
    serviciosSeleccionados.length > 0 &&
    precio !== '';

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Registro de transportista</Text>
        <Text style={styles.headerSub}>Completa tu perfil para comenzar</Text>
      </View>

      <View style={styles.content}>

        {/* Datos personales */}
        <Text style={styles.sectionLabel}>DATOS PERSONALES</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Carlos Ramírez"
            placeholderTextColor="#aaa"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        {/* Vehículo */}
        <Text style={styles.sectionLabel}>TIPO DE VEHÍCULO</Text>
        {vehiculos.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={[styles.vehiculoCard, vehiculo === v.id && styles.vehiculoCardActive]}
            onPress={() => setVehiculo(v.id)}
          >
            <Text style={styles.vehiculoIcon}>{v.icon}</Text>
            <View style={styles.vehiculoInfo}>
              <Text style={[styles.vehiculoLabel, vehiculo === v.id && styles.vehiculoLabelActive]}>
                {v.label}
              </Text>
              <Text style={styles.vehiculoCapacidad}>{v.capacidad}</Text>
            </View>
            <View style={[styles.radioCircle, vehiculo === v.id && styles.radioCircleActive]}>
              {vehiculo === v.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Patente */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Patente del vehículo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: BBCD45"
            placeholderTextColor="#aaa"
            value={patente}
            onChangeText={setPatente}
            autoCapitalize="characters"
          />
        </View>

        {/* Servicios */}
        <Text style={styles.sectionLabel}>SERVICIOS QUE OFRECES</Text>
        <View style={styles.serviceGrid}>
          {servicios.map((s) => {
            const activo = serviciosSeleccionados.includes(s.id);
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

        {/* Precio */}
        <Text style={styles.sectionLabel}>PRECIO POR HORA</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>¿Cuánto cobras por hora? (en pesos)</Text>
          <View style={styles.precioRow}>
            <Text style={styles.precioSigno}>$</Text>
            <TextInput
              style={[styles.input, styles.precioInput]}
              placeholder="Ej: 25000"
              placeholderTextColor="#aaa"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Aviso */}
        {!puedeRegistrarse && (
          <View style={styles.aviso}>
            <Text style={styles.avisoText}>📋 Completa todos los campos para continuar</Text>
          </View>
        )}

        {/* Botón registrarse */}
        <TouchableOpacity
          style={[styles.btnRegistrar, !puedeRegistrarse && styles.btnRegistrarDisabled]}
          disabled={!puedeRegistrarse}
          onPress={async () => {
  const { error } = await supabase
    .from('Transportistas')
    .insert([{
      Nombre: nombre,
      Patente: patente,
      Vehiculo: vehiculo,
      Servicios: serviciosSeleccionados.join(', '),
      Precio: parseInt(precio),
      Disponible: true,
      Rating: 5.0,
      Viajes: 0,
    }]);

  if (error) {
    alert('Error al registrar: ' + error.message);
  } else {
    alert('¡Perfil creado con éxito!');
    router.push('/(tabs)/transportista');
  }
}}
        >
          <Text style={styles.btnRegistrarText}>Crear mi perfil →</Text>
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
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 13, color: '#555', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, fontSize: 14, color: '#222', borderWidth: 0.5, borderColor: '#ddd' },
  precioRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  precioSigno: { fontSize: 20, fontWeight: 'bold', color: '#0F6E56' },
  precioInput: { flex: 1 },
  vehiculoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 0.5, borderColor: '#ddd' },
  vehiculoCardActive: { backgroundColor: '#E1F5EE', borderColor: '#5DCAA5' },
  vehiculoIcon: { fontSize: 28 },
  vehiculoInfo: { flex: 1 },
  vehiculoLabel: { fontSize: 14, fontWeight: '600', color: '#222' },
  vehiculoLabelActive: { color: '#0F6E56' },
  vehiculoCapacidad: { fontSize: 12, color: '#888', marginTop: 2 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  radioCircleActive: { borderColor: '#0F6E56' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0F6E56' },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceBtn: { width: '47%', backgroundColor: '#fff', borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: '#ddd' },
  serviceBtnActive: { backgroundColor: '#E1F5EE', borderColor: '#5DCAA5' },
  serviceIcon: { fontSize: 20, marginBottom: 6 },
  serviceLabel: { fontSize: 13, color: '#555', fontWeight: '500' },
  serviceLabelActive: { fontSize: 13, color: '#0F6E56', fontWeight: '500' },
  aviso: { backgroundColor: '#FFF8E1', padding: 12, borderRadius: 8, marginTop: 16, borderWidth: 0.5, borderColor: '#FFD54F' },
  avisoText: { fontSize: 13, color: '#795548', textAlign: 'center' },
  btnRegistrar: { backgroundColor: '#0F6E56', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  btnRegistrarDisabled: { backgroundColor: '#9FE1CB' },
  btnRegistrarText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnVolver: { backgroundColor: '#fff', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 30, borderWidth: 0.5, borderColor: '#ddd' },
  btnVolverText: { color: '#555', fontSize: 15 },
});