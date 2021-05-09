<template>
  <v-row class="pa-4 fill-height">
    <v-col cols="3" class="d-flex flex-column">
      <v-treeview
        :active.sync="active"
        :items="items"
        :load-children="fetchUsers"
        :open.sync="open"
        activatable
        color="primary"
        transition
        item-key="key"
      >
        <template v-slot:prepend="{ item }">
          <v-avatar size="36">
            <div v-if="item.type == 'user'">
              <v-img v-if="null != item.avatar" :src="item.avatar" width="36" height="36"></v-img>
              <v-icon v-else>mdi-account</v-icon>
            </div>
            <v-icon v-else>{{item.avatar}}</v-icon>
          </v-avatar>
        </template>
        <template v-slot:append="{ item }">
          <v-speed-dial
            v-if="item.type == 'company' || item.type == 'department'"
            v-model="item.fab"
            direction="left"
            :open-on-hover="true"
            transition="slide-x-reverse-transition"
          >
            <template v-slot:activator>
              <v-btn
                v-model="item.fab"
                color="blue darken-2"
                dark
                fab
                icon
                small
              >
                <v-icon v-if="item.fab">
                  mdi-arrow-right-drop-circle
                </v-icon>
                <v-icon v-else>
                  mdi-arrow-left-drop-circle
                </v-icon>
              </v-btn>
            </template>
            <!-- 删除按钮 -->
            <v-btn
              v-if="item.type == 'company'"
              fab
              dark
              small
              color="red"
              icon
              @click.stop="showDeleteCompanryAskDialog(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              v-else
              fab
              dark
              small
              color="red"
              icon
              @click.stop="showDeleteDeptAskDialog(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <!-- 修改按钮 -->
            <v-btn
              v-if="item.type == 'company'"
              fab
              dark
              small
              color="green"
              icon
              @click.stop="editCompanyDialogShow(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-else
              fab
              dark
              small
              color="green"
              icon
              @click.stop="editDeptDialogShow(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <!-- 新增部门按钮  -->
            <v-btn
              fab
              dark
              small
              color="indigo"
              icon
              @click.stop="showAddDepartmentDialog(item)"
            >
              <v-icon>mdi-file-tree-outline</v-icon>
            </v-btn>
            <!-- 新增人员按钮 -->
            <v-btn
              v-if="'department' == item.type"
              fab
              dark
              small
              color="indigo"
              icon
              @click.stop="addAccountDialogShow(item)"
            >
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </v-speed-dial>
          <v-btn v-else-if="item.type== 'user'" icon small color="red" @click="dialog_ask_delete_account = true">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-treeview>
      <v-sheet class="align-self-end mt-auto">
        <v-btn
          fab
          dark
          small
          color="primary"
          @click.stop="addCompanyDialogShow"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-sheet>
    </v-col>
    <v-divider vertical></v-divider>
    <v-col cols="9">
      <v-scroll-y-transition mode="out-in">
        <div
          v-if="!selected"
          class="title grey--text text--lighten-1 font-weight-light"
        >
          Select a User
        </div>
        <div v-if="selected" class="d-flex flex-column align-center">
          <business-card v-if="selected" :info="selected">
            <v-btn
              fab
              dark
              small
              color="primary"
              @click.stop="dialog_edit_account = true"
              elevation="8"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </business-card>
          <v-expansion-panels class="mt-6">
            <!-- 修改密码Panel -->
            <v-expansion-panel>
              <v-expansion-panel-header>
                Change Password
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <change-password :userId="selected.id"></change-password>
              </v-expansion-panel-content>
              <v-expansion-panel-content>

              </v-expansion-panel-content>
            </v-expansion-panel>
            <!-- 权限配置Panel -->
            <v-expansion-panel>
              <v-expansion-panel-header>
                Policy Manage
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col md="2">
                    <v-checkbox
                      v-model="policy.MyTask"
                      color="primary"
                      hide-details
                    >
                      <template v-slot:label>
                        <v-list-item>
                          <v-list-item-title>
                            <v-icon>mdi-calendar-account</v-icon>
                            MyTask
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-checkbox>
                  </v-col>
                  <v-col md="2">
                    <v-checkbox
                      v-model="policy.TaskScreen"
                      color="primary"
                      hide-details
                    >
                      <template v-slot:label>
                        <v-list-item>
                          <v-list-item-title>
                            <v-icon>mdi-calendar-clock</v-icon>
                            TaskScreen
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-checkbox>
                  </v-col>
                  <v-col md="2">
                    <v-checkbox
                      v-model="policy.TimeLine"
                      color="primary"
                      hide-details
                    >
                      <template v-slot:label>
                        <v-list-item>
                          <v-list-item-title>
                            <v-icon>mdi-timeline</v-icon>
                            TimeLine
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-checkbox>
                  </v-col>
                  <v-col md="2">
                    <v-checkbox
                      v-model="policy.Account"
                      color="primary"
                      hide-details
                    >
                      <template v-slot:label>
                        <v-list-item>
                          <v-list-item-title>
                            <v-icon>mdi-account-supervisor</v-icon>
                            Account
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-checkbox>
                  </v-col>
                  <v-col md="2">
                    <v-checkbox
                      v-model="policy.Config"
                      color="primary"
                      hide-details
                    >
                      <template v-slot:label>
                        <v-list-item>
                          <v-list-item-title>
                            <v-icon>mdi-tools</v-icon>
                            Config
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-scroll-y-transition>
    </v-col>

    <account-add
      :department="selectedCompanyOrDept"
      :isOpen.sync="dialog_add_account"
      @success="addAccountSuccess"
      @error="addAccountError"
    ></account-add>
    <account-edit
      :user="selected"
      :isOpen.sync="dialog_edit_account"
      @success="editAccountSuccess"
      @error="editAccountError"
    >
    </account-edit>
    <ask-dialog
      :isOpen.sync="dialog_ask_delete_account"
      msg="确认删除该项？"
      @agree="deleteAccount"
    ></ask-dialog>
    <department-add
      :sup="selectedCompanyOrDept"
      :isOpen.sync="dialog_add_department"
      @success="addDeptSuccess"
    ></department-add>
    <department-edit
      :department="selectedCompanyOrDept"
      :isOpen.sync="dialog_edit_department"
      @success="editDeptSuccess"
    ></department-edit>
    <ask-dialog
      :isOpen.sync="dialog_ask_delete_department"
      msg="确认删除该项？"
      @agree="deleteDepartment"
    ></ask-dialog>

    <company-add
      :isOpen.sync="dialog_add_company"
      @success="addCompanySuccess"
    ></company-add>
    <company-edit
      :isOpen.sync="dialog_edit_company"
      :company="editCompany"
      @success="editCompanySuccess"
    ></company-edit>
    <ask-dialog
      :isOpen.sync="dialog_ask_delete_company"
      msg="确认删除该项？"
      @agree="deleteCompany"
    ></ask-dialog>
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
  </v-row>
