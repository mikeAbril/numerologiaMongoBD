<template>
  <q-page padding class="text-white">
    <!-- CABECERA DINÁMICA -->
    <div class="row items-end justify-between q-mb-xl animate-fade">
      <div class="col-12 col-md-8">
        <div class="text-overline text-amber-5 letter-spacing-2">SINTONÍA ACTUAL</div>
        <h2 class="text-h2 cinzel-font q-ma-none text-glow">Cosmos Personal</h2>
        <p class="text-subtitle1 text-indigo-3 q-mt-sm">Tus energías vibran hoy en una frecuencia alta.</p>
      </div>
    </div>

    <!-- KPIs DE ENERGÍA (Estilo Moderno) -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-4" v-for="kpi in kpis" :key="kpi.label">
        <q-card class="kpi-card-modern glass-card-dark">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-5">{{ kpi.label }}</div>
              <div class="text-h4 text-weight-bolder text-white">{{ kpi.valor }}</div>
            </div>
            <div class="kpi-icon-box" :style="{ background: kpi.bg }">
              <q-icon :name="kpi.icon" size="sm" :color="kpi.color" />
            </div>
          </q-card-section>
          <q-linear-progress :value="kpi.progreso" :color="kpi.color" class="q-mt-md" rounded />
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- RITUAL DEL DÍA -->
      <div class="col-12 col-md-7">
        <q-card class="ritual-card-premium glass-card-dark full-height q-pa-lg">
           <div class="row items-center justify-between q-mb-lg">
              <div class="text-h5 cinzel-font text-amber-5">Ritual de Conexión</div>
              <q-badge outline color="amber-5" label="Misión Diaria" />
           </div>
           
           <div class="ritual-content-box q-pa-xl text-center">
              <q-icon name="flare" size="80px" color="amber-5" class="q-mb-md opacity-40 animate-pulse" />
              <div class="text-h6 text-white q-mb-sm">"Frecuencia de Silencio"</div>
              <p class="text-grey-4 text-body1">Dedica 5 minutos a la respiración profunda. Visualiza un hilo de luz dorada conectando tu corazón con el centro de la galaxia.</p>
              
              <q-btn label="COMPLETAR RITUAL" color="indigo-7" rounded unelevated class="q-mt-xl q-px-xl mystic-btn" icon="done" />
           </div>
        </q-card>
      </div>

      <!-- MINI GRÁFICO DE ENERGÍA -->
      <div class="col-12 col-md-5">
        <q-card class="glass-card-dark full-height q-pa-lg">
           <div class="text-h6 cinzel-font text-indigo-3 q-mb-xl">Variación Energética</div>
           <div class="energy-chart-mini flex justify-around items-end">
              <div v-for="(h, index) in energyData" :key="index" class="bar-mini" :style="{ height: h + '%' }">
                 <q-tooltip>Energía: {{ h }}%</q-tooltip>
              </div>
           </div>
           <div class="row justify-around q-mt-md text-caption text-grey-6">
              <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
           </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getData } from '../../services/services'
import { useAuthStore } from '../../store/Auth'

const authStore = useAuthStore()

const energyData = ref([40, 70, 55, 90, 60, 85, 45])

const kpis = ref([
    { label: "VIBRACIÓN HOY", valor: "--", icon: "bolt", color: "amber-5", bg: "rgba(251, 191, 36, 0.1)", progreso: 0 },
    { label: "RACHA MÍSTICA", valor: "0 DÍAS", icon: "local_fire_department", color: "orange-8", bg: "rgba(249, 115, 22, 0.1)", progreso: 0 },
    { label: "ALINEACIÓN", valor: "0%", icon: "join_inner", color: "indigo-5", bg: "rgba(99, 102, 241, 0.1)", progreso: 0 }
])

onMounted(async () => {
    try {
        const res = await getData(`lectura/${authStore.usuario._id}`)
        if (res && res.lecturas) {
            const diarias = res.lecturas.filter(l => l.tipo === 'diaria').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
            
            // Racha
            kpis.value[1].valor = `${diarias.length} DÍAS`
            kpis.value[1].progreso = Math.min(diarias.length / 30, 1)

            // Alineacion (basada en constancia)
            const alineacion = diarias.length > 0 ? Math.min(50 + (diarias.length * 5), 99) : 10
            kpis.value[2].valor = `${alineacion}%`
            kpis.value[2].progreso = alineacion / 100

            if (diarias.length > 0) {
                let cont = diarias[0].contenido
                if (typeof cont === 'string') cont = JSON.parse(cont)
                const vib = cont.energiaDelDia || cont.numeroDia || "Alta"
                kpis.value[0].valor = String(vib).replace('Vibración ', '').toUpperCase()
                kpis.value[0].progreso = 0.9
            }
        }
    } catch (e) {
        console.error(e)
    }
})
</script>

<style scoped>
.text-glow { text-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
.cinzel-font { font-family: 'Cinzel', serif; }
.letter-spacing-2 { letter-spacing: 2px; }

.glass-card-dark {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
}

.kpi-card-modern {
  padding: 20px;
  transition: transform 0.3s ease;
}
.kpi-card-modern:hover { transform: translateY(-5px); }

.kpi-icon-box {
  width: 45px; height: 45px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}

.ritual-card-premium {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.energy-chart-mini { height: 200px; padding-bottom: 10px; }
.bar-mini {
  width: 15px; background: rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  position: relative;
  transition: all 0.5s ease;
}
.bar-mini:hover { background: #fbbf24; cursor: pointer; }

.mystic-btn {
  letter-spacing: 2px; font-weight: bold;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
}

.animate-fade { animation: fadeIn 1s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>