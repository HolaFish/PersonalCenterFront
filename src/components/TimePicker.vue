<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        :label="lable"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="menu"
      v-model="time"
      full-width
      @click:minute="$refs.menu.save(time)"
    ></v-time-picker>
  </v-menu>
</template>

<script>
export default {
  props: ["lable", "value"],
  computed: {
    time: {
      get() {
        if (null == this.value) {
          return "";
        }
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      },
    },
  },
  data() {
    return {
      menu: false,
    };
  },
};
</script>

<style></style>
