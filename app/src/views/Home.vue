<template>
  <div>
    <due-tasks />
  </div>
</template>

<script>
import dueTasks from "@/components/DueTasks";

export default {
  name: "Home",
  components: { dueTasks }
};
</script>
