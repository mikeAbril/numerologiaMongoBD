<template>
  <q-page padding class="text-white">
    <div class="row q-mb-xl">
      <div class="col-12">
        <div class="text-overline text-amber-5 letter-spacing-2">SANTUARIO INTERIOR</div>
        <h2 class="text-h3 cinzel-font q-ma-none">El Oráculo</h2>
      </div>
    </div>

    <!-- ALTAR PRINCIPAL (MANDALA) -->
    <div class="row justify-center q-mb-xl">
      <div class="col-12 col-md-10">
        <q-card class="glass-card-dark q-pa-xl altar-gradient relative-position overflow-hidden">
          <div v-if="lecturaPrincipal" class="row items-center q-col-gutter-xl">
            <div class="col-12 col-md-5 flex flex-center">
              <div class="mandala-wrap">
                <div class="mandala-inner">
                  <div class="text-h2 text-white text-weight-bolder">{{ lecturaPrincipal.numeroCamino }}</div>
                  <div class="text-caption text-amber-5">NÚMERO MAESTRO</div>
                </div>
                <div class="mandala-svg-bg"></div>
              </div>
            </div>
            <div class="col-12 col-md-7">
               <div class="text-h4 cinzel-font text-amber-5 q-mb-md">Tu Esencia Astral</div>
               <p class="text-body1 text-grey-3 line-height-2">{{ lecturaPrincipal.descripcion }}</p>
               <div class="row q-gutter-sm q-mt-lg">
                  <q-chip v-for="t in lecturaPrincipal.talentos" :key="t" outline color="amber-5" text-color="white" size="sm">
                    {{ t }}
                  </q-chip>
               </div>
            </div>
          </div>
          <div v-else class="text-center q-pa-xl">
             <q-icon name="auto_awesome" color="amber-5" size="80px" class="opacity-30 q-mb-lg" />
             <div class="text-h5 text-white q-mb-md">Tu destino está esperando ser revelado</div>
             <q-btn label="DESPERTAR ESENCIA" color="indigo-7" rounded unelevated class="q-px-xl mystic-btn" @click="generarLecturaPrincipal" :loading="loading" />
          </div>
        </q-card>
      </div>
    </div>

    <!-- ORÁCULO DIARIO (CARTA CON INTRIGA) -->
    <div class="row justify-center q-col-gutter-xl">
       <div class="col-12 col-md-5">
          <div class="section-title-astral q-mb-lg">Mensaje del Cosmos (Hoy)</div>
          <div class="oracle-card-3d" :class="{ 'flipped': lecturaHoy }">
             <div class="card-inner">
                <!-- PARTE TRASERA (CERRADA) -->
                <div class="card-back flex flex-center column">
                   <q-icon name="psychic" size="60px" color="amber-5" />
                   <div class="text-h6 text-amber-5 q-mt-md">VER MI DESTINO HOY</div>
                   <q-btn label="VOLTEAR CARTA" outline color="amber-5" rounded class="q-mt-lg" @click="generarLecturaDiaria" :loading="loadingDiaria" />
                </div>
                <!-- PARTE FRONTAL (REVELADA) -->
                <div v-if="lecturaHoy" class="card-front q-pa-xl">
                   <div class="row justify-between items-center q-mb-md">
                      <div class="text-h3 text-amber-5">{{ lecturaHoy.energiaDelDia }}</div>
                      <q-icon name="flare" color="amber-5" />
                   </div>
                   <div class="text-subtitle1 italic text-white q-mb-lg">"{{ lecturaHoy.mensaje }}"</div>
                   
                   <!-- EFECTO BLUR PARA NO PREMIUM -->
                   <div class="content-intrigue" :class="{ 'is-locked': authStore.usuario?.estado !== 1 }">
                      <p class="text-body2 text-grey-4">{{ lecturaHoy.consejo }}</p>
                      <div v-if="authStore.usuario?.estado !== 1" class="lock-overlay flex flex-center column">
                         <q-icon name="lock" size="lg" color="amber-5" />
                         <div class="text-weight-bold q-mt-sm">CONTENIDO BLOQUEADO</div>
                         <q-btn label="MEJORAR A PREMIUM" flat color="amber-5" dense to="/user/premium" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { postData, getData } from '../../services/services'
import { useAuthStore } from '../../store/Auth'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const $q = useQuasar()
const lecturaPrincipal = ref(null)
const lecturaHoy = ref(null)
const loading = ref(false)
const loadingDiaria = ref(false)

const fetchLectura = async () => {
   try {
      const res = await getData(`lectura/${authStore.usuario._id}`)
      if (res && res.lecturas) {
         const principal = res.lecturas.find(l => l.tipo === 'principal')
         if (principal) {
            lecturaPrincipal.value = typeof principal.contenido === 'string' ? JSON.parse(principal.contenido) : principal.contenido
         }
         
         const diarias = res.lecturas.filter(l => l.tipo === 'diaria').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
         if (diarias.length > 0) {
            const hoy = new Date().toLocaleDateString('es-ES')
            const fechaLectura = new Date(diarias[0].createdAt).toLocaleDateString('es-ES')
            if (hoy === fechaLectura) {
               lecturaHoy.value = typeof diarias[0].contenido === 'string' ? JSON.parse(diarias[0].contenido) : diarias[0].contenido
            }
         }
      }
   } catch (e) {}
}

const generarLecturaPrincipal = async () => {
   loading.value = true
   try {
      const res = await postData(`lectura/principal/${authStore.usuario._id}`)
      lecturaPrincipal.value = typeof res.data.contenido === 'string' ? JSON.parse(res.data.contenido) : res.data.contenido
   } catch (e) {} finally { loading.value = false }
}

const generarLecturaDiaria = async () => {
   loadingDiaria.value = true
   try {
      const res = await postData(`lectura/diaria/${authStore.usuario._id}`)
      lecturaHoy.value = res.data.contenido
   } catch (error) {
      if (error.response?.status === 403) $q.notify({ message: 'Necesitas Premium', color: 'orange' })
   } finally { loadingDiaria.value = false }
}

onMounted(() => fetchLectura())
</script>

<style scoped>
.cinzel-font { font-family: 'Cinzel', serif; }
.line-height-2 { line-height: 2; }

.glass-card-dark {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 30px;
}

.altar-gradient {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
}

/* MANDALA ANIMATION */
.mandala-wrap {
  position: relative; width: 250px; height: 250px;
  display: flex; align-items: center; justify-content: center;
}
.mandala-inner { text-align: center; z-index: 2; }
.mandala-svg-bg {
  position: absolute; width: 100%; height: 100%;
  border: 2px dashed rgba(251, 191, 36, 0.2);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* ORACLE CARD 3D */
.oracle-card-3d { perspective: 1000px; height: 450px; }
.card-inner {
  position: relative; width: 100%; height: 100%;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}
.flipped .card-inner { transform: rotateY(180deg); }

.card-back, .card-front {
  position: absolute; width: 100%; height: 100%;
  backface-visibility: hidden; border-radius: 20px;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.card-back { background: #0f172a; z-index: 2; }
.card-front { background: #1e1b4b; transform: rotateY(180deg); }

/* INTRIGUE EFFECT */
.is-locked { filter: blur(10px); pointer-events: none; }
.lock-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.4);
  z-index: 10; pointer-events: all;
}
</style>