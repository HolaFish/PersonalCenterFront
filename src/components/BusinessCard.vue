<template>
  <v-card v-if="info" class="ma-6 rounded-xl">
    <v-responsive :aspect-ratio="6 / 3">
      <v-img
        src="../assets/images/material.jpg"
        class="white--text pa-6"
        max-width="550"
        max-height="300"
      >
        <v-row>
          <v-col cols="11">
            <span
              class="font-weight-black text-h4"
              v-html="info.company.name"
            ></span>
          </v-col>
          <v-col cols="1">
            <slot></slot>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" class="pr-4">
            <v-avatar class="profile" color="grey" size="164" tile>
              <v-img :src="info.avatar"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="12" md="8">
            <v-list-item>
              <v-list-item-content>
                <div
                  class="d-flex pl-4 align-center text-h6 font-weight-black white--text"
                  style="height:48px; border-left-style: solid;"
                  v-html="info.name"
                ></div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="card-item">
              <v-list-item-icon class="align-self-center mr-2">
                <v-icon size="18" color="white">mdi-file-tree-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <span>部门：{{ info.dept.name }}</span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="card-item">
              <v-list-item-icon class="align-self-center mr-2">
                <v-icon size="18" color="white"
                  >mdi-account-supervisor-outline</v-icon
                >
              </v-list-item-icon>
              <v-list-item-content>
                <span>职位：{{ info.positionName }}</span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="card-item">
              <v-list-item-icon class="align-self-center mr-2">
                <v-icon size="18" color="white"
                  >mdi-card-account-phone-outline</v-icon
                >
              </v-list-item-icon>
              <v-list-item-content>
                <span>电话：{{ info.phoneNumber }}</span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="card-item">
              <v-list-item-icon class="align-self-center mr-2">
                <v-icon size="18" color="white"
                  >mdi-email-multiple-outline</v-icon
                >
              </v-list-item-icon>
              <v-list-item-content>
                <span>邮箱：{{ info.email }}</span>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-img>
    </v-responsive>
  </v-card>
</template>

<script>
export default {
  props: ["info"],
};
</script>

<style>
.card-item {
  min-height: 24px !important;
  height: 24px;
}
span {
  color: revert;
}
</style>
