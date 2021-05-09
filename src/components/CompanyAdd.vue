<template>
  <v-dialog
    transition="dialog-top-transition"
    max-width="600"
    v-model="isShow"
  >
    <template v-slot:default>
      <v-card color="grey lighten-4" min-width="100px" flat>
        <v-toolbar flat>
          <v-btn icon>
            <v-icon>mdi-file-tree-outline</v-icon>
          </v-btn>
          <v-toolbar-title>Add Company</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text style="height: 250px; overflow-y: scroll">
          <v-container>
            <v-row>
              <v-col>
                <v-card color="grey lighten-4" class="pa-4" flat>
                  <v-form ref="form">
                    <v-text-field
                      v-model="info.name"
                      label="公司名称"
                      loader-height="2"
                      outlined
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      v-model="info.sort"
                      label="排序"
                      loader-height="2"
                      outlined
                      type="text"
                    ></v-text-field>
                  </v-form>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn-toggle>
            <v-btn color="primary" @click="submit">
              Add
            </v-btn>
            <v-btn color="secondary" @click="close">
              Close
            </v-btn>
          </v-btn-toggle>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import qs from "qs";
export default {
  props: ["isOpen"],
  data() {
    return {
      company: {
        name: null,
        sort: null,
      },
    };
  },
  methods: {
    submit() {
      let _this = this;
      this.axios
        .post("/account/company/add", qs.stringify(this.company))
        .then((rep) => {
          if (200 == rep.code) {
            _this.$emit("success");
          } else {
            _this.$emit("error");
          }
        });
    },
    close() {
      this.isShow = false;
    },
  },
  computed: {
    info() {
      return this.company;
    },
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
