<template>
  <v-app v-if="null != user">
    <v-navigation-drawer permanent expand-on-hover app>
      <v-list>
        <v-list-item link>
          <v-list-item-avatar :left="true">
            <v-avatar color="primary" size="36">
              <v-img v-if="null != user.avatar" :src="user.avatar"></v-img>
              <span
                v-else
                class="white--text headline"
                v-html="subUserName"
              ></span
            ></v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="title"
              v-html="user.userName"
            ></v-list-item-title>
            <v-list-item-subtitle v-html="user.email"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item link to="MyTask">
          <v-list-item-icon>
            <v-icon>mdi-calendar-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>MyTask</v-list-item-title>
        </v-list-item>
        <v-list-item link to="Task">
          <v-list-item-icon>
            <v-icon>mdi-calendar-clock</v-icon>
          </v-list-item-icon>
          <v-list-item-title>TaskScreen</v-list-item-title>
        </v-list-item>
        <v-list-item link to="TimeLine">
          <v-list-item-icon>
            <v-icon>mdi-timeline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>TimeLine</v-list-item-title>
        </v-list-item>
        <v-list-item link to="Account">
          <v-list-item-icon>
            <v-icon>mdi-account-supervisor</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Account</v-list-item-title>
        </v-list-item>
        <v-list-item link to="Dictionary">
          <v-list-item-icon>
            <v-icon>mdi-book-open</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dictionary</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer app class="justify-center">
      <!-- <div>&copy; 2021 刘润枝</div> -->
      <div class="align-self-center mx-auto">V0.0.1</div>
      <v-btn small @click="logout" class="mx-end">Logout</v-btn>
    </v-footer>
  </v-app>
</template>

<script>
import store from "../store";
export default {
  created() {
    store.getCurrentUser((user) => (this.user = user));
  },
  data() {
    return {
      user: null,
      menu: [],
    };
  },
  computed: {
    subUserName() {
      if (null == this.user) {
        return "";
      }
      return this.user.userName.substr(0, 1);
    },
  },
  methods:{
    logout(){
      this.axios.get('/auth/logout')
    }
  }
};
</script>

<style></style>
