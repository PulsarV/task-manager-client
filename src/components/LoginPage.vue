<template>
  <b-container>
    <b-row class="mt-4" align-h="center">
      <b-col sm="5" align-self="center">
        <b-card header-tag="header">
          <template #header>Login</template>
          <b-form class="login-form" @submit.prevent="login">
            <b-form-group id="login-email-group"
                          label="Email"
                          label-for="login-email">
              <b-form-input id="login-email"
                            type="text"
                            v-model="email"
                            placeholder="Enter your email"
                            aria-describedby="login-email-live-feedback"
                            :state="validateState('email')"
              >
              </b-form-input>
              <b-form-invalid-feedback id="login-email-live-feedback">
                This required field must contain an email address.
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="login-password-group"
                          label="Password"
                          label-for="login-password">
              <b-form-input id="login-password"
                            type="password"
                            v-model="password"
                            placeholder="Enter your password"
                            aria-describedby="login-password-live-feedback"
                            :state="validateState('password')"
              >
              </b-form-input>
              <b-form-invalid-feedback id="login-password-live-feedback">
                This is a required field of 8 to 16 characters.
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="text-right">
              <b-link href="/register" class="pull-right">Register a new user</b-link>
            </b-form-group>
            <b-form-group class="text-center">
              <b-button type="submit" class="btn mt-1 mb-1 text-center btn-blue" size="lg">Login</b-button>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {email, required, minLength, maxLength} from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  validations: {
    email: {
      required,
      email: email
    },
    password: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(16)
    }
  },
  methods: {
    login: function () {
      this.$v.email.$touch()
      this.$v.password.$touch()
      if (this.$v.email.$anyError || this.$v.password.$anyError) {
        return
      }
      this.$nextTick(() => {
        this.$v.$reset()
      })
      let email = this.email
      let password = this.password
      this.$store.dispatch('login', {email, password})
        .then(() => {
          this.$router.push('/')
        })
        .catch(err => {
          this.$root.$emit('general:fail', 'Login error')
          console.error(err)
        })
    },
    validateState (name) {
      const { $dirty, $error } = this.$v[name]
      return $dirty ? !$error : null
    }
  }
}
</script>

<style>
  form {
    padding: 20px 30px;
  }
</style>