</template>

<script>
import BusinessCard from "../components/BusinessCard.vue";
import AccountAdd from "../components/AccountAdd.vue";
import AccountEdit from "../components/AccountEdit.vue";
import DepartmentAdd from "../components/DepartmentAdd.vue";
import DepartmentEdit from "../components/DepartmentEdit.vue";
import CompanyAdd from "../components/CompanyAdd.vue";
import CompanyEdit from "../components/CompanyEdit.vue";
import AskDialog from "../components/AskDialog.vue";
import ChangePassword from "../components/ChangePassword"
export default {
  components: {
    BusinessCard,
    AccountAdd,
    AccountEdit,
    DepartmentAdd,
    DepartmentEdit,
    CompanyAdd,
    CompanyEdit,
    AskDialog,
    ChangePassword
  },
  created(){
    let _this = this;
    this.axios.get('/dictionary/subItems/of/Position').then(rep => {
      if (200 == rep.code){
        _this.positions = rep.data;
      }
    })
  },
  data: () => ({
    active: [],
    avatar: null,
    open: [],
    companies: [],
    users: [],
    newCompany: {},
    deleteCompanyId: null,
    policy: {
      MyTask: true,
      TaskScreen: true,
      TimeLine: true,
      Account: true,
      Config: true,
    },
    fab: false,
    transition: "slide-y-reverse-transition",
    dialog_add_account: false,
    dialog_edit_account:false,
    dialog_add_department: false,
    dialog_edit_department: false,
    dialog_ask_delete_department: false,
    dialog_add_company: false,
    dialog_edit_company: false,
    dialog_ask_delete_company: false,
    dialog_ask_delete_account:false,
    editCompany: {
      name: null,
      sort: null,
    },
    selectedCompanyOrDept: null,
    dialog_ask: false,
    snackbar: {
      value: false,
      type: "success",
      msg: "",
    },
    positions:[]
  }),
  computed: {
    items() {
      return [
        {
          id: 0,
          itemId:'root',
          name: "Account",
          type: "root",
          children: this.companies,
        },
      ];
    },
    selected() {
      if (!this.active.length) return undefined;
      if (this.users.length == 0) return undefined;
      const key = this.active[0];
      let user = this.users.find((user) => user.key === key);
      if (null == user) return undefined;
      return user.type == 'user'? user: undefined;
    },
  },
  methods: {
    async fetchUsers(item) {
      let _this = this;
      switch (item.type) {
        case "root":
          return this.axios.get("/account/companies").then((rep) => {
            if (null == rep.data || rep.data.length == 0) {
              _this.showMsg("warning", "No data");
            } else {
              rep.data.forEach((company) => {
                company.key = `company_${company.id}`;
                company.type = "company";
                company.avatar = "mdi-office-building-outline";
                company.fab = false;
                company.children = [];
              });
              item.children.push(...rep.data);
            }
          });
        case "company":
          return this.axios
            .get("/account/department/of/" + item.id)
            .then((rep) => {
              if (null == rep.data || rep.data.length == 0) {
                _this.showMsg("warning", "No data");
              } else {
                rep.data.forEach((dept) => {
                  dept.key = `dept_${dept.id}`;
                  dept.type = "department";
                  dept.avatar = "mdi-file-tree-outline";
                  dept.fab = false;
                  dept.company = {
                    id: item.id,
                    name: item.name,
                  };
                  dept.supDept = { name: "无" };
                  dept.children = [];
                });
                item.children.push(...rep.data);
              }
            });
        case "department":
          return this.axios
            .get("/account/department/" + item.id + "/subDepts")
            .then((rep) => {
              // 加载子部门
              if (200 == rep.code) {
                rep.data.forEach((dept) => {
                  dept.key = `dept_${dept.id}`;
                  dept.type = "department";
                  dept.avatar = "mdi-file-tree-outline";
                  dept.fab = false;
                  dept.company = {
                    id: item.company.id,
                    name: item.company.name,
                  };
                  dept.supDept = {
                    id: item.id,
                    name: item.name,
                  };
                  dept.children = [];
                });
                item.children.push(...rep.data);
              }
              // 加载本部门下的成员
              _this.axios.get("/account/user/of/" + item.id).then((rep) => {
                if (200 == rep.code) {
                  rep.data.forEach((user) => {
                    user.key = `user_${user.id}`;
                    user.type = "user";
                    user.name = user.userName;
                    user.company = {
                      id: item.company.id,
                      name: item.company.name,
                    };
                    user.dept = {
                      id: item.id,
                      name: item.name,
                    };
                    let positionName = '';
                    _this.positions.forEach(p => {
                      if (p.id == user.position){
                        positionName = p.name;
                      }
                    });
                    user.positionName = positionName;
                  });
                  item.children.push(...rep.data);
                  _this.users.push(...rep.data);
                }
              });
            });
      }
    },
    refreshCompanies() {
      let _this = this;
      this.axios.get("/account/companies").then((rep) => {
        rep.data.forEach((company) => {
          company.key = `company_${company.id}`;
          company.type = "company";
          company.avatar = "mdi-office-building-outline";
          company.fab = false;
          company.children = [];
        });
        _this.companies = rep.data;
      });
    },
    showMsg(type, msg) {
      this.snackbar.value = true;
      this.snackbar.type = type;
      this.snackbar.msg = msg;
    },

    addCompanyDialogShow() {
      this.dialog_add_company = true;
    },
    addCompanySuccess() {
      this.dialog_add_company = false;
      this.showMsg("success", "Add one company");
      this.refreshCompanies();
    },
    editCompanyDialogShow(item) {
      this.dialog_edit_company = true;
      this.editCompany.name = item.name;
      this.editCompany.id = item.id;
      this.editCompany.sort = item.sort;
    },
    editCompanySuccess() {
      this.dialog_edit_company = false;
      this.showMsg("success", "Edit one company");
      this.refreshCompanies();
    },
    showDeleteCompanryAskDialog(item) {
      this.dialog_ask_delete_company = true;
      this.deleteCompanyId = item.id;
    },
    deleteCompany() {
      let _this = this;
      this.axios
        .post("/account/company/" + this.deleteCompanyId + "/delete")
        .then((rep) => {
          if (200 == rep.code) {
            _this.showMsg("success", "Delete one company");
            _this.dialog_ask_delete_company = false;
            _this.deleteCompanyId = null;
            _this.refreshCompanies();
          } else {
            _this.showMsg("error", "Faild, please try again");
            _this.dialog_ask_delete_company = false;
            _this.deleteCompanyId = null;
          }
        });
    },
    askDeleteCompany() {
      this.dialog_ask = true;
    },
    showAddDepartmentDialog(item) {
      this.selectedCompanyOrDept = item;
      this.dialog_add_department = true;
    },
    addDeptSuccess() {
      this.showMsg("success", "Add one department");
      this.dialog_add_department = false;
    },
    editDeptDialogShow(item) {
      this.selectedCompanyOrDept = item;
      this.dialog_edit_department = true;
    },
    editDeptSuccess() {
      this.showMsg("success", "Edit one department");
      this.dialog_edit_department = false;
    },
    showDeleteDeptAskDialog(item) {
      this.selectedCompanyOrDept = item;
      this.dialog_ask_delete_department = true;
    },
    deleteDepartment() {
      let _this = this;
      this.axios
        .post(
          "/account/department/" + this.selectedCompanyOrDept.id + "/delete"
        )
        .then((rep) => {
          if (200 == rep.code) {
            _this.showMsg("success", "Delete one department");
            _this.dialog_ask_delete_department = false;
          } else {
            _this.showMsg("error", "Faild, please try again");
            _this.dialog_ask_delete_department = false;
          }
        });
    },
    addAccountDialogShow(item) {
      this.selectedCompanyOrDept = item;
      this.dialog_add_account = true;
    },

    addAccountSuccess() {
      this.showMsg("success", "Add one account");
      this.dialog_add_account = false;
    },
    addAccountError() {
      this.showMsg("error", "Faild, please try again");
      this.dialog_add_account = false;
    },
    editAccountSuccess(){
      this.showMsg("success", "Update one account");
      this.dialog_edit_account = false;
    },
    editAccountError(){
      this.showMsg("error", "Faild, please try again");
      this.dialog_edit_account = false;
    },
    deleteAccount(item){
      this.axios.post('/account/user/' + item.id + '/delete').then(rep => {
        if (200 == rep.code){
          this.showMsg("success", "Delete one account");
        }else{
          this.showMsg("error", "Faild, please try again");
        }
      });
    }
  },
};
</script>

<style></style>
