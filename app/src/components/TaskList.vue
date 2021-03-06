<template>
  <div>
    <v-layout row class="tasks-list" v-if="tasks">
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar :color="titleColor" dark>
            <v-toolbar-title>{{ title }}</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list two-line v-if="tasks && !tasks.length">
            <template>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title
                    ><strong>{{ emptyMessage }}</strong></v-list-tile-title
                  >
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
          <v-list two-line v-if="tasks && tasks.length">
            <template v-for="(task, index) in tasks">
              <v-list-tile :key="task.id" ripple @click="viewTask(task.id)">
                <v-list-tile-avatar>
                  <v-icon :color="getPriorityColor(task.priority)">{{
                    getPriorityIconColor(task.priority)
                  }}</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ task.title }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <span class="caption blue--text text--darken-4"
                      ><span v-if="task.parent">T{{ task.parent }} / </span> T{{
                        task.id
                      }}</span
                    >
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title>
                    <span v-if="task.dueDate">{{
                      $moment(task.dueDate).format("M/D/YY")
                    }}</span>
                    <span v-if="task.dueDate && task.status && showStatus">
                      |
                    </span>
                    <span
                      v-if="showStatus"
                      class="caption grey--text text--darken-2"
                      >{{ task.status }}
                    </span></v-list-tile-sub-title
                  >
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text v-if="task.progress !== undefined">
                    <v-progress-circular
                      :rotate="180"
                      :size="50"
                      :width="5"
                      :value="task.progress"
                      color="#049b4b"
                    >
                      {{ task.progress }}%
                    </v-progress-circular>
                  </v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < tasks.length"
                :key="`${index}-${task.id}`"
              ></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "TaskList",
  props: ["tasks", "title", "titleColor", "showStatus", "emptyMessage"],
  methods: {
    viewTask(taskId) {
      this.$router.push(`/tasks/${taskId}`);
      this.$emit("viewTask");
    },
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
    }
  }
};
</script>

<style scoped></style>
