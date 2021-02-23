<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#7C7C7C, #C1C1C1);"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;height:620;">
          <q-card-section class="bg-black">
            <h4 class="text-h5 text-white q-my-md">Registration</h4>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-pt-sm q-pb-lg">
              <q-input square clearable v-model="fullname" type="nom" label="Full name" :rules="[
              val => !!val || '* Required',
              val => isValidFullName || 'Introduce un nombre correcto.'
              ]"
              lazy-rules>
                <template v-slot:prepend>
                  <q-icon name="supervisor_account" />
                </template>
              </q-input>
              <q-input square clearable v-model="dni" type="dni" label="DNI" :rules="[
              val => !!val || '* Required',
              val => isValidDNI || 'Introduce un DNI correcto.'
              ]"
              lazy-rules>
                <template v-slot:prepend>
                  <q-icon name="face" />
                </template>
              </q-input>
              <q-input square clearable v-model="username" type="username" label="Username" :rules="[
              val => !!val || '* Required',
              val => isValidUsername || 'Introduce un username de 3 caracteres o más.'
              ]"
              lazy-rules>
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input square clearable v-model="password" type="password" label="Password" :rules="[
              val => !!val || '* Required'
              ]"
              lazy-rules>
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
              <q-input square clearable v-model="repeatPassword" type="password" label="Repeat password" :rules="[
              val => !!val || '* Required',
              val => isValidPassword || 'Las contraseñas no coinciden.'
              ]"
              lazy-rules>
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="black" class="full-width text-white" label="Get Started" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-sm">
            <p class="text-grey-6">Return to login</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      email: '',
      username: '',
      password: '',
      repeatPassword: '',
      fullname: '',
      dni: ''
    }
  },
  computed: {
    isValidDNI () {
      const dniExp = new RegExp('[0-9]{8}[A-Z]')
      return dniExp.test(this.dni)
    },
    isValidFullName () {
      var test = this.fullname.split(' ')
      if (test.length === 3) {
        return true
      } else {
        return false
      }
    },
    isValidUsername () {
      if (this.username.length >= 3) {
        return true
      } else {
        return false
      }
    },
    isValidPassword () {
      if (this.password === this.repeatPassword) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
