<template>
  <v-dialog transition="dialog-top-transition" max-width="600" v-model="isShow">
    <template v-slot:default>
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar flat>
          <v-btn icon>
            <v-icon>mdi-account</v-icon>
          </v-btn>
          <v-toolbar-title>Edit Account</v-toolbar-title>
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
                              v-if=" null != info.avatar"
                              :src="info.avatar"
                              width="150"
                              height="150"
                              alt="John"
                            />
                            <v-icon v-else size="150">mdi-account</v-icon>
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
                      v-model="info.company.name"
                      label="公司名称"
                      loader-height="2"
                      outlined
                      type="text"
                      disabled
                    ></v-text-field>
                    <v-text-field
                      v-model="info.dept.name"
                      label="部门名称"
                      loader-height="2"
                      outlined
                      type="text"
                      disabled
                    ></v-text-field>
                    <v-text-field
                      v-model="info.userName"
                      label="姓名"
                      loader-height="2"
                      outlined
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      v-model="info.loginName"
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
              Update
            </v-btn>
            <v-btn color="secondary" @click="close">
              Close
            </v-btn>
          </v-btn-toggle>
        </v-card-actions>
        <image-upload
          field="avatar"
          url="/account/upload/avatar"
          :params="{userId:user.id}"
          v-model="showImgUpload"
          @crop-upload-success="uploadAvatarSuccess"
          @crop-upload-fail="uploadAvatarError"
        ></image-upload>
      </v-card>
    </template>
    <v-snackbar
      v-model="snackbar.value"
      :centered="true"
      :color="snackbar.type"
    >
      <template>
        <v-icon v-if="snackbar.type == 'success'" class="mr-3"
          >mdi-check-circle-outline</v-icon
        >
        <v-icon v-else class="mr-3">mdi-alert-circle-outline</v-icon>
      </template>
      {{ snackbar.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.value = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import ImageUpload from "vue-image-crop-upload/upload-2";
import qs from "qs";
import pinyin from "js-pinyin";
export default {
  props: ["isOpen", "user"],
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
      snackbar: {
        value: false,
        type: "success",
        msg: "",
      },
    };
  },
  methods: {
    showMsg(type, msg) {
      this.snackbar.value = true;
      this.snackbar.type = type;
      this.snackbar.msg = msg;
    },
    submit() {
      let _this = this;
      this.axios.post('/account/user/update',qs.stringify(this.info)).then(rep => {
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
    uploadAvatarSuccess(rep){
      this.info.avatar = rep.data;
      this.toggleShowImgUpload()
    },
    uploadAvatarError(rep){
      this.showMsg('error','Faild to upload avatar, please try again');
    }
  },
  computed: {
    info(){
      return {
        id: this.user.id,
        company:{
          id:this.user.company.id,
          name: this.user.company.name,
        },
        dept:{
          id:this.user.dept.id,
          name:this.user.dept.name,
        },
        userName:this.user.userName,
        loginName: this.user.loginName,
        position:this.user.position,
        phoneNumber:this.user.phoneNumber,
        email:this.user.email,
        sort:this.user.sort,
        avatar: this.user.avatar
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
