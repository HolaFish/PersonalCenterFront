<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :label="lable"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      no-title
      scrollable
      @click:date="$refs.menu.save(date)"
    >
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: ["lable", "value"],
  computed: {
    date: {
      get() {
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
