<template>
  <q-page padding class="text-white">
    <div class="row q-mb-xl">
      <div class="col-12">
        <div class="text-overline text-amber-5 letter-spacing-2">ECONOMÍA ASTRAL</div>
        <h2 class="text-h3 cinzel-font q-ma-none">Suscripción y Pagos</h2>
      </div>
    </div>

    <!-- ESTADO ACTUAL -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card class="glass-card-dark premium-status-card flex flex-center column q-pa-xl overflow-hidden">
          <div class="status-glow"></div>
          <q-icon :name="isPremium ? 'workspace_premium' : 'lock_open'" size="80px" :color="isPremium ? 'amber-5' : 'grey-7'" class="animate-pulse" />
          <div class="text-h5 cinzel-font q-mt-md">{{ isPremium ? 'ALMA ILUMINADA' : 'BUSCADOR INICIADO' }}</div>
          <div class="text-caption text-grey-5">{{ isPremium ? 'Tu conexión es infinita' : 'Acceso limitado al oráculo' }}</div>
          
          <q-btn v-if="!isPremium" label="ASCENDER AHORA" color="amber-9" text-color="black" rounded unelevated class="q-mt-xl q-px-xl mystic-btn-gold" @click="activarPremium" :loading="loading" />
        </q-card>
      </div>

      <!-- PLANES DE ASCENSIÓN (Si no es premium) -->
      <div class="col-12 col-md-8" v-if="!isPremium">
         <q-card class="glass-card-dark q-pa-lg full-height">
            <div class="text-h6 cinzel-font text-amber-5 q-mb-lg">Planes de Ascensión</div>
            <div class="row q-col-gutter-md">
               <div class="col-12 col-sm-6">
                  <q-card flat bordered class="plan-card q-pa-md text-center">
                     <div class="text-h5 text-white">Mensual</div>
                     <div class="text-h3 text-amber-5 q-my-md">$15.000 <span class="text-caption">COP</span></div>
                     <q-list dense class="text-left text-grey-4 q-mb-md">
                        <q-item><q-item-section avatar><q-icon name="done" color="amber" /></q-item-section><q-item-section>Lecturas diarias ilimitadas</q-item-section></q-item>
                        <q-item><q-item-section avatar><q-icon name="done" color="amber" /></q-item-section><q-item-section>Historial completo</q-item-section></q-item>
                     </q-list>
                     <q-btn label="ELEGIR" color="amber-9" outline rounded class="full-width" @click="activarPremium" />
                  </q-card>
               </div>
               <div class="col-12 col-sm-6">
                  <q-card flat bordered class="plan-card q-pa-md text-center plan-featured">
                     <div class="text-h5 text-white">Anual (Ahorro 20%)</div>
                     <div class="text-h3 text-amber-5 q-my-md">$150.000 <span class="text-caption">COP</span></div>
                     <q-list dense class="text-left text-grey-4 q-mb-md">
                        <q-item><q-item-section avatar><q-icon name="done" color="amber" /></q-item-section><q-item-section>Todo lo de Mensual</q-item-section></q-item>
                        <q-item><q-item-section avatar><q-icon name="stars" color="amber" /></q-item-section><q-item-section>Soporte espiritual prioritario</q-item-section></q-item>
                     </q-list>
                     <q-btn label="ELEGIR" color="amber-9" unelevated rounded class="full-width" @click="activarPremium" />
                  </q-card>
               </div>
            </div>
         </q-card>
      </div>
    </div>

    <!-- HISTORIAL DE PAGOS (TABLA MÁGICA) -->
    <div class="row">
       <div class="col-12">
          <q-card class="glass-card-dark q-pa-lg">
             <div class="text-h6 cinzel-font text-amber-5 q-mb-lg">Crónicas de Ofrendas (Historial)</div>
             <q-table
                :rows="pagos"
                :columns="columns"
                row-key="_id"
                dark
                flat
                class="bg-transparent"
                :loading="loadingTable"
                no-data-label="El cosmos aún no registra ofrendas en tu historial."
             >
                <template v-slot:no-data="{ icon, message, filter }">
                   <div class="full-width row flex-center text-amber-5 q-gutter-sm q-py-xl opacity-60">
                      <q-icon size="40px" name="hourglass_empty" />
                      <div class="text-h6 cinzel-font">{{ message }}</div>
                   </div>
                </template>
                <template v-slot:body-cell-monto="props">
                   <q-td :props="props">
                      <q-badge color="amber-10" text-color="black" class="text-weight-bolder">
                         ${{ props.value }}
                      </q-badge>
                   </q-td>
                </template>
                <template v-slot:body-cell-fecha="props">
                   <q-td :props="props">
                      {{ formatDate(props.value) }}
                   </q-td>
                </template>
             </q-table>
          </q-card>
       </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getData, postData } from '../../services/services'
import { useAuthStore } from '../../store/Auth'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const $q = useQuasar()
const loading = ref(false)
const loadingTable = ref(false)
const pagos = ref([])

const isPremium = computed(() => authStore.usuario?.estado === 1)

const columns = [
   { name: 'id', label: 'ID TRANSACCIÓN', align: 'left', field: '_id', format: val => val ? `#${String(val).substring(0, 8)}` : '#N/A' },
   { name: 'monto', label: 'MONTO', align: 'center', field: 'monto' },
   { name: 'fecha', label: 'FECHA', align: 'center', field: 'fecha' },
   { name: 'status', label: 'ESTADO', align: 'right', field: row => 'APROBADO', format: val => val }
]

const loadPagos = async () => {
   loadingTable.value = true
   try {
      const res = await getData(`pagos/usuario/${authStore.usuario._id}`)
      pagos.value = res || []
   } catch (e) {
      if (e.response && e.response.status === 404) {
          pagos.value = [] // Ningún pago encontrado
      } else {
          console.error("Error cargando pagos:", e)
      }
   } finally { loadingTable.value = false }
}

const activarPremium = async () => {
    loading.value = true
    try {
        const res = await postData('pagos/create-preference', {
            usuarioId: authStore.usuario._id,
            monto: 15000,
            description: "Plan Premium Astra AI"
        })
        if (res.init_point) {
           window.location.href = res.init_point
        } else {
           $q.notify({ message: 'No se generó el punto de pago.', color: 'warning' })
        }
    } catch (error) {
        $q.notify({ message: 'Error en la conexión con la pasarela.', color: 'negative' })
    } finally { loading.value = false }
}

function formatDate(date) {
   return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(() => loadPagos())
</script>

<style scoped>
.cinzel-font { font-family: 'Cinzel', serif; }

.glass-card-dark {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
}

.premium-status-card { position: relative; border: 2px solid rgba(251, 191, 36, 0.2); }
.status-glow {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at center, rgba(251, 191, 36, 0.1), transparent);
}

.plan-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  transition: all 0.3s ease;
}
.plan-featured { border-color: #fbbf24; background: rgba(251, 191, 36, 0.05); }
.plan-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.05); }

.mystic-btn-gold {
  background: #fbbf24 !important; font-weight: 900; letter-spacing: 2px;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
}

.animate-pulse { animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity: 0.6; transform: scale(1); } }
</style>