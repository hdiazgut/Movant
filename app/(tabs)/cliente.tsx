import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabase';

const vehiculos = ['Todos', 'Camioneta', 'Camión 3/4', 'Camión grande'];
const servicios = ['Mudanza', 'Carga pesada', 'Materiales', 'Comercial'];

export default function ClienteScreen() {
  const [vehiculo, setVehiculo] = useState('Todos');
  const [servicio, setServicio] = useState('Mudanza');
  const [transportistas, setTransportistas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTransportistas();
  }, []);

  const cargarTransportistas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Transportistas')
      .select('*')
      .eq('Disponible', true);

    if (error) {
      console.error('Error:', error.message);
    } else {
      setTransportistas(data || []);
    }
    setLoading(false);
  };

  const filtrados = transportistas.filter(t => {
    const matchVehiculo = vehiculo === 'Todos' || t.Vehiculo === vehiculo;
    const matchServicio = t.Servicios?.includes(servicio);
    return matchVehiculo && matchServicio;
  });

  const getIniciales = (nombre: string) => {
    return nombre?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const colores = ['#9FE1CB', '#B5D4F4', '#F4C0D1', '#FAC775', '#C0DD97'];
  const textosColores = ['#085041', '#042C53', '#4B1528', '#633806', '#27500A'];

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0F6E56" />
            <Text style={styles.loadingText}>Buscando transportistas...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>DISPONIBLES AHORA ({filtrados.length})</Text>

            {filtrados.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>No hay transportistas disponibles con ese filtro</Text>
              </View>
            ) : (
              filtrados.map((t, index) => (
                <View key={t.id || index} style={styles.driverCard}>
                  <View style={[styles.avatar, { backgroundColor: colores[index % colores.length] }]}>
                    <Text style={[styles.avatarText, { color: textosColores[index % textosColores.length] }]}>
                      {getIniciales(t.Nombre)}
                    </Text>
                  </View>
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>{t.Nombre}</Text>
                    <Text style={styles.driverDetail}>{t.Vehiculo} · {t.Servicios}</Text>
                    <Text style={styles.driverStars}>★★★★☆ {t.Rating || 5.0} · {t.Viajes || 0} viajes</Text>
                  </View>
                  <View>
                    <Text style={styles.price}>${t.Precio?.toLocaleString()}</Text>
                    <Text style={styles.priceUnit}>/hora</Text>
                  </View>
                </View>
              ))
            )}

            {filtrados.length > 0 && (
              <TouchableOpacity
                style={styles.btnAgendar}
                onPress={() => router.push('/(tabs)/agenda')}
              >
                <Text style={styles.btnAgendarText}>Ver disponibilidad →</Text>
              </TouchableOpacity>
            )}
          </>
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
  loadingContainer: { alignItems: 'center', padding: 40 },
  loadingText: { fontSize: 14, color: '#888', marginTop: 12 },
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