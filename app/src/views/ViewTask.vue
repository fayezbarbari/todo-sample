<template>
  <div v-if="!loading">
    <v-form ref="taskForm" v-model="valid">
      <v-container grid-list-md>
        <v-layout justify-center row wrap>
          <v-flex xs12>
            <h3>
              <span v-if="task.parent">
                <v-btn large outline @click="toParent()">{{
                  `Task ${task.parent}`
                }}</v-btn>
                /
              </span>
              <v-btn large outline>{{
                task.id ? `Task ${task.id}` : "New Task"
              }}</v-btn>
            </h3>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              outline
              label="Title"
              v-model="title"
              :rules="requiredRule"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm3>
            <v-select
              v-model="status"
              outline
              :items="statuses"
              label="Status"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout justify-center row wrap>
          <v-flex xs12 sm3>
            <v-select
              v-model="priority"
              outline
              :items="priorities"
              label="Priority"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm3>
            <v-text-field
              outline
              label="Progress"
              v-model="progress"
              :rules="progressRule"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm3>
            <v-text-field
              outline
              v-model="dueDate"
              label="Due Date"
              :rules="dueDateRule"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout justify-center row wrap>
          <v-flex xs12 sm9>
            <v-textarea
              outline
              label="Description"
              v-model="description"
            ></v-textarea>
          </v-flex>
        </v-layout>
        <v-layout column>
          <v-flex>
            <v-btn color="primary" :disabled="!valid" @click="save()"
              >Save</v-btn
            >
            <v-btn color="accent" v-if="task.id" @click="addSubTask()"
              >Add Sub-Task</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <br v-if="subTasks && subTasks.length > 0" />
    <task-list
      title="Sub Tasks"
      title-color="primary"
      show-status="true"
      :tasks="subTasks"
      v-on:viewTask="getCurrentTask()"
      v-if="subTasks && subTasks.length > 0"
    />
    <br v-if="taskHistory && taskHistory.length > 0" />
    <task-history-list
      title="Task History"
      title-color="teal"
      :tasks="taskHistory"
      v-if="taskHistory && taskHistory.length > 0"
    />
  </div>
</template>
<script>
import taskList from "@/components/TaskList";
import taskHistoryList from "@/components/TaskHistoryList";
import { mapGetters } from "vuex";
import { API } from "aws-amplify";

export default {
  name: "ViewTask",
  components: { taskList, taskHistoryList },
  data() {
    return {
      loading: false,
      task: {},
      taskHistory: [],
      subTasks: [],
      dueDate: null,
      title: null,
      progress: "",
      priority: this.$enums.priorities.MEDIUM.value,
      status: this.$enums.statuses.DRAFT,
      description: null,
      valid: false,
      dueDateMenu: false,
      requiredRule: [v => !!v || "Required"],
      progressRule: [
        v => {
          return (
            !v || (/^\d+$/.test(v) && v >= 0 && v <= 100) || "Invalid progress"
          );
        }
      ],
      dueDateRule: [
        function(v) {
          if (!v) return true;
          let dt = Date.parse(v);
          return !!dt || "Invalid due date";
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      userid: "userid"
    }),
    computedDueDateFormatted: {
      get: function() {
        return this.formatDate(this.task.dueDate);
      },
      set: function(val) {
        alert("ff");
        alert(val);
        this.task.dueDate = this.parseDate(val);
      }
    },
    priorities() {
      let options = [];
      for (let k in this.$enums.priorities) {
        options.push(this.$enums.priorities[k].value);
      }
      return options;
    },
    statuses() {
      let options = [];
      for (let k in this.$enums.statuses) {
        options.push(this.$enums.statuses[k]);
      }
      return options;
    }
  },
  methods: {
    async getCurrentTask() {
      let taskId = this.$route.params.id;
      let subTask = this.$route.params.subtask;
      if (taskId && /^\d+$/.test(taskId)) {
        if (subTask == "subtask") {
          this.task = { parent: taskId / 1 };
          this.title = this.dueDate = this.progress = this.description = null;
          this.priority = this.$enums.priorities.MEDIUM.value;
          this.status = this.$enums.statuses.DRAFT;
        } else {
          this.loading = true;
          this.task = await API.get(
            "tasks",
            `tasks/${taskId}?userid=${this.userid}`
          );

          this.title = this.task.title;
          this.dueDate = this.task.dueDate
            ? this.$moment(this.task.dueDate).format("M/D/YYYY")
            : null;
          this.progress = this.task.progress;

          this.description = this.task.description;
          this.status = this.task.status;
          this.priority = this.task.priority;
          this.loading = false;
          this.getHistory();
          this.getSubTasks();
        }
      } else {
        this.task = {};
      }
    },
    async getHistory() {
      if (this.task.id) {
        this.taskHistory = await API.get(
          "tasks",
          `tasks/${this.task.id}/history?userid=${this.userid}`
        );
      }
    },
    async getSubTasks() {
      if (this.task.id) {
        this.subTasks = await API.get(
          "tasks",
          `tasks/${this.task.id}/subtasks?userid=${this.userid}`
        );
      }
    },
    toParent() {
      if (this.task.parent) {
        this.$router.push(`/tasks/${this.task.parent}`);
        this.task = {};
        this.taskHistory = [];
        this.subTasks = [];
        this.getCurrentTask();
      }
    },
    addSubTask() {
      this.$router.push(`/tasks/${this.task.id}/new/subtask`);
      this.task = {};
      this.taskHistory = [];
      this.subTasks = [];

      this.getCurrentTask();
    },
    save() {
      this.saveTask();
    },
    async saveTask() {
      if (this.valid) {
        this.task.title = this.title;
        this.task.description = this.description;
        this.task.progress = this.progress ? this.progress / 1 : 0;
        this.task.priority = this.priority;
        this.task.status = this.status;
        this.task.dueDate = this.dueDate
          ? new Date(this.dueDate).toISOString()
          : null;

        this.task = await API.post("tasks", `tasks?userid=${this.userid}`, {
          body: this.task
        });
        this.$router.push(`/tasks/${this.task.id}`);
        this.getHistory();
      }
    }
  },
  created() {
    this.getCurrentTask();
  }
};
</script>
