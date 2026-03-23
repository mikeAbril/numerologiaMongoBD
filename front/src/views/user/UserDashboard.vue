<template>
  <q-page class="text-white q-px-lg q-pt-lg">
    
    <!-- BIENVENIDA MÍSTICA -->
    <div class="row justify-center q-mb-xl text-center animate-fade-in">
       <div class="col-12 relative-position">
          <div class="text-overline aura-text transition-colors q-mb-sm">PORTAL DE LA SABIDURÍA</div>
          <h1 class="text-h2 cinzel-font text-white q-ma-none">Bienvenido, <span class="aura-text transition-colors">{{ userNombre }}</span></h1>
          <div class="aura-divider q-mx-auto q-mt-md transition-colors"></div>

          <!-- ORÁCULO FLASH (MANTRA ANIMADO) -->
          <div class="oracle-flash-container q-mt-md">
             <p class="text-h6 text-italic text-grey-4 typewriter-text q-ma-none">"{{ mantraActual }}"</p>
          </div>
       </div>
    </div>

    <!-- KPIs DE ENERGÍA -->
    <div class="row q-col-gutter-md q-mb-lg animate-fade-up">
      <div class="col-12 col-sm-4" v-for="kpi in kpis" :key="kpi.label">
        <q-card class="kpi-card-modern glass-card-dark">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-5">{{ kpi.label }}</div>
              <div class="text-h4 text-weight-bolder text-white">{{ kpi.valor }}</div>
              <div v-if="kpi.subtitulo" class="text-caption text-amber-5 letter-spacing-2 text-weight-bold">{{ kpi.subtitulo }}</div>
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
      <div class="col-12 col-md-8">
        <q-card class="ritual-card-premium holographic-card glass-card-dark full-height q-pa-lg">
           <div class="row items-center justify-between q-mb-lg">
              <div class="text-h5 cinzel-font aura-text">Ritual de Conexión</div>
              <q-badge outline class="aura-badge" label="Misión Diaria" />
           </div>
           
           <div class="ritual-content-box q-pa-xl text-center">
              <q-icon name="flare" size="80px" class="q-mb-md opacity-40 animate-pulse aura-icon" />
              <div class="text-h6 text-white q-mb-sm">"Frecuencia de Silencio"</div>
              <p class="text-grey-4 text-body1">Dedica 5 minutos a la respiración profunda. Visualiza un hilo de luz dorada conectando tu corazón con el centro de la galaxia.</p>
              
              <q-btn label="COMPLETAR RITUAL" color="indigo-7" rounded unelevated class="q-mt-xl q-px-xl mystic-btn" icon="done" />
           </div>
        </q-card>
      </div>

      <!-- MINI GRÁFICO DE ENERGÍA -->
      <div class="col-12 col-md-4">
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

const userNombre = ref(authStore.usuario?.nombre || 'Buscador')
const mantras = [
  "La tranquilidad ilumina tu sendero hacia la prosperidad infinita.",
  "Tus pensamientos tejen la realidad que caminas hoy.",
  "El cosmos conspira a favor de tu paz interior y evolución.",
  "Eres el arquitecto de tu destino y el guardián de tu energía."
]
const mantraActual = ref(mantras[Math.floor(Math.random() * mantras.length)])

const energyData = ref([40, 70, 55, 90, 60, 85, 45])

const kpis = ref([
    { label: "VIBRACIÓN HOY", valor: "--", subtitulo: "...", icon: "bolt", color: "amber-5", bg: "rgba(251, 191, 36, 0.1)", progreso: 0.5 },
    { label: "RACHA MÍSTICA", valor: "0 DÍAS", icon: "local_fire_department", color: "orange-8", bg: "rgba(249, 115, 22, 0.1)", progreso: 0 },
    { label: "ALINEACIÓN", valor: "0%", icon: "join_inner", color: "indigo-5", bg: "rgba(99, 102, 241, 0.1)", progreso: 0 }
])

const reducir = (num) => {
  if ([11, 22, 33].includes(num)) return num;
  while (num > 9) {
      num = num.toString().split("").reduce((a, b) => a + parseInt(b), 0);
  }
  return num;
};

const obtenerVibracionDiaInfo = (n) => {
  const info = {
    1: { nombre: "INICIO", desc: "Nuevas oportunidades" },
    2: { nombre: "ARMONÍA", desc: "Paciencia y unión" },
    3: { nombre: "BRILLO", desc: "Expresión creativa" },
    4: { nombre: "ORDEN", desc: "Trabajo y disciplina" },
    5: { nombre: "CAMBIO", desc: "Libertad y aventura" },
    6: { nombre: "UNIÓN", desc: "Responsabilidad y amor" },
    7: { nombre: "PENSAR", desc: "Introspección profunda" },
    8: { nombre: "PODER", desc: "Éxito y abundancia" },
    9: { nombre: "CIERRE", desc: "Humanismo y soltar" },
    11: { nombre: "GUÍA", desc: "Iluminación espiritual" },
    22: { nombre: "MAESTRO", desc: "Construcción global" },
    33: { nombre: "AMOR", desc: "Guía universal" }
  }
  return info[n] || { nombre: "ALTA", desc: "Conexión pura" }
}

const calcularVibracionHoy = () => {
    if (!authStore.usuario?.fechanacimiento) return;
    
    const fecha = new Date(authStore.usuario.fechanacimiento);
    const diaNac = fecha.getUTCDate();
    const mesNac = fecha.getUTCMonth() + 1;
    
    const hoy = new Date();
    const diaHoy = hoy.getDate();
    const mesHoy = hoy.getMonth() + 1;
    const añoHoy = hoy.getFullYear();

    // Año Personal = Día Nac + Mes Nac + Año Hoy
    const añoP = reducir(diaNac + mesNac + reducir(añoHoy));
    // Mes Personal = Año P + Mes Hoy
    const mesP = reducir(añoP + mesHoy);
    // Día Personal = Mes P + Día Hoy
    const diaP = reducir(mesP + diaHoy);

    const info = obtenerVibracionDiaInfo(diaP);
    kpis.value[0].valor = `VIBRACIÓN ${diaP}`;
    kpis.value[0].subtitulo = info.nombre;
    kpis.value[0].progreso = diaP / 9;
}

onMounted(async () => {
    try {
        const res = await getData(`lectura/${authStore.usuario._id}`)
        if (res && res.lecturas) {
            const diarias = res.lecturas.filter(l => l.tipo === 'diaria').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
            
            // Racha
            const dias = diarias.length
            kpis.value[1].valor = `${dias} ${dias === 1 ? 'DÍA' : 'DÍAS'}`
            kpis.value[1].progreso = Math.min(dias / 30, 1)

            // Alineacion (basada en constancia)
            const alineacion = dias > 0 ? Math.min(50 + (dias * 5), 99) : 10
            kpis.value[2].valor = `${alineacion}%`
            kpis.value[2].progreso = alineacion / 100
        }
        calcularVibracionHoy();
    } catch (e) {
        console.error(e)
    }
})
</script>

<style scoped>
.text-glow { text-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
.cinzel-font { font-family: 'Cinzel', serif; }
.line-height-1 { line-height: 1.1; }
.letter-spacing-2 { letter-spacing: 2px; }

.aura-divider {
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--aura-primary), transparent);
}

.typewriter-text {
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: .1em;
  animation: typing 4s steps(50, end), blink-caret .75s step-end infinite;
  border-right: .15em solid var(--aura-primary);
  display: inline-block;
  max-width: fit-content;
}

@keyframes typing { from { width: 0 } to { width: 100% } }
@keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: var(--aura-primary); } }
.transition-colors { transition: all 0.5s ease-in-out; }

.glass-card-dark {
  background: rgba(15, 20, 35, 0.4);
  backdrop-filter: blur(25px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.02);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.glass-card-dark:hover {
  border-color: var(--aura-primary);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7), inset 0 0 20px var(--aura-glow);
}

.kpi-card-modern {
  padding: 20px;
  position: relative;
  overflow: hidden;
  height: 100%;
}
.kpi-card-modern:hover { transform: translateY(-8px) scale(1.02); }

.kpi-icon-box {
  width: 55px; height: 55px;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
  transition: transform 0.5s ease;
}
.kpi-card-modern:hover .kpi-icon-box {
  transform: scale(1.15) rotate(5deg);
}

/* HOLOGRAPHIC 3D TILT EFFECT */
.holographic-card {
  position: relative;
  overflow: hidden;
}
.holographic-card::before {
  content: '';
  position: absolute;
  top: -100%; left: -100%; width: 300%; height: 300%;
  background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.06) 25%, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 60%);
  transform: rotate(45deg);
  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: none;
  opacity: 0;
  z-index: 2;
}
.holographic-card:hover::before {
  top: -20%; left: -20%;
  opacity: 1;
}

.ritual-card-premium {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.2) 0%, rgba(10, 15, 30, 0.4) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.ritual-card-premium:hover {
  transform: translateY(-5px) perspective(1000px) rotateX(1deg) rotateY(1deg);
  border-color: var(--aura-primary);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8), inset 0 0 40px var(--aura-glow);
}

/* TEMATIZACION AURA */
.aura-text { color: var(--aura-primary) !important; text-shadow: 0 0 10px var(--aura-glow); transition: color 0.5s ease; }
.aura-badge { color: var(--aura-primary) !important; border-color: var(--aura-primary) !important; transition: color 0.5s ease; }
.aura-icon { color: var(--aura-primary) !important; transition: color 0.5s ease; }

.energy-chart-mini { height: 200px; padding-bottom: 10px; }
.bar-mini {
  width: 15px; background: rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  position: relative;
  transition: all 0.5s ease;
}
.bar-mini:hover { background: var(--aura-primary); cursor: pointer; box-shadow: 0 0 15px var(--aura-glow); }

.mystic-btn {
  letter-spacing: 2px; font-weight: bold;
  background: var(--aura-primary) !important; color: #fff !important;
  box-shadow: 0 0 20px var(--aura-glow) !important;
  transition: all 0.5s ease;
}

.animate-slide-left { animation: slideLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
.animate-fade-up { animation: fadeUp 1s ease-out 0.2s both; }

.header-line {
  width: 60px;
  height: 3px;
  background: #fbbf24;
  border-radius: 2px;
  box-shadow: 0 0 10px #fbbf24;
}

@keyframes slideLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>