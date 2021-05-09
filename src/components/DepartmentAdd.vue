<template>
  <v-dialog
    transition="dialog-top-transition"
    max-width="600"
    v-model="isShow"
  >
    <template v-slot:default>
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar flat>
          <v-btn icon>
            <v-icon>mdi-file-tree-outline</v-icon>
          </v-btn>
          <v-toolbar-title>Add Department</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text style="height: 500px; overflow-y: scroll">
          <v-container>
            <v-row>
              <v-col>
                <v-card color="grey lighten-4" class="pa-4" flat>
                  <v-form ref="form">
                    <v-text-field
                      v-model="info.company.name"
                      label="公司名称"
                      loader-height="2"
                      outlined
                      type="text"
                      disabled
                    ></v-text-field>
                    <v-text-field
                      v-model="info.name"
                      label="部门名称"
                      loader-height="2"
                      outlined
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      v-model="info.supDeptName"
                      label="上级部门"
                      loader-height="2"
                      outlined
                      disabled
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
  props: ["isOpen", "sup"],

  methods: {
    submit() {
      let _this = this;
      var newDept = {
        companyId: this.info.company.id,
        supDeptId: this.info.supDeptId,
        name: this.info.name,
        sort: this.info.sort
      }
      this.axios
        .post("/account/department/add", qs.stringify(newDept))
        .then((rep) => {
          if (200 == rep.code) {
            _this.$emit("success", rep);
          } else {
            _this.$emit("error", rep);
          }
        });
    },
    close() {
      this.isShow = false;
    },
  },
  computed: {
    superDepts() {
      if (this.sup.type == 'company'){
        return [];
      }else{
        return [this.supDept];
      }
    },
    info() {
      var supDeptId = null;
      var company = null;
      var supDeptName = null;
      if ("company" == this.sup.type){
        supDeptId = null;
        company = this.sup;
      }else{
        supDeptId = this.sup.id;
        supDeptName = this.sup.name;
        company = this.sup.company;
      }
      return {
        company: company,
        name: null,
        supDeptId: supDeptId,
        supDeptName: supDeptName,
        sort: null,
      };
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
