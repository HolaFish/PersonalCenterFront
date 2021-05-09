<template>
  <v-app :style="bg">
     <v-row align="center" justify="center" no-gutters>
      <transition name="flip">
        <div class="login-main">
          <v-card elevation="7" height="500" width="445" class="login-card">
            <div class="login-title">
              <div class="border">
                <span style="font-family: '幼圆' !important">登录</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>LOGIN</span>
              </div>
            </div>
            <v-form ref="loginForm">
              <v-text-field
                v-model="user.userName"
                :rules="nameRules"
                label="用户名"
              ></v-text-field>
              <v-text-field
                v-model="user.password"
                :rules="passwordRules"
                type="password"
                label="密码"
              ></v-text-field>
              <v-row justify="end" no-gutters>
                <v-btn
                  @click="login"
                  @keypress.enter ="login"
                  class="login-submit"
                  color="primary"
                  elevation="2"
                  >登录</v-btn
                >
              </v-row>
            </v-form>
          </v-card>
          <v-img
            elevation="7"
            class="login-logo"
            src="../assets/images/logo.png"
            width="20px"
            height="120"
          ></v-img>
        </div>
      </transition>
    </v-row>
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
    <v-overlay
      :absolute="true"
      :value="overlay"
    >
      <v-progress-circular
      :size="50"
      :width="7"
      color="primary"
      indeterminate
    ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      bg: {
        backgroundImage:
          "url(" + require("../assets/images/bg_login.png") + ")",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      },
      user: {
        userName: "",
        password: "",
      },
      registerUser: {
        userName: "",
        emailAddress: "",
        password: "",
        inviteCode: "",
      },
      nameRules: [(v) => !!v || "Name is required"],
      passwordRules: [(v) => !!v || "Password is required"],
      snackbar: {
        value: false,
        type: "success",
        msg: "",
      },
      overlay:false
    };
  },
  mounted() {
    var _this = this;
    window.addEventListener('keyup', function(event) {
      if (event.code === 'Enter') { 
        _this.login();
      }
    });
  },
  methods: {
    login() {
      let _this = this;
      if (this.$refs.loginForm.validate()) {
        this.overlay = true;
        this.axios.post("/auth/login",qs.stringify(this.user)).then(function(res){
          if (200 == res.code){
            _this.$router.push("Main");
          }else{
            _this.snackbar.value = true;
            _this.snackbar.msg = res.msg;
            _this.snackbar.type = 'error'
          }
          _this.overlay = false;
        });
        
      }
    },
  },
};
</script>

<style>
.login-card {
  padding: 66px 66px 0px 66px;
  font-family: "FounderType" !important;
}
.register-card {
  padding: 40px 66px 0px 66px;
  font-family: "FounderType" !important;
}
.login-title {
  padding: 0px !important;
  margin-bottom: 100px;
  font-size: 24px;
}
.register-title {
  padding: 0px !important;
  margin-bottom: 60px;
  font-size: 24px;
}
.login-title .border {
  border-bottom-width: 2px;
  border-bottom-style: solid;
  display: table-cell;
}
.login-main {
  display: flex;
}
.login-footer {
  position: absolute;
  bottom: 25px;
  padding-left: 20px;
  font-size: 16px;
}
.login-logo {
  margin-left: 20px;
  margin-top: 15px;
}
.register-logo {
  margin-right: 20px;
  margin-top: 15px;
}
.login-submit {
  margin-top: 30px;
}

.flip-enter,
.flip-leave-to {
  transform: rotateY(180deg);
  opacity: 0;
}

.flip-enter-active,
.flip-leave-active {
  transition: all 1s;
}
</style>
