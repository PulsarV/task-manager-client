<template>
  <div id="app">
    <alert v-bind:msg="alertMsg"></alert>
    <b-nav class="pl-5 pr-5" align="right">
      <b-nav-item>
        <b-icon icon="lock-fill" v-if="isLoggedIn" @click="logout" class="mt-1" aria-hidden="true"></b-icon>
      </b-nav-item>
    </b-nav>
    <router-view/>
  </div>
</template>

<script>
import Alert from './components/Alert'

export default {
  name: 'App',
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn
    }
  },
  components: {
    alert: Alert
  },
  data () {
    return {
      alertMsg: ''
    }
  },
  methods: {
    showAlert (msg) {
      this.alertMsg = msg
      this.$nextTick(() => {
        this.alertMsg = ''
      })
    },
    logout: function () {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
    }
  },
  created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('logout')
        }
        throw err
      })
    })
    this.$root.$on('general:fail', this.showAlert)
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background: linear-gradient(rgba(220,210,200,1), rgba(210,150,20,0.9));
  padding-top: 40px;
}
.bi-lock-fill {
  font-size: 30px;
}
h1 {
  font-size: 36px;
}

h2 {
  font-size: 20px;
}

h1,
h2,
h3 {
  color: #212529;
}

.card {
  border-radius: 0 0 10px 10px;
}

.card-header:first-child {
  border-radius: 0;
  color: #fff;
  background: linear-gradient(rgba(80, 130, 190, 0.9), rgba(60, 100, 160, 1));
  font-size: 22px;
}

.card-header .bi-calendar-week {
  margin-left: 4px;
  margin-right: 16px;
  color: #212529;
  height: 32px;
}

.card-header .bi-pencil,
.card-header .bi-trash {
  margin-left: 16px;
  height: 32px;
}

.card-header .bi-pencil:hover,
.card-header .bi-trash:hover {
  cursor: pointer;
}

.card-header .bi-pencil:focus,
.card-header .bi-trash:focus {
  outline: none;
}

.card-body {
  padding: 0 0 10px 0;
}

.btn-blue {
  width: 250px;
  background: linear-gradient(rgba(80, 130, 190, 0.9), rgba(60, 100, 160, 1));
}

.alert {
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
