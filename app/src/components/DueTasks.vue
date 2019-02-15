<template>
  <div>
    <v-layout row class="host-tasks-list" v-if="dueTasks || loading">
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar color="secondary" dark>
            <v-toolbar-title>Due in a month</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list two-line v-if="dueTasks && !dueTasks.length && !loading">
            <template>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title
                    ><strong
                      >You have no tasks due in a month!</strong
                    ></v-list-tile-title
                  >
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
          <v-list two-line v-if="dueTasks && dueTasks.length && !loading">
            <template v-for="(task, index) in dueTasks">
              <v-list-tile :key="task.id" ripple @click="viewTask">
                <v-list-tile-content>
                  <v-list-tile-title
                    >{{ task.title }}
                    <span class="progress">{{
                      task.progress ? "%" + task.progress : ""
                    }}</span>
                  </v-list-tile-title>
                  <v-list-tile-sub-title
                    class="text--primary"
                  ></v-list-tile-sub-title>
                  <v-list-tile-sub-title
                    v-html="task.dueDate"
                  ></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>
                    <v-progress-circular
                      :rotate="0"
                      :size="100"
                      :width="15"
                      :value="task.progress"
                      color="teal"
                    >
                      {{ task.progress }}
                    </v-progress-circular>
                  </v-list-tile-action-text>
                  <v-tooltip left>
                    <v-icon slot="activator" color="primary" dark>{{
                      task.isHost
                        ? "offline_bolt"
                        : task.isAdmin
                        ? "account_box"
                        : "face"
                    }}</v-icon>
                    <span>{{
                      task.isHost ? "Host" : task.isAdmin ? "Admin" : "Player"
                    }}</span>
                  </v-tooltip>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < dueTasks.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      dueTasks: "dueTasks"
    })
  },
  methods: {
    ...mapActions({
      setDueTasks: "setDueTasks"
    })
  },
  created() {
    this.setDueTasks([
      {
        id: 1,
        dueDate: "2/21/19",
        priority: "High",
        progress: 30,
        title: "Task A",
        status: "In Progress"
      },
      {
        id: 2,
        dueDate: "3/10/19",
        priority: "Low",
        progress: 30,
        title: "Task B",
        status: "Draft"
      },
      {
        id: 3,
        dueDate: "2/20/19",
        priority: "High",
        progress: 100,
        title: "Sub-Task A",
        status: "Done",
        parent: 1
      }
    ]);
  }
};
</script>

<style scoped></style>
