import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const vehiculos = ['Todos', 'Camioneta', 'Camión 3/4', 'Camión grande'];
const servicios = ['Mudanza', 'Carga pesada', 'Materiales', 'Comercial'];

const transportistas = [
  { id: 1, nombre: 'Carlos R.', iniciales: 'CR', vehiculo: 'Camión 3/4', servicio: 'Mudanza', capacidad: '2 ton', estrellas: '★★★★☆', rating: 4.7, viajes: 38, precio: '$25.000', color: '#9FE1CB', colorTexto: '#085041' },
  { id: 2, nombre: 'María L.', iniciales: 'ML', vehiculo: 'Camioneta', servicio: 'Materiales', capacidad: '700 kg', estrellas: '★★★★★', rating: 4.9, viajes: 62, precio: '$18.000', color: '#B5D4F4', colorTexto: '#042C53' },
  { id: 3, nombre: 'Jorge P.', iniciales: 'JP', vehiculo: 'Camión grande', servicio: 'Carga pesada', capacidad: '5 ton', estrellas: '★★★★☆', rating: 4.5, viajes: 21, precio: '$40.000', color: '#F4C0D1', colorTexto: '#4B1528' },
];

export default function ClienteScreen() {
  const [vehiculo, setVehiculo] = useState('Todos');
  const [servicio, setServicio] = useState('Mudanza');

  const filtrados = transportistas.filter(t => {
    const matchVehiculo = vehiculo === 'Todos' || t.vehiculo === vehiculo;
    const matchServicio = t.servicio === servicio;
    return matchVehiculo && matchServicio;
  });

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar transportista</Text>
        <Text style={styles.headerSub}>Santiago · Hoy</Text>
      </View>

      <View style={styles.content}>

        {/* Filtro vehículo */}
        <Text style={styles.sectionLabel}>TIPO DE VEHÍCULO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.pillRow}>
            {vehiculos.map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.pill, vehiculo === v && styles.pillActive]}
                onPress={() => setVehiculo(v)}
              >
                <Text style={[styles.pillText, vehiculo === v && styles.pillTextActive]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Filtro servicio */}
        <Text style={styles.sectionLabel}>TIPO DE SERVICIO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.pillRow}>
            {servicios.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.pill, servicio === s && styles.pillActive]}
                onPress={() => setServicio(s)}
              >
                <Text style={[styles.pillText, servicio === s && styles.pillTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Resultados */}
        <Text style={styles.sectionLabel}>DISPONIBLES AHORA ({filtrados.length})</Text>

        {filtrados.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No hay transportistas disponibles con ese filtro</Text>
          </View>
        ) : (
          filtrados.map((t) => (
            <View key={t.id} style={styles.driverCard}>
              <View style={[styles.avatar, { backgroundColor: t.color }]}>
                <Text style={[styles.avatarText, { color: t.colorTexto }]}>{t.iniciales}</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{t.nombre}</Text>
                <Text style={styles.driverDetail}>{t.vehiculo} · {t.servicio}</Text>
                <Text style={styles.driverDetail}>{t.capacidad}</Text>
                <Text style={styles.driverStars}>{t.estrellas} {t.rating} · {t.viajes} viajes</Text>
              </View>
              <View>
                <Text style={styles.price}>{t.precio}</Text>
                <Text style={styles.priceUnit}>/hora</Text>
              </View>
            </View>
          ))
        )}

        {/* Botón agendar */}
        {filtrados.length > 0 && (
          <TouchableOpacity
            style={styles.btnAgendar}
            onPress={() => router.push('/(tabs)/agenda')}
          >
            <Text style={styles.btnAgendarText}>Ver disponibilidad →</Text>
          </TouchableOpacity>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#0F6E56', padding: 24, paddingTop: 60 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13, color: '#9FE1CB', marginTop: 4 },
  content: { padding: 16 },
  sectionLabel: { fontSize: 11, color: '#888', fontWeight: '600', marginBottom: 10, marginTop: 16, letterSpacing: 1 },
  pillRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ddd' },
  pillActive: { backgroundColor: '#0F6E56', borderColor: '#0F6E56' },
  pillText: { fontSize: 13, color: '#555' },
  pillTextActive: { color: '#fff', fontWeight: '600' },
  driverCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 0.5, borderColor: '#eee' },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontWeight: '600' },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 14, fontWeight: '600', color: '#222' },
  driverDetail: { fontSize: 12, color: '#888', marginTop: 2 },
  driverStars: { fontSize: 12, color: '#BA7517', marginTop: 2 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#0F6E56', textAlign: 'right' },
  priceUnit: { fontSize: 11, color: '#888', textAlign: 'right' },
  empty: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#888', textAlign: 'center' },
  btnAgendar: { backgroundColor: '#0F6E56', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnAgendarText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});