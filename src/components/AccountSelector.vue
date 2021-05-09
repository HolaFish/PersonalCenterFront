<template>
  <v-dialog transition="dialog-top-transition" max-width="500" v-model="isShow">
    <template v-slot:default>
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar flat>
          <v-btn icon>
            <v-icon>mdi-account-group</v-icon>
          </v-btn>
          <v-toolbar-title>Select Users</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text style="height: 400px;">
          <v-container>
            <!-- 公司、部门下拉框 -->
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-select
                  :items="companies"
                  item-value="id"
                  item-text="name"
                  v-model="selectedCompany"
                  label="Company"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="depts"
                  item-value="id"
                  item-text="name"
                  v-model="selectedDept"
                  label="Department"
                ></v-select>
              </v-col>
            </v-row>
            <!-- 人员列表 -->
            <v-row no-gutters>
              <!-- {{defaultAccount.userName}} -->
              <v-col
                cols="12"
                sm="4"
                v-for="account in accounts"
                :key="account.id"
              >
                <v-chip
                  class="ma-2"
                  :color="account.selected ? 'primary' : 'default'"
                  @click="selectUser(account)"
                >
                  <v-avatar color="blue-grey lighten-3">
                    <v-img
                      v-if="null != account.avatar"
                      :src="account.avatar"
                    ></v-img>
                    <span
                      v-else
                      class="white--text headline pa-2 text-body-1"
                      >{{ account.userName.substr(0, 1) }}</span
                    ></v-avatar
                  >
                  <span class="ml-2">{{ account.userName }}</span>
                </v-chip>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-subheader>
          Selected:
        </v-subheader>
        <!-- 已选人员列表 -->
        <v-sheet
          rounded
          outlined
          min-height="56"
          class="mb-8 pa-2"
        >
          <div class="d-flex">
            <user-chip
              v-for="account in nativeSelectedAccounts"
              :key="account.id"
              :user="account"
            ></user-chip>
          </div>
        </v-sheet>
        <v-card-actions class="justify-end">
          <v-btn color="secondary" @click="close">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import UserChip from "./UserChip";
export default {
  components: { UserChip },
  props: ["isOpen", "selectedAccounts"],
  created() {
    /**
     * 初始化公司列表
     */
    let _this = this;
    this.axios.get("/account/companies").then((rep) => {
      if (200 == rep.code) {
        _this.companies = rep.data;
      }
    });
  },
  data() {
    return {
      selectedCompany: null,
      selectedDept: null,
      companies: [],
      depts: [], //可选部门
      accounts: [], // 可选账号
    };
  },
  methods: {
    /**
     * 用户纸片点击事件的回调
     */
    selectUser(account) {
      account.selected = !account.selected;
      if (account.selected) {
        this.nativeSelectedAccounts.push(account);
      } else {
        this.nativeSelectedAccounts = this.nativeSelectedAccounts.filter(
          (item) => item.id != account.id
        );
      }
    },
    close() {
      this.isShow = false;
    },
  },
  computed: {
    isShow: {
      get() {
        return this.isOpen;
      },
      set(val) {
        this.$emit("update:isOpen", val);
      },
    },
    nativeSelectedAccounts: {
      get() {
        return this.selectedAccounts;
      },
      set(val) {
        this.$emit("update:selectedAccounts", val);
      },
    },
  },
  watch: {
    selectedCompany(newval, oldval) {
      /**
       * 获取部门列表
       */
      let _this = this;
      this.axios.get("/account/allDepartment/of/" + newval).then((rep) => {
        if (200 == rep.code) {
          _this.depts = rep.data;
        }
      });
    },
    selectedDept(newval, oldval) {
      /**
       * 获取人员列表
       */
      let _this = this;
      this.axios.get("/account/user/of/" + newval).then((rep) => {
        if (200 == rep.code) {
          rep.data.forEach((account) => {
            _this.nativeSelectedAccounts.forEach(selected => {
              if (selected.id == account.id){
                account.selected = true;
              }
            })
          });
          _this.accounts = rep.data;
        }
      });
    },
  },
};
</script>

<style></style>
