<template>
  <q-page class="mystic-pro-bg text-white flex flex-center padding-page">
    <div class="glass-card-dark text-center q-pa-xl" style="max-width: 600px;">
      
      <!-- Icono giratorio -->
      <div class="q-mb-lg relative-position" style="width: 120px; height: 120px; margin: 0 auto;">
        <q-icon name="change_history" color="amber-5" size="80px" class="absolute-center pulse-ring" />
        <q-spinner-orbit color="amber-1" size="120px" class="absolute-center" />
      </div>

      <h1 class="text-h3 text-weight-bolder text-amber-5 q-mt-md letter-spacing-1">
        ALINEACIÓN CÓSMICA EN CURSO
      </h1>

      <p class="text-h6 text-deep-purple-2 q-mt-md font-primary">
        El Cosmos está siendo recalibrado por los arquitectos del destino.
      </p>
      
      <p class="text-body1 text-grey-4 q-mt-md">
        Nuestros canales energéticos y servidores están bajo un estricto mantenimiento para mejorar tu experiencia. 
        Por favor, regresa más tarde una vez que las estrellas vuelvan a alinearse.
      </p>

    </div>
  </q-page>
</template>

<style scoped>
.mystic-pro-bg {
  background: radial-gradient(circle at top right, #1a0b2e 0%, #0d0415 100%);
  min-height: 100vh;
}
.glass-card-dark {
  background: rgba(13, 2, 33, 0.6) !important;
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 193, 7, 0.1);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 193, 7, 0.05);
}
.letter-spacing-1 { letter-spacing: 2px; }
.pulse-ring { animation: pulse 3s infinite; }
@keyframes pulse { 0% { transform: scale(0.9); opacity: 0.7; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.7; } }
</style>
