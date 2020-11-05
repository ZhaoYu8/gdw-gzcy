<template>
  <div id="app">
    <div class="concat">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      vuex: (state) => state,
    }),
  },
  methods: {
    ...mapActions({
      getCommon: 'getCommon',
      getCust: 'getCust',
      getLocation: 'getLocation',
      getFilter: 'getFilter',
    }),
  },
  created() {
    let obj = {
      getCommon: this.getCommon,
      getCust: this.getCust,
      getLocation: this.getLocation,
      getFilter: this.getFilter,
    };
    Object.assign(Vue.prototype, {
      $vuexFn: obj,
      $vuexData: { x: this.vuex },
    });
  },
};
</script>
<style lang="scss">
#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #ccc9c7;
  border: 2px solid transparent;
  border-radius: 10px;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(50, 50, 50, 0.5);
}

::-webkit-scrollbar-track {
  background-color: rgba(50, 50, 50, 0.05);
}
</style>
