<template>
  <div>
    <br />
    <h2
      v-if="
        (!draftTasks || !draftTasks.length) &&
          (!doneTasks || !doneTasks.length) &&
          (!inProgressTasks || !inProgressTasks.length)
      "
    >
      No Tasks!
    </h2>
    <task-list
      title="Draft Tasks"
      title-color="cyan"
      :tasks="draftTasks"
      v-if="draftTasks && draftTasks.length > 0"
    />
    <br v-if="inProgressTasks && inProgressTasks.length > 0" />
    <task-list
      title="In Progress Tasks"
      title-color="orange"
      :tasks="inProgressTasks"
      v-if="inProgressTasks && inProgressTasks.length > 0"
    />
    <br v-if="doneTasks && doneTasks.length > 0" />
    <task-list
      title="Done Tasks"
      title-color="green"
      :tasks="doneTasks"
      v-if="doneTasks && doneTasks.length > 0"
    />
  </div>
</template>

<script>
import taskList from "@/components/TaskList";
import { mapActions, mapGetters } from "vuex";
import { API } from "aws-amplify";

export default {
  name: "Tasks",
  components: { taskList },
  computed: {
    ...mapGetters({
      doneTasks: "doneTasks",
      inProgressTasks: "inProgressTasks",
      draftTasks: "draftTasks",
      userid: "userid"
    })
  },
  methods: {
    ...mapActions({
      setDoneTasks: "setDoneTasks",
      setInProgressTasks: "setInProgressTasks",
      setDraftTasks: "setDraftTasks"
    })
  },
  async created() {
    let donePromise = API.get(
      "tasks",
      `tasks/status/${this.$enums.statuses.DONE}?userid=${this.userid}`
    );

    let inProgressPromise = API.get(
      "tasks",
      `tasks/status/${this.$enums.statuses.IN_PROGRESS.replace(
        /[ ]+/g,
        ""
      )}?userid=${this.userid}`
    );

    let draftPromise = API.get(
      "tasks",
      `tasks/status/${this.$enums.statuses.DRAFT}?userid=${this.userid}`
    );

    var results = await Promise.all([
      donePromise,
      inProgressPromise,
      draftPromise
    ]);

    this.setDoneTasks(results[0]);
    this.setInProgressTasks(results[1]);
    this.setDraftTasks(results[2]);
  }
};
</script>
