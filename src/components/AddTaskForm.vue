<template>
  <b-form class="add-task-form" @submit.prevent="onSubmit($event)">
    <b-icon class="float-left" icon="file-earmark-plus" aria-hidden="true"></b-icon>
    <b-form-group class="task-name">
      <b-form-input
        type="text"
        v-model="name"
        autocomplete="off"
        placeholder="Start typing here to create a task ..."
        aria-describedby="add-task-name-live-feedback"
        :state="validateState()"
      >
      </b-form-input>
      <b-form-invalid-feedback id="add-task-name-live-feedback">
        This is a required field of 3 to 50 characters.
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group>
      <b-button type="submit">Add Task</b-button>
    </b-form-group>
  </b-form>
</template>

<script>
import { maxLength, minLength, required } from 'vuelidate/lib/validators'

export default {
  name: 'AddTaskForm',
  props: [
    'projectId'
  ],
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
    addTask (payload) {
      const path = `/projects/${this.projectId}/tasks`
      this.$http.post(path, payload)
        .then(() => {
          this.$emit('task:add:success')
        })
        .catch((error) => {
          console.error(error)
          this.$emit('general:fail')
        })
    },
    onSubmit (evt) {
      this.$v.name.$touch()
      if (this.$v.name.$anyError) {
        return
      }
      const payload = {
        name: this.name
      }
      this.addTask(payload)
      evt.target.reset()
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
<style>
.add-task-form {
  display: flex;
  padding: 12px 20px;
  background: linear-gradient(rgba(223, 223, 223, 1), rgba(206, 206, 206, 1));
}

.add-task-form .bi-file-earmark-plus {
  margin-right: 12px;
  color: rgba(80, 135, 105, 1);
  font-size: 28px;
  height: 32px;
}

.add-task-form .form-group {
  margin: 0;
}

.add-task-form .form-group.task-name {
  width: inherit;
  flex-grow: 1;
}
.add-task-form input {
  border-radius: 4px 0 0 4px;
  height: auto;
  font-size: 14px;
  line-height: 14px;
}

.add-task-form button {
  padding: 6px 16px;
  border-radius: 0 4px 4px 0;
  font-size: 14px;
  line-height: 17px;
  background: linear-gradient(rgba(140, 195, 165, 1), rgba(80, 135, 105, 1));
}
</style>
