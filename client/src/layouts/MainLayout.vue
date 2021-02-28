<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawerState = !drawerState"
        />

        <q-toolbar-title>
          Qualificacions App
        </q-toolbar-title>

        <div>{{ dataActual }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerState"
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Login',
    caption: '',
    icon: 'account_circle',
    link: '/'
  },
  {
    title: 'About',
    caption: '',
    icon: 'info',
    link: '#/about'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed: {
    dataActual () {
      const timeStamp = Date.now()
      const formattedString = date.formatDate(timeStamp, 'dddd, D') + ' de ' + date.formatDate(timeStamp, 'MMMM') + ' de ' + date.formatDate(timeStamp, 'YYYY')
      return formattedString
    },
    drawerState: {
      get () {
        return this.$store.state.showcase.drawerState
      },
      set (val) {
        this.$store.commit('showcase/updateDrawerState', val)
      }
    }
  }
}
</script>
