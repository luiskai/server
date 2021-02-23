<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        {{ num }}
      </div>

      <div class="text-h2" style="opacity:.4">
        Pàgina no existent.
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        :label="btn"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  data () {
    return {
      num: '404',
      msg: 'Pàgina no existent.',
      btn: 'Torna a l’inici'
    }
  }
}

</script>
