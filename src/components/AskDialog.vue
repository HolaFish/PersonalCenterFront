<template>
  <v-dialog v-model="isShow" max-width="290">
    <v-card>
      <v-card-title v-if="title" class="headline" v-html="title"></v-card-title>
      <v-card-title v-else class="headline">Ask </v-card-title>
      <v-card-text v-html="msg"> </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="isShow = false">
          Disagree
        </v-btn>
        <v-btn color="green darken-1" text @click="agree">
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["isOpen", "title", "msg"],
  data() {
    return {
      superDepts: [],
    };
  },
  methods: {
    agree() {
      this.isShow = false;
      this.$emit("agree");
    },
  },
  computed: {
    isShow: {
      get() {
        return this.isOpen;
      },
      set(val) {
        this.$emit("update:isOpen", val);
      },
    },
  },
};
</script>

<style></style>
