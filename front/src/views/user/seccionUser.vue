<template>
  <q-page class="templo-astral-page">
    <!-- FONDO INMERSIVO: NEBULOSA LÍQUIDA -->
    <div class="nebula-overlay"></div>
    <div class="stars-fixed"></div>

    <Perfil ref="perfilRef" />
    <notificaciones ref="notifRef" />

    <!-- HEADER -->
    <q-header class="transparent-header" flat>
      <q-toolbar class="container-max q-py-lg">
        <div class="templo-logo">
           <span class="text-gold letter-spacing-5">ASTRA</span>
           <span class="text-white opacity-40">●</span>
           <span class="text-white letter-spacing-5">AI</span>
        </div>
        <q-space />
        <q-btn flat round icon="notifications" @click="notifRef.openDrawer()" class="text-gold">
          <q-badge floating color="amber-10" rounded v-if="authStore.unreadCount > 0">{{ authStore.unreadCount }}</q-badge>
        </q-btn>
        <q-avatar size="45px" class="avatar-glow cursor-pointer q-ml-md" @click="perfilRef.openDrawer()">
          <img :src="user.avatar" />
        </q-avatar>
      </q-toolbar>

      <!-- MENÚ DE NAVEGACIÓN -->
      <div class="container-max text-center">
        <q-tabs
          v-model="activeTab"
          class="text-gold q-mb-md"
          active-color="amber-5"
          indicator-color="amber-5"
          align="center"
          narrow-indicator
        >
          <q-tab name="dashboard" icon="dashboard" label="Sintonía" />
          <q-tab name="oracle" icon="psychic" label="Oráculo" />
          <q-tab name="seals" icon="auto_awesome" label="Grimorio" />
          <q-tab name="vault" icon="history_edu" label="Archivo" />
          <q-tab name="payments" icon="workspace_premium" label="Suscripción" />
        </q-tabs>
      </div>
    </q-header>

    <q-page-container>
      <div class="container-max q-pb-xl">
        
        <!-- BIENVENIDA MÍSTICA -->
        <div class="row justify-center q-mb-xl text-center animate-fade-in" v-if="activeTab === 'dashboard'">
           <div class="col-12">
              <div class="text-overline text-gold q-mb-sm">PORTAL DE LA SABIDURÍA</div>
              <h1 class="text-h2 cinzel-font text-white q-ma-none">Bienvenido, <span class="text-gold">{{ user.nombre }}</span></h1>
              <div class="aura-divider q-mx-auto q-mt-md"></div>
           </div>
        </div>

        <!-- PANELES DE VISTAS (Integrando todas en una sola) -->
        <q-tab-panels v-model="activeTab" animated class="transparent">
          <q-tab-panel name="dashboard" class="q-pa-none overflow-hidden">
            <UserDashboard />
          </q-tab-panel>
          <q-tab-panel name="oracle" class="q-pa-none overflow-hidden">
            <UserOracle />
          </q-tab-panel>
          <q-tab-panel name="seals" class="q-pa-none overflow-hidden">
            <UserSeals />
          </q-tab-panel>
          <q-tab-panel name="vault" class="q-pa-none overflow-hidden">
            <UserVault />
          </q-tab-panel>
          <q-tab-panel name="payments" class="q-pa-none overflow-hidden">
            <UserPayments />
          </q-tab-panel>
        </q-tab-panels>

      </div>
    </q-page-container>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import Perfil from '../../components/perfil.vue'
import Notificaciones from '../../components/notificaciones.vue'
import { useAuthStore } from '../../store/Auth.js'

import UserDashboard from './UserDashboard.vue'
import UserOracle from './UserOracle.vue'
import UserPayments from './UserPayments.vue'
import UserSeals from './UserSeals.vue'
import UserVault from './UserVault.vue'

const authStore = useAuthStore()
const perfilRef = ref(null)
const notifRef = ref(null)

const activeTab = ref('dashboard')

const user = ref({
    nombre: authStore.usuario?.nombre || 'Buscador',
    avatar: authStore.usuario?.avatar || 'https://i.pravatar.cc/150?img=33'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');

.templo-astral-page {
  background: #02040a;
  color: #fff;
  font-family: 'Cinzel', serif;
  overflow-x: hidden;
}

.cinzel-font { font-family: 'Cinzel', serif; }
.text-gold { color: #d4af37; text-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
.letter-spacing-5 { letter-spacing: 5px; }

/* NEBULA BACKGROUND */
.nebula-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 50% 50%, #1a103d 0%, #02040a 100%);
  opacity: 0.8; z-index: 0;
}
.stars-fixed {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
  opacity: 0.2; z-index: 0;
}

.container-max { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

/* HEADER */
.transparent-header { background: transparent; }
.avatar-glow { border: 2px solid #d4af37; box-shadow: 0 0 15px rgba(212, 175, 55, 0.4); }

.aura-divider {
  width: 100px; height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.animate-fade-in { animation: fadeIn 1.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Fix layout overrides for imported panels */
.q-tab-panels {
  background: transparent !important;
}
.q-tab-panel {
  padding: 0;
}
</style>