<template>
  <q-page class="text-white tarot-page q-pt-xl">
    
    <div class="row q-mb-xl">
        <div class="col-12 text-center animate-fade-down">
            <h2 class="cinzel-font text-gold text-shadow q-ma-none text-weight-bold">LA MESA DEL DESTINO</h2>
            <div class="text-overline text-amber-5 letter-spacing-5 q-mt-sm">Toca tus cartas para develar la verdad</div>
        </div>
    </div>

    <div class="row justify-center q-col-gutter-xl spread-container q-px-xl">
        
        <!-- CARTA 1: ESENCIA PRINCIPAL -->
        <div class="col-12 col-md-5 flex flex-center">
             <div class="tarot-card-wrap" :class="{ 'flipped': lecturaPrincipal }" @click="!lecturaPrincipal && handleLecturaPrincipal()">
                 <div class="tarot-card-inner">
                     <!-- DORSO DE LA CARTA -->
                     <div class="tarot-back holographic-hover flex flex-center column relative-position overflow-hidden">
                        <div class="rune-border"></div>
                        <q-icon name="stars" size="90px" class="text-gold q-mb-lg float-anim" />
                        <div class="text-h3 cinzel-font text-gold text-center text-shadow">Esencia<br>Astral</div>
                        
                        <q-inner-loading :showing="loadingPrincipal" class="glass-loading">
                            <q-spinner-orbit color="amber" size="4em" />
                            <div class="text-amber-5 cinzel-font q-mt-md">Consultando los astros...</div>
                        </q-inner-loading>
                     </div>
                     
                    <!-- FRENTE DE LA CARTA -->
                    <div class="tarot-front glass-card-dark q-pa-lg text-center flex column justify-start overflow-hidden">
                        <div class="reading-content full-width q-pa-md flex-grow-1">
                            <div class="text-h2 cinzel-font text-gold text-shadow glow-text q-mb-xs">{{ lecturaPrincipal?.numeroCamino || '...' }}</div>
                            <div class="text-caption text-amber-5 letter-spacing-5 q-mb-md">NÚMERO MAESTRO</div>
                            <div class="aura-divider q-mx-auto q-mb-md"></div>
                            <p class="text-subtitle1 font-light text-grey-3 q-mb-lg line-height-2">"{{ lecturaPrincipal?.descripcion }}"</p>
                            <div class="row justify-center q-gutter-sm q-mb-md overflow-hidden">
                                <q-chip v-for="t in (lecturaPrincipal?.talentos || [])" :key="t" outline class="gold-chip text-weight-bold" size="md" style="max-width: 100%">
                                  <div class="ellipsis">{{ t }}</div>
                                </q-chip>
                            </div>
                            <div class="q-pb-xl q-mb-xl"></div> <!-- Mucho espacio extra para asegurar scroll -->
                        </div>
                    </div>
                 </div>
             </div>
        </div>

        <!-- CARTA 2: MENSAJE DIARIO -->
        <div class="col-12 col-md-5 flex flex-center">
             <div class="tarot-card-wrap" :class="{ 'flipped': lecturaHoy || isGlitching, 'lock-shake': isGlitching }" @click="!lecturaHoy && !isGlitching && handleLecturaDiaria()">
                 <div class="tarot-card-inner">
                    <!-- DORSO -->
                    <div class="tarot-back holographic-hover flex flex-center column relative-position overflow-hidden delay-float">
                        <div class="rune-border"></div>
                        <q-icon name="auto_awesome" size="90px" class="text-gold q-mb-lg float-anim" />
                        <div class="text-h3 cinzel-font text-gold text-center text-shadow">Mensaje<br>Diario</div>
                        
                        <q-inner-loading :showing="loadingDiaria" class="glass-loading">
                            <q-spinner-orbit color="amber" size="4em" />
                            <div class="text-amber-5 cinzel-font q-mt-md">Develando tu destino...</div>
                        </q-inner-loading>
                    </div>
                     
                     <!-- FRENTE -->
                     <div class="tarot-front glass-card-dark q-pa-lg text-center flex column justify-start overflow-hidden" :class="{'error-glow': isGlitching}">
                         
                         <!-- PREMIUM: LECTURA EXITOSA -->
                         <div v-if="lecturaHoy" class="reading-content full-width q-pa-md">
                            <h5 class="cinzel-font text-gold q-mb-md text-shadow q-mt-none">{{ lecturaHoy.energiaDelDia }}</h5>
                            <div class="text-h6 italic text-white q-mb-md font-light line-height-1-5">"{{ lecturaHoy.mensaje }}"</div>
                            <div class="aura-divider q-mx-auto q-mb-md"></div>
                            <p class="text-body1 font-light text-grey-4 line-height-1-8 text-justify">{{ lecturaHoy.consejo }}</p>
                         </div>

                         <!-- FREE: BLOQUEO PREMIUM (CARTA QUEMADA/ROJA) -->
                         <div v-else-if="isGlitching" class="flex flex-center column text-center full-height">
                             <q-icon name="lock" size="80px" color="red-5" class="q-mb-md lock-pulse" />
                             <div class="text-h4 cinzel-font text-red-5 text-weight-bold q-mb-sm text-shadow">Carta Sellada</div>
                             <p class="text-body1 text-grey-3 font-light q-mb-lg line-height-1-5 q-px-md">Los secretos diarios del universo están encriptados. Adquiere el Pase Astral para romper el sello y leerla.</p>
                             <q-btn label="OBTENER PREMIUM" color="red-10" rounded class="text-weight-bold q-px-xl q-py-md text-subtitle1 pulse-error-btn" to="/user/payments" />
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

const loadingPrincipal = ref(false)
const loadingDiaria = ref(false)
const isGlitching = ref(false)

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

const handleLecturaPrincipal = async () => {
    loadingPrincipal.value = true
    try {
        const res = await postData(`lectura/principal/${authStore.usuario._id}`)
        // La respuesta puede venir en res.contenido o res.data.contenido
        const data = res.contenido || (res.data && res.data.contenido) || res
        
        setTimeout(() => {
            lecturaPrincipal.value = typeof data === 'string' ? JSON.parse(data) : data
            loadingPrincipal.value = false
        }, 800)
    } catch (e) { 
        loadingPrincipal.value = false
        $q.notify({ message: 'El oráculo está meditando. Intenta en un momento.', color: 'purple', icon: 'auto_awesome' })
        console.error("Error al generar esencia:", e)
    }
}

const handleLecturaDiaria = async () => {
    loadingDiaria.value = true
    setTimeout(async () => {
        try {
            const res = await postData(`lectura/diaria/${authStore.usuario._id}`)
            lecturaHoy.value = res.data.contenido
        } catch (error) {
            if (error.response?.status === 403 || authStore.usuario?.estado !== 1) {
                isGlitching.value = true
                $q.notify({ message: 'Conexión Denegada', color: 'red', icon: 'lock' })
            }
        } finally {
            loadingDiaria.value = false
        }
    }, 800)
}

onMounted(() => fetchLectura())
</script>

