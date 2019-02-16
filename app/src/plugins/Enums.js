//export default Object.freeze(enums);

export default {
  install(Vue) {
    Vue.prototype.$enums = {
      statuses: {
        DRAFT: "Draft",
        IN_PROGRESS: "In progress",
        DONE: "Done"
      },
      priorities: {
        HIGHEST: {
          value: "Highest",
          color: "red darken-4",
          icon: "arrow_upward"
        },
        HIGH: {
          value: "High",
          color: "red",
          icon: "arrow_upward"
        },
        MEDIUM: {
          value: "Medium",
          color: "orange",
          icon: "arrow_upward"
        },
        LOW: {
          value: "Low",
          color: "green",
          icon: "arrow_downward"
        },
        LOWEST: {
          value: "Lowest",
          color: "light-green",
          icon: "arrow_downward"
        }
      }
    };
  }
};
