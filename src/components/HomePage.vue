<template>
    <b-container>
    <b-row align-h="center">
      <b-col align-self="center">
        <h1 class="mb-0 text-center text-uppercase">Simple task manager</h1>
        <h2 class="font-weight-normal text-center text-uppercase">From Volodymyr Kravchuk</h2>
      </b-col>
    </b-row>
    <b-row class="mt-4" align-h="center" v-for="project in projects" :key="project.id">
      <b-col sm="8" align-self="center">
        <b-card header-tag="header">
          <template #header>
            <b-icon class="float-left" icon="calendar-week" aria-hidden="true"></b-icon>
            {{ project.name }}
            <span class="float-right">
              <b-icon class="float-left"
                      icon="pencil"
                      v-b-modal.edit-project-modal
                      @click="editProject(project)"
                      aria-hidden="true">
              </b-icon>
              <b-icon class="float-left"
                      icon="trash"
                      @click="onDeleteProject(project.id)"
                      aria-hidden="true"></b-icon>
            </span>
          </template>
          <tasks-block v-on:task:edit:show="editTask($event)"
                       v-on:general:fail="getProjects()"
                       v-bind:project="project"
                       v-bind:task="taskToReload">
          </tasks-block>
        </b-card>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-button type="button" class="mt-5 mb-5 text-center btn-blue" size="lg" v-b-modal.add-project-modal>
        <b-icon class="float-left" icon="calendar-plus" aria-hidden="true"></b-icon>
        Add a new project
      </b-button>
    </b-row>
    <add-project-form v-on:project:add:success="getProjects()"
                      v-on:general:fail="getProjects()">
    </add-project-form>
    <edit-project-form v-bind:project="editingProject"
                       v-on:general:fail="getProjects()"
                       v-on:project:update:success="getProject($event)">
    </edit-project-form>
    <edit-task-form v-bind:task="editingTask"
                    v-on:general:fail="getProjects()"
                    v-on:task:update:success="editTaskEnd()">
    </edit-task-form>
  </b-container>
</template>

<script>
import Vue from 'vue'
import AddProjectForm from './AddProjectForm'
import EditProjectForm from './EditProjectForm'
import EditTaskForm from './EditTaskForm'
import TasksBlock from './TasksBlock'

export default {
  name: 'HomePage',
  data () {
    return {
      projects: [],
      editingProject: {},
      editingTask: {},
      taskToReload: {}
    }
  },
  components: {
    tasksBlock: TasksBlock,
    addProjectForm: AddProjectForm,
    editProjectForm: EditProjectForm,
    editTaskForm: EditTaskForm
  },
  methods: {
    getProjects () {
      const path = '/projects'
      this.$http.get(path)
        .then((res) => {
          this.initProjects(res.data.data)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getProject (projectId) {
      const path = `/projects/${projectId}`
      this.$http.get(path)
        .then((res) => {
          this.initProject(res.data.data)
        })
        .catch((error) => {
          console.error(error)
          this.getProjects()
        })
    },
    removeProject (projectId) {
      const path = `/projects/${projectId}`
      this.$http.delete(path)
        .then(() => {
          this.getProjects()
        })
        .catch((error) => {
          console.error(error)
          this.getProjects()
        })
    },
    initProject (project) {
      const existingId = this.projects.findIndex((p) => {
        return p.id === project.id
      })
      if (existingId === -1) {
        this.projects.push(project)
      } else {
        Vue.set(this.projects, existingId, project)
      }
    },
    initProjects (projects) {
      this.projects.splice(0)
      projects.forEach(project => {
        this.initProject(project)
      })
    },
    editProject (project) {
      this.editingProject = project
    },
    onDeleteProject (projectId) {
      this.removeProject(projectId)
    },
    editTask (task) {
      this.editingTask = task
    },
    editTaskEnd () {
      this.taskToReload = this.editingTask
      this.editingTask = {}
      this.$nextTick(() => {
        this.taskToReload = {}
      })
    }
  },
  created () {
    this.getProjects()
  }
}
</script>

<style>
card .bi-calendar {
  color: #334971;
}

.card h3 {
  font-size: 20px;
}

.btn-blue .bi-calendar-plus {
  margin-right: 5px;
  color: #334971;
  height: 28px;
}
</style>
