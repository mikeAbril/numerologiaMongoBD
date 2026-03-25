<template>
  <q-page class="register-page bg-dark text-white">

    <div class="register-container">

      <!-- FONDO MÍSTICO -->
      <div class="background-layer">

        <div class="geometric-lines"></div>

        <div class="sacred-circle">
          <div class="diamond"></div>
          <div class="diamond rotate"></div>

          <div class="number-core">
            <span>7</span>
          </div>
        </div>

        <div class="floating-number n1">11</div>
        <div class="floating-number n2">22</div>
        <div class="floating-number n3">33</div>
        <div class="floating-number n4">44</div>

      </div>

      <!-- PANEL FORMULARIO -->
      <div class="form-panel">

        <div class="form-wrapper">

          <div class="title-block">
            <h1>Numerology</h1>
            <p>Portal Genesis</p>
          </div>

          <q-card class="glass-container">

            <q-card-section>
              <div class="text-h6">Create Account</div>
              <div class="divider"></div>
            </q-card-section>

            <q-card-section>

              <q-input filled v-model="username" label="Nombre Usuario" dark class="q-mb-md">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input filled v-model="email" label="Gmail" dark class="q-mb-md">
                <template v-slot:prepend>
                  <q-icon name="alternate_email" />
                </template>
              </q-input>

              <q-input filled v-model="password" :type="showPassword ? 'text' : 'password'" label="Contraseña" dark class="q-mb-md">
              <template v-slot:prepend>
                <q-icon name="key" />
              </template>

              <template v-slot:append>
                <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="showPassword = !showPassword" />
              </template>
            </q-input>

              <q-input filled v-model="fechanacimiento" label="Fecha de Nacimiento" type="date" dark>
                <template v-slot:prepend>
                  <q-icon name="calendar_month" />
                </template>
              </q-input>

            </q-card-section>

            <q-card-actions>
              <q-btn label="Crear Cuenta" class="gold-button full-width" :loading="loading" @click="crearUsuario()" />
              <p class="texto">Ya tienes una cuenta? <router-link to="/" style="color: var(--q-primary); text-decoration: none; font-weight: bold;">Iniciar Sesión</router-link></p>
            </q-card-actions>

          </q-card>

          <div class="footer-text">
            Secure Mystical Connection
          </div>

        </div>

      </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { postData } from "../services/services";
import { useNotifications } from "../composables/useNotifications";

const { success, errorAlert } = useNotifications()

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const fechanacimiento = ref("");
const loading = ref(false)

const crearUsuario = async () => {
  if (!username.value || !email.value || !password.value || !fechanacimiento.value) {
    errorAlert("Por favor, rellene todos los campos", "Para crear la cuenta")
    return
  }
  loading.value = true
  try {
    const Usuario = await postData("usuario", {
      nombre: username.value,
      email: email.value,
      fechanacimiento: fechanacimiento.value,
      password: password.value,
      rol: "user"
    })
    if (Usuario) {
      success("Bienvenido a su linea de vida")
      router.push("/")
    }

  } catch (error) {
    console.log(error);
    const msg = error.response?.data?.msg || error.response?.data?.errors?.[0]?.msg || "Error al crear el usuario";
    errorAlert(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
}

.register-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  background: #0a0a0c;
  overflow: hidden;
}

/* ===== FONDO ===== */

.background-layer {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, #3b2064, #1a102d);
}

.geometric-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.25;
}

/* ===== CÍRCULO SAGRADO ===== */

.sacred-circle {
  position: absolute;
  right: 12%;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  height: 260px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diamond {
  position: absolute;
  width: 180px;
  height: 180px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
}

.diamond.rotate {
  transform: rotate(-45deg);
}

.number-core {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid rgba(242, 208, 13, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-core span {
  font-size: 46px;
  color: var(--q-primary);
  opacity: 0.35;
}

/* ===== NÚMEROS FLOTANTES ===== */

.floating-number {
  position: absolute;
  font-size: 60px;
  color: rgba(255, 255, 255, 0.04);
  font-style: italic;
  pointer-events: none;
}

.n1 {
  top: 18%;
  right: 30%;
}

.n2 {
  bottom: 18%;
  right: 40%;
}

.n3 {
  top: 40%;
  right: 52%;
  font-size: 36px;
}

.n4 {
  bottom: 38%;
  right: 18%;
  font-size: 36px;
}

/* ===== PANEL FORMULARIO ===== */

.form-panel {
  width: 100%;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.form-wrapper {
  width: 100%;
  max-width: 460px;
  /* 👈 Tamaño elegante para PC */
}

/* ===== TÍTULO ===== */

.title-block {
  margin-bottom: 25px;
  text-align: center;
}

.title-block h1 {
  color: var(--q-primary);
  letter-spacing: 6px;
  font-size: 32px;
  font-weight: 700;
}

.title-block p {
  font-size: 11px;
  opacity: 0.4;
  letter-spacing: 4px;
}

/* ===== GLASS CARD ===== */

.glass-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px);
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 10px;
}

/* ===== BOTÓN DORADO ===== */

.gold-button {
  background: linear-gradient(135deg, #f2d00d, #b89b06);
  color: black;
  font-weight: bold;
  height: 54px;
  border-radius: 14px;
  font-size: 15px;
}

/* ===== DIVIDER ===== */

.divider {
  width: 50px;
  height: 2px;
  background: var(--q-primary);
  margin-top: 8px;
}

/* ===== FOOTER ===== */

.footer-text {
  margin-top: 35px;
  font-size: 12px;
  opacity: 0.25;
  text-align: center;
}

.texto {
  margin-left: 20%;
  margin-top: 15px;
}

/* ===== RESPONSIVE ===== */

@media (max-width: 1100px) {
  .sacred-circle {
    width: 200px;
    height: 200px;
  }

  .diamond {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 900px) {
  .sacred-circle {
    display: none;
  }

  .floating-number {
    font-size: 40px;
  }

  .form-wrapper {
    max-width: 100%;
  }

  .title-block h1 {
    font-size: 26px;
  }
}
</style>