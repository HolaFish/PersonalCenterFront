<template>
  <v-dialog transition="dialog-top-transition" max-width="600" v-model="isShow">
    <template v-slot:default>
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar flat>
          <v-btn icon>
            <v-icon>mdi-file-tree-outline</v-icon>
          </v-btn>
          <v-toolbar-title>Edit Department</v-toolbar-title>
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
                      v-model="info.supDept.name"
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
              Update
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
  props: ["isOpen", "department"],
  methods: {
    submit() {
      let _this = this;
      let dept = {
        id: this.info.id,
        name: this.info.name,
        sort: this.info.sort
      }
      this.axios.post('/account/department/update',qs.stringify(dept)).then(rep =>{
        if (200 == rep.code){
          _this.$emit('success',rep);
        }else{
          _this.$emit('error',rep)
        }
      })
    },
    close() {
      this.isShow = false;
    },
  },
  computed: {
    info() {
      return {
        id:this.department.id,
        name:this.department.name,
        sort:this.department.sort,
        supDept:{
          name: this.department.supDept.name
        },
        company:{
          name: this.department.company.name
        }
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
