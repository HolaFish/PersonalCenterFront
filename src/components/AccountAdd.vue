<template>
  <v-dialog transition="dialog-top-transition" max-width="600" v-model="isShow">
    <template v-slot:default>
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar flat>
          <v-btn icon>
            <v-icon>mdi-account</v-icon>
          </v-btn>
          <v-toolbar-title>Add Account</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text style="height: 500px; overflow-y: scroll">
          <v-container>
            <v-row>
              <v-col>
                <v-card color="grey lighten-4" class="pa-4" flat>
                  <v-form ref="form">
                    <div class="d-flex mb-6 justify-center">
                      <v-hover>
                        <template v-slot:default="{ hover }">
                          <v-avatar size="150">
                            <img
                              src="https://cdn.vuetifyjs.com/images/john.jpg"
                              alt="John"
                            />
                            <v-fade-transition>
                              <v-overlay v-if="hover" absolute color="primary">
                                <v-btn @click="toggleShowImgUpload"
                                  >修改头像</v-btn
                                >
                              </v-overlay>
                            </v-fade-transition>
                          </v-avatar>
                        </template>
                      </v-hover>
                    </div>

                    <v-text-field
                      v-model="info.companyName"
                      label="公司名称"
                      loader-height="2"
                      outlined
                      type="text"
                      disabled
                    ></v-text-field>
                    <v-text-field
                      v-model="info.deptName"
                      label="部门名称"
                      loader-height="2"
                      outlined
                      type="text"
                      disabled
                    ></v-text-field>
                    <v-text-field
                      v-model="name"
                      label="姓名"
                      loader-height="2"
                      outlined
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      v-model="loginName"
                      label="登录名"
                      loader-height="2"
                      outlined
                      type="text"
                    ></v-text-field>
                    <v-select
                      v-model="info.position"
                      label="职位"
                      no-data-text="没有可用选项"
                      :items="positions"
                      item-text="name"
                      item-value="id"
                      outlined
                    ></v-select>
                    <v-text-field
                      v-model="info.phoneNumber"
                      label="电话"
                      loader-height="2"
                      outlined
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      v-model="info.email"
                      label="邮箱"
                      loader-height="2"
                      outlined
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      v-model="info.sort"
                      label="排序"
                      loader-height="2"
                      outlined
                      type="number"
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
        <image-upload
          field="img"
          url="/upload"
          v-model="showImgUpload"
          @crop-upload-success="toggleShowImgUpload"
          @crop-upload-fail="toggleShowImgUpload"
        ></image-upload>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import ImageUpload from "vue-image-crop-upload/upload-2";
import qs from "qs";
import pinyin from "js-pinyin";
export default {
  props: ["isOpen", "department"],
  components: { ImageUpload },
  created(){
    let _this = this;
    this.axios.get('/dictionary/subItems/of/Position').then(rep => {
      if (200 == rep.code){
        _this.positions = rep.data;
      }
    })
  },
  data() {
    return {
      showImgUpload: false,
      positions: null,
      name:null,
    };
  },
  methods: {
    submit() {
      let _this = this;
      this.axios.post('/account/user/add',qs.stringify(this.info)).then(rep => {
        if (200 == rep.code){
          _this.$emit('success',rep);
        }else{
          _this.$emit('error',rep);
        }
      });
    },
    close() {
      this.isShow = false;
    },
    toggleShowImgUpload() {
      this.showImgUpload = !this.showImgUpload;
    },
  },
  computed: {
    info() {
      return {
        companyId:this.department.company.id,
        companyName:this.department.company.name,
        deptId: this.department.id,
        deptName: this.department.name,
        userName:this.name,
        loginName: this.name == null ? null : pinyin.getFullChars(this.name),
        position:null,
        phoneNumber:null,
        email:null,
        sort:null
      }
    },
    loginName(){
      if (null != this.name){
        return pinyin.getFullChars(this.name);
      }
      return null;
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
