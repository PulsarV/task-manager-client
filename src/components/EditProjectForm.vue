<template>
  <b-modal ref="editProjectModal"
           id="edit-project-modal"
           title="Edit project"
           hide-footer>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset" class="w-100">
      <b-form-group id="edit-project-name-group"
                    label="Project name:"
                    label-for="edit-project-name-input">
        <b-form-input id="edit-project-name-input"
                      type="text"
                      v-model="name"
                      placeholder="Enter project name"
                      aria-describedby="edit-project-name-live-feedback"
                      :state="validateState()"
        >
        </b-form-input>
        <b-form-invalid-feedback id="edit-project-name-live-feedback">
          This is a required field of 3 to 50 characters.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-button type="submit" variant="primary">Update</b-button>
      <b-button type="reset" variant="danger">Cancel</b-button>
    </b-form>
  </b-modal>
</template>

<script>
import { maxLength, minLength, required } from 'vuelidate/lib/validators'

export default {
  name: 'EditProjectForm',
  props: [
    'project'
  ],
  data () {
    return {
      id: '',
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
  watch: {
    project: function (newValue) {
      this.id = newValue.id
      this.name = newValue.name
    }
  },
  methods: {
    updateProject (payload) {
      const path = `/projects/${this.id}`
      this.$http.put(path, payload)
        .then(() => {
          this.$emit('project:update:success', this.id)
          this.resetProject()
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
      this.$refs.editProjectModal.hide()
      const payload = {
        name: this.name
      }
      this.updateProject(payload)
      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    onReset () {
      this.$refs.editProjectModal.hide()
      this.resetProject()
      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    validateState () {
      const { $dirty, $error } = this.$v.name
      return $dirty ? !$error : null
    },
    resetProject () {
      this.id = ''
      this.name = ''
    }
  }
}
</script>