<style scoped>
.cinzel-font { font-family: 'Cinzel', serif; }
.line-height-1-5 { line-height: 1.5; }
.line-height-1-8 { line-height: 1.8; }
.line-height-2 { line-height: 1.8; }
.font-light { font-weight: 300; }
.text-gold { color: #d4af37; }
.gold-chip { color: #d4af37 !important; border-color: #d4af37 !important; }
.letter-spacing-2 { letter-spacing: 2px; }
.letter-spacing-5 { letter-spacing: 5px; }
.text-shadow { text-shadow: 0 5px 15px rgba(0,0,0,0.8); }

.reading-content {
  max-height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(212,175,55,0.3) transparent;
}

.reading-content::-webkit-scrollbar {
  width: 4px;
}
.reading-content::-webkit-scrollbar-thumb {
  background: rgba(212,175,55,0.3);
  border-radius: 10px;
}

.tarot-page {
   min-height: 80vh;
}

/* LA MESA FLOTANTE */
.tarot-card-wrap {
   perspective: 2500px;
   width: 100%;
   height: 650px; /* Cartas altas y esbeltas como Tarot */
   cursor: pointer;
}

.tarot-card-inner {
   position: relative; 
   width: 100%; height: 100%;
   transition: transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
   transform-style: preserve-3d;
}

.tarot-card-wrap.flipped .tarot-card-inner {
   transform: rotateY(180deg);
}

.tarot-back, .tarot-front {
   position: absolute; 
   width: 100%; height: 100%;
   backface-visibility: hidden; 
   border-radius: 20px;
}

/* DORSO: MAGIA PURA */
.tarot-back {
   background: linear-gradient(145deg, #0b1120 0%, #030610 100%);
   border: 2px solid rgba(212,175,55,0.4);
   box-shadow: 0 20px 50px rgba(0,0,0,0.8);
   animation: gentle-float 6s ease-in-out infinite;
}

.delay-float { animation-delay: 1.5s; }

.rune-border {
  position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px;
  border: 1px dashed rgba(212,175,55,0.3);
  border-radius: 12px;
  pointer-events: none;
}

@keyframes gentle-float {
   0%, 100% { transform: translateY(0); }
   50% { transform: translateY(-15px); }
}

.float-anim {
   animation: scale-breathe 4s infinite alternate;
}
@keyframes scale-breathe {
   0% { transform: scale(0.9); opacity: 0.7; }
   100% { transform: scale(1.1); opacity: 1; text-shadow: 0 0 20px #d4af37; }
}

/* FRENTE DE LA CARTA */
.tarot-front {
   transform: rotateY(180deg);
}

.glass-card-dark {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(25px) saturate(120%);
  border: 2px solid rgba(212,175,55, 0.5);
  box-shadow: inset 0 0 50px rgba(212,175,55,0.1), 0 30px 60px rgba(0,0,0,0.9);
}

.glow-text {
  text-shadow: 0 0 20px rgba(212,175,55, 0.6), 0 0 40px rgba(212,175,55, 0.4);
}

.aura-divider {
  width: 150px; height: 2px; 
  background: linear-gradient(90deg, transparent, #d4af37, transparent); 
}

/* HOLOGRAPHIC HOVER */
.holographic-hover { transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; }
.holographic-hover:hover { 
  border-color: rgba(212,175,55,1); 
  box-shadow: 0 30px 70px rgba(0,0,0,0.9), inset 0 0 50px rgba(212,175,55,0.3); 
}

.glass-loading {
  background: rgba(10, 15, 30, 0.8) !important;
  backdrop-filter: blur(5px);
}

/* ANIMACIONES DE ERROR (GLITCH LOCK) */
.lock-shake {
   animation: error-shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

.error-glow {
   border-color: rgba(255, 0, 0, 0.8) !important;
   background: rgba(40, 5, 5, 0.95) !important;
   box-shadow: inset 0 0 80px rgba(255,0,0,0.3), 0 30px 60px rgba(0,0,0,0.9) !important;
}

@keyframes error-shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
  40%, 60% { transform: translate3d(8px, 0, 0); }
}

.pulse-error-btn {
  animation: pulse-red 2s infinite;
}
@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.8); }
  70% { box-shadow: 0 0 0 25px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
}

.lock-pulse {
   animation: lock-breathe 2s infinite;
}
@keyframes lock-breathe {
   0%, 100% { transform: scale(1); text-shadow: 0 0 10px red; }
   50% { transform: scale(1.1); text-shadow: 0 0 40px red, 0 0 60px red; }
}

.animate-fade-down { animation: fadeDown 1s cubic-bezier(0.23, 1, 0.32, 1); }
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>