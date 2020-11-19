<template>
  <div>
    <add-task-form v-bind:project-id="projectId"
                   v-on:task:add:success="getTasks()">
    </add-task-form>
    <b-table-simple bordered v-if="tasks.length">
      <draggable v-model="tasks"
                 tag="tbody"
                 :move="onMove"
                 @end="onMoveEnd"
                 handle=".handle">
        <b-tr v-for="task in tasks" :key="task.id">
          <b-td>
            <b-form-checkbox v-model="task.done" @change="changeStatus(task)">
            </b-form-checkbox>
          </b-td>
          <b-td>{{ task.name }}</b-td>
          <b-td>
          <span class="task-actions">
            <b-icon icon="arrows-expand" class="handle" aria-hidden="true"></b-icon>
            |<b-icon icon="pencil"
                     v-b-modal.edit-task-modal
                     @click="editTask(task)"
                     aria-hidden="true">
            </b-icon>|
            <b-icon icon="trash"
                    @click="onDelete(task.id)"
                    aria-hidden="true">
            </b-icon>
          </span>
          </b-td>
        </b-tr>
      </draggable>
    </b-table-simple>
    <b-row v-if="!tasks.length">
      <b-col>
        <h3 class="mt-5 mb-5 text-center text-uppercase">You don't have any tasks yet</h3>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import AddTaskForm from './AddTaskForm'
import Vue from 'vue'

export default {
  name: 'TaskBlock',
  props: [
    'project',
    'task'
  ],
  data () {
    return {
      projectId: '',
      tasks: [],
      draggedTask: {},
      draggedFrom: null,
      draggedTo: null,
      toUpdatePosition: []
    }
  },
  components: {
    addTaskForm: AddTaskForm,
    draggable
  },
  watch: {
    task (newValue) {
      if ('projectId' in newValue && newValue.projectId === this.projectId) {
        this.getTask(newValue.id)
      }
    }
  },
  methods: {
    getTasks () {
      const path = `/projects/${this.projectId}/tasks`
      this.$http.get(path)
        .then((res) => {
          this.initTasks(res.data.data)
        })
        .catch((error) => {
          console.error(error)
          this.$emit('general:fail')
        })
    },
    getTask (taskId) {
      const path = `/projects/${this.projectId}/tasks/${taskId}`
      this.$http.get(path)
        .then((res) => {
          this.initTask(res.data.data)
        })
        .catch((error) => {
          console.error(error)
          this.$emit('general:fail')
        })
    },
    updateTask (payload, taskId) {
      const path = `/projects/${this.projectId}/tasks/${taskId}`
      this.$http.put(path, payload)
        .catch((error) => {
          console.error(error)
          this.$emit('general:fail')
        })
    },
    removeTask (taskId) {
      const path = `/projects/${this.projectId}/tasks/${taskId}`
      this.$http.delete(path)
        .then(() => {
          this.getTasks()
        })
        .catch((error) => {
          console.error(error)
          this.$emit('general:fail')
        })
    },
    initTask (task) {
      const existingId = this.tasks.findIndex((t) => {
        return t.id === task.id
      })
      if (existingId === -1) {
        this.tasks.push(task)
      } else {
        Vue.set(this.tasks, existingId, task)
      }
    },
    initTasks (tasks) {
      this.tasks.splice(0)
      tasks.forEach(task => {
        this.initTask(task)
      })
    },
    editTask (task) {
      this.$emit('task:edit:show', task)
    },
    changeStatus (task) {
      const taskId = task.id
      const payload = {
        done: task.done
      }
      this.updateTask(payload, taskId)
    },
    onMove (data) {
      this.draggedFrom = data.draggedContext.index
      this.draggedTo = data.draggedContext.futureIndex
      if (this.draggedFrom === this.draggedTo) {
        return false
      }
      this.draggedTask = data.draggedContext.element
      this.toUpdatePosition = this.tasks.filter((task) => {
        if (this.draggedFrom < this.draggedTo) {
          return this.draggedFrom < task.priority && task.priority <= this.draggedTo
        } else if (this.draggedFrom > this.draggedTo) {
          return this.draggedFrom > task.priority && task.priority >= this.draggedTo
        }
      })
    },
    onMoveEnd () {
      if (this.draggedFrom === this.draggedTo) {
        return
      }
      this.draggedTask.priority = this.draggedTo
      this.toUpdatePosition.forEach((task) => {
        if (this.draggedFrom < this.draggedTo) {
          task.priority--
        } else if (this.draggedFrom > this.draggedTo) {
          task.priority++
        }
      })
      const payload = {
        priority: this.draggedTo
      }
      this.updateTask(payload, this.draggedTask.id)
    },
    onDelete (taskId) {
      this.removeTask(taskId)
    }
  },
  created () {
    this.projectId = this.project.id
    this.initTasks(this.project.Tasks)
  }
}
</script>

<style>
table {
  border: none;
}

table tr:hover {
  background: #FCFED5;
}

table tr td:first-of-type {
  width: 50px;
  border-left: none;
  padding-right: 4px;
  text-align: right;
}

table tr td:last-of-type {
  width: 120px;
  border-right: none;
  padding: 8px 10px;
}

table .task-actions {
  display: none;
  color: #c0c0c0c0;
}

table tr:hover .task-actions {
  display: inline-block;
}

table .task-actions .bi {
  margin: 0 4px;
  color: #212529;
}

table .task-actions .bi:hover {
  cursor: pointer;
}
</style>
