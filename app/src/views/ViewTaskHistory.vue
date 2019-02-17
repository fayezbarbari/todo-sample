<template>
  <div>
    <br />
    <v-layout row class="tasks-list" v-if="taskHistory.id">
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-layout row>
            <v-flex xs12>
              <span v-if="taskHistory.parent">
                <v-btn outline large @click="toTask(taskHistory.parent)">{{
                  `Task ${taskHistory.parent}`
                }}</v-btn>
                / </span
              ><span>
                <v-btn outline large @click="toTask(taskHistory.id)">{{
                  `Task ${taskHistory.id}`
                }}</v-btn>
              </span>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs10>
              <v-card-title primary-title>
                <div style="text-align:left">
                  <div class="headline">
                    {{ taskHistory.title }}
                  </div>
                  <div>
                    <span class="caption"
                      >V{{ taskHistory.version }} -
                      {{
                        $moment(taskHistory.createDate).format(
                          "M/D/YY hh:mm:ss A"
                        )
                      }}</span
                    >
                  </div>
                  <div>
                    {{ taskHistory.description }}
                  </div>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs2>
              <br />
              <v-progress-circular
                :rotate="180"
                :size="50"
                :width="5"
                :value="taskHistory.progress"
                color="#049b4b"
              >
                %{{ taskHistory.progress }}
              </v-progress-circular>
              <br />
              <v-icon :color="getPriorityColor(taskHistory.priority)">{{
                getPriorityIconColor(taskHistory.priority)
              }}</v-icon>
              {{ taskHistory.priority }}
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <br />
          <v-layout row>
            <v-flex v-if="taskHistory.status" sm3 xs12>
              Status: {{ taskHistory.status }}
            </v-flex>
            <v-flex v-if="taskHistory.dueDate" sm3 xs12>
              Due Date: {{ $moment(taskHistory.dueDate).format("M/D/YY") }}
            </v-flex>
            <v-flex v-if="taskHistory.priority" sm3 xs12> </v-flex>
          </v-layout>
          <br />
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { API } from "aws-amplify";

export default {
  name: "ViewTaskHistory",
  computed: {
    ...mapGetters({
      userid: "userid"
    })
  },
  data() {
    return {
      taskHistory: {}
    };
  },
  methods: {
    getPriorityColor(priority) {
      if (priority) {
        let pr = this.$enums.priorities[priority.toUpperCase()];
        if (pr) return pr.color;
      }
      return this.$enums.priorities.MEDIUM.color;
    },
    getPriorityIconColor(priority) {
      if (priority) {
        let pr = this.$enums.priorities[priority.toUpperCase()];
        if (pr) return pr.icon;
      }
      return this.$enums.priorities.MEDIUM.icon;
    },
    toTask(taskId) {
      this.$router.push(`/tasks/${taskId}`);
    }
  },
  async created() {
    let taskId = this.$route.params.id;
    let version = this.$route.params.version;

    if (taskId && /^\d+$/.test(taskId) && version && /^\d+$/.test(version)) {
      this.taskHistory = await API.get(
        "tasks",
        `tasks/${taskId}/${version}?userid=${this.userid}`
      );
    }
  }
};
</script>
