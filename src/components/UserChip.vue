<template>
  <v-chip
      v-if="null != user && null != user.userName"
      class="ma-2"
      color="primary"
      @click="click(user)"
    >
      <v-avatar color="blue-grey lighten-3">
        <v-img
          v-if="null != user.avatar"
          :src="user.avatar"
        ></v-img>
        <span
          v-else
          class="white--text headline pa-2 text-body-1"
          >{{ user.userName.substr(0, 1) }}</span
        ></v-avatar>
      <span class="ml-2">{{ user.userName }}</span>
    </v-chip>
</template>

<script>
export default {
  props:['user'],
  methods:{
    click(user){
      this.$emit('click',user);
    }
  }
}
</script>

<style>

</style>