<template>
  <b-modal ref="editTaskModal"
           id="edit-task-modal"
           title="Edit Task"
           hide-footer>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset" class="w-100">
      <b-form-group id="edit-task-name-group"
                    label="Task name:"
                    label-for="edit-task-name-input">
        <b-form-input id="edit-task-name-input"
                      type="text"
                      v-model="name"
                      placeholder="Enter task name"
                      aria-describedby="edit-task-name-live-feedback"
                      :state="validateState()"
        >
        </b-form-input>
        <b-form-invalid-feedback id="edit-task-name-live-feedback">
          This is a required field of 3 to 50 characters.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group id="edit-task-deadline-group"
                    label="Task deadline:"
                    label-for="edit-task-deadline-input">
        <b-input-group>
          <b-form-datepicker id="edit-task-deadline-input"
                             v-model="deadline" class="mb-0">
          </b-form-datepicker>
          <template v-slot:append>
            <b-button aria-label="Clear date" @click="deadline = null">
              <b-icon icon="x-circle"></b-icon>
            </b-button>
          </template>
        </b-input-group>
      </b-form-group>
      <b-form-group id="edit-task-done-group">
        <b-form-checkbox
          id="edit-task-done-input"
          v-model="done"
        >
          Task is completed
        </b-form-checkbox>
      </b-form-group>
      <b-button type="submit" variant="primary">Update</b-button>
      <b-button type="reset" variant="danger">Cancel</b-button>
    </b-form>
  </b-modal>
</template>

<script>
import { maxLength, minLength, required } from 'vuelidate/lib/validators'

export default {
  name: 'EditTaskForm',
  props: [
    'task'
  ],
  data () {
    return {
      id: '',
      projectId: '',
      name: '',
      priority: 9999,
      done: false,
      deadline: null
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
    task: function (newValue) {
      this.id = newValue.id
      this.projectId = newValue.projectId
      this.name = newValue.name
      this.done = newValue.done
      this.deadline = newValue.deadline
    }
  },
  methods: {
    updateTask (payload) {
      const path = `/projects/${this.projectId}/tasks/${this.id}`
      this.$http.put(path, payload)
        .then(() => {
          this.$emit('task:update:success', this.id)
          this.resetTask()
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
      this.$refs.editTaskModal.hide()
      const payload = {
        name: this.name,
        done: this.done,
        deadline: this.deadline
      }
      this.updateTask(payload)
      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    onReset () {
      this.$refs.editTaskModal.hide()
      this.resetTask()
      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    validateState () {
      const { $dirty, $error } = this.$v.name
      return $dirty ? !$error : null
    },
    resetTask () {
      this.id = ''
      this.projectId = ''
      this.name = ''
      this.done = false
      this.deadline = null
    }
  }
}
</script>

<style>
#edit-task-deadline-input__value_ {
  margin-bottom: 0;
}

#edit-task-deadline-group .bi-x-circle {
  font-size: 22px;
}

#edit-task-deadline-input .bi-calendar,
#edit-task-deadline-input .bi-calendar-fill{
  font-size: 24px;
}
</style>
