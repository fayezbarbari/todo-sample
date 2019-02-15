//export default Object.freeze(enums);

export default {
  install(Vue) {
    Vue.prototype.$enums = {
      statuses: {
        DRAFT: "DRAFT",
        IN_PROGRESS: "In progress",
        DONE: "Admin"
      },
      priorities: {
        HIGHEST: "Highest",
        HIGH: "High",
        MEDIUM: "Medium",
        LOW: "Low",
        LOWEST: "Lowest"
      }
    };
  }
};
