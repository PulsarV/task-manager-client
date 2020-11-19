<template>
  <b-modal ref="addProjectModal"
           id="add-project-modal"
           title="Add a new project"
           hide-footer>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset" class="w-100">
      <b-form-group id="add-project-name-group"
                    label="Project name:"
                    label-for="add-project-name-input">
        <b-form-input id="add-project-name-input"
                      type="text"
                      v-model="name"
                      placeholder="Enter project name"
                      aria-describedby="add-project-name-live-feedback"
                      :state="validateState()"
        >
        </b-form-input>
        <b-form-invalid-feedback id="add-project-name-live-feedback">
          This is a required field of 3 to 50 characters.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </b-modal>
</template>

<script>
import { maxLength, minLength, required } from 'vuelidate/lib/validators'

export default {
  name: 'AddProjectForm',
  data () {
    return {
      name: ''
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(50)
    }
  },
  methods: {
    addProject (payload) {
      const path = '/projects'
      this.$http.post(path, payload)
        .then(() => {
          this.$emit('project:add:success')
        })
        .catch((error) => {
          console.error(error)
          this.$emit('general:fail')
        })
    },
    onSubmit () {
      this.$v.name.$touch()
      if (this.$v.name.$anyError) {
        return
      }
      this.$refs.addProjectModal.hide()
      const payload = {
        name: this.name
      }
      this.addProject(payload)
      this.name = ''
      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    onReset () {
      this.$refs.addProjectModal.hide()
      this.name = ''
      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    validateState () {
      const { $dirty, $error } = this.$v.name
      return $dirty ? !$error : null
    }
  }
}
</script>
