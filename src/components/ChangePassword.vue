<template>
  <v-sheet class="d-flex flex-column">
    <v-text-field
      outlined
      label="Password"
      placeholder="Please input the password"
      v-model="oldPassword1"
      type="password"
      :rules="pwd"
      validate-on-blur
    >
    </v-text-field>
    <v-text-field
      outlined
      label="Password"
      placeholder="Please input the password again"
      v-model="oldPassword2"
      type="password"
      :rules="oldPwd2"
      validate-on-blur
    >
    </v-text-field>
    <v-text-field
      outlined
      label="New Password"
      placeholder="Please input the new password"
      v-model="newPassword"
      type="password"
      :rules="pwd"
      validate-on-blur
    >
    </v-text-field>
    <v-btn-toggle class="align-self-end">
      <v-btn small color="primary" @click="changePwd">Change</v-btn>
      <v-btn small color="secendary" @click="reset">Reset</v-btn>
    </v-btn-toggle>
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
  </v-sheet>
</template>

<script>
import qs from "qs";
export default {
    props:['userId'],
  data() {
    return {
      oldPassword1: null,
      oldPwd2: [
        (value) => !!value || "The password is required",
        this.valideOldPwd,
      ],
      pwd: [(value) => !!value || "The password is required"],
      oldPassword2: null,
      newPassword: null,
      snackbar: {
        value: false,
        type: "success",
        msg: "",
      },
    };
  },
  computed: {
    params() {
      return {
        oldPassword: this.oldPassword1,
        newPassword: this.newPassword,
        userId: this.userId
      };
    },
  },
  methods: {
    showMsg(type, msg) {
      this.snackbar.value = true;
      this.snackbar.type = type;
      this.snackbar.msg = msg;
    },
    changePwd() {
      this.axios
        .post("/auth/changePassword", qs.stringify(this.params))
        .then((rep) => {
          if (200 == rep.code) {
            this.showMsg("success", "Change password success");
          } else {
            this.showMsg("error", rep.msg);
          }
        });
    },
    reset() {
      this.oldPassword1 = null;
      this.oldpassword2 = null;
      this.newPassword = null;
    },
    valideOldPwd() {
      if (null != this.oldPassword1 && this.oldPassword1 != this.oldPassword2) {
        return "The two old password is different";
      }
      return true;
    },
  },
};
</script>

<style>
</style>