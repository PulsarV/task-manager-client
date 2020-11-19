<template>
  <b-alert :show="dismissCountDown"
           dismissible
           variant="danger"
           @dismissed="dismissCountDown = 0"
           @dismiss-count-down="countDownChanged"
           v-if="message">
    {{message}}
  </b-alert>
</template>

<script>
export default {
  name: 'Alert',
  props: [
    'msg'
  ],
  data () {
    return {
      dismissCountDown: 10,
      message: ''
    }
  },
  watch: {
    msg (newVal) {
      if (newVal) {
        if (newVal) {
          this.message = newVal
          this.dismissCountDown = 10
        }
      }
    }
  },
  methods: {
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    }
  }
}
</script>
