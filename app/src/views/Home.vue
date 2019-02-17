<template>
  <div>
    <br />
    <h2 v-if="!userid">ToDo Sample App!</h2>
    <task-list
      title="Tasks due this month"
      title-color="red darken-1"
      show-status="true"
      empty-message="You don't have any task due this month!"
      :tasks="dueTasks"
      v-if="userid"
    />
  </div>
</template>

<script>
import taskList from "@/components/TaskList";
import { mapActions, mapGetters } from "vuex";
import { API } from "aws-amplify";

export default {
  name: "Home",
  components: { taskList },
  computed: {
    ...mapGetters({
      dueTasks: "dueTasks",
      userid: "userid"
    })
  },
  methods: {
    ...mapActions({
      setDueTasks: "setDueTasks"
    })
  },
  async created() {
    if (this.userid) {
      let dueTasks = await API.get("tasks", `tasks/due?userid=${this.userid}`);
      this.setDueTasks(dueTasks);
    }
  }
};
</script>
