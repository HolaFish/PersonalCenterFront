<template>
  <v-row class="pa-4 fill-height">
    <v-col cols="3" class="d-flex flex-column">
      <v-treeview
        :active.sync="active"
        :items="items"
        :load-children="fetchItems"
        :open.sync="open"
        activatable
        color="primary"
        transition
        selection-type="independent"
        @update:active="activeEvent"
      >
      </v-treeview>
    </v-col>
    <v-divider vertical></v-divider>
    <v-col cols="9">
      <v-data-table
        :headers="headers"
        :items="tableItems"
        :loading="isLoading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <!-- 新增字典项 -->
            <v-dialog
              v-if="tableType == 'dictionary'"
              v-model="addItemDialog"
              max-width="500px"
            >
              <template v-slot:activator="{ attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  @click="showAddDialog"
                >
                  New Item
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Add New Item</span>
                </v-card-title>
                <v-form ref="editForm">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="newItem.code"
                            :rules="itemCodeRule"
                            label="Code"
                            :validate-on-blur="true"
                            :error="aboutRule.code.error"
                            :error-messages="aboutRule.code.errorMessages"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="newItem.name"
                            :rules="[(v) => !!v || 'Name is required']"
                            :validate-on-blur="true"
                            label="Name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="newItem.sort"
                            :rules="itemSortRulde"
                            :validate-on-blur="true"
                            label="Sort"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeAddDialog">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="addItem">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- 新增作业类型 -->
            <v-dialog v-else v-model="addTaskTypeDialog" max-width="500px">
              <template v-slot:activator="{ attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  @click="addTaskTypeDialog = true"
                >
                  New Task Type
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Add New Task Type</span>
                </v-card-title>
                <v-form ref="editForm">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="newTaskType.name"
                            label="Type Name"
                            :rules="[(v) => !!v || 'Name is required']"
                            :validate-on-blur="true"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-color-picker
                        class="ma-2"
                        show-swatches
                        mode="hexa"
                        v-model="newTaskType.color"
                      ></v-color-picker>
                    </v-container>
                  </v-card-text>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeAddTaskTypeDialog">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="addTaskType">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- 修改字典项 -->
            <v-dialog v-model="editItemDialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Edit Item</span>
                </v-card-title>
                <v-form ref="editForm">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editItem.code"
                            :rules="itemCodeRule2"
                            label="Code"
                            :validate-on-blur="true"
                            :error="aboutRule.codeInEdit.error"
                            :error-messages="aboutRule.codeInEdit.errorMessages"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editItem.name"
                            :rules="[(v) => !!v || 'Name is required']"
                            :validate-on-blur="true"
                            label="Name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editItem.sort"
                            :rules="itemSortRulde"
                            :validate-on-blur="true"
                            label="Sort"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeEditDialog">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="updateItem">
                    Update
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- 修改作业类型 -->
            <v-dialog v-model="editTaskTypeDialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Edit Task Type</span>
                </v-card-title>
                <v-form ref="editForm">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editTaskType.name"
                            label="Type Name"
                            :rules="[(v) => !!v || 'Name is required']"
                            :validate-on-blur="true"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-color-picker
                        class="ma-2"
                        show-swatches
                        mode="hexa"
                        v-model="editTaskType.color"
                      ></v-color-picker>
                    </v-container>
                  </v-card-text>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeEditTaskTypeDialog">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="editTaskTypeSubmit">
                    Update
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <!-- TaskType color列 -->
        <template v-slot:[`item.color`]="{item}">
          <div :style="{background:item.color, height:'20px', width:'40px' }"></div>
        </template>
        <!-- Dictionary Action列 -->
        <template v-if="tableType == 'dictionary'" v-slot:[`item.actions`]="{ item }">
          <v-btn icon small @click="showEditDialog(item)">
            <v-icon small>
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn icon small @click="showDeleteDialog(item.id)">
            <v-icon small>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <!-- TaskType 的 Action列 -->
        <template v-else v-slot:[`item.actions`]="{ item }">
          <v-btn icon small @click="showEditTaskTypeDialog(item)">
            <v-icon small>
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn icon small @click="showDeleteTaskTypeDialog(item.id)">
            <v-icon small>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
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
    <ask-dialog
      :isOpen.sync="deleteDicItemDialog"
      @agree="deleteItem"
      msg="Are you sure to delete this item?"
    ></ask-dialog>
    <ask-dialog
      :isOpen.sync="deleteTasktypeDialog"
      @agree="deleteTaskType"
      msg="Are you sure to delete this item?"
    ></ask-dialog>
  </v-row>
</template>

<script>
import qs from "qs";
import AskDialog from '../components/AskDialog.vue';
export default {
  components:{AskDialog},
  data() {
    return {
      dicItems: [],
      taskTypes: [],
      active: [],
      open: [],
      selectedItem: {},
      snackbar: {
        value: false,
        type: "success",
        msg: "",
      },
      isLoading: false,
      addItemDialog: false,
      editItemDialog: false,
      deleteDicItemDialog: false,
      addTaskTypeDialog: false,
      editTaskTypeDialog: false,
      deleteTasktypeDialog: false,
      newItem: {},
      newTaskType: {},
      editItem: {},
      eidtItemCopy: {},
      deleteItemId: null,
      editTaskType:{},
      deleteTaskTypeId: null,
      pagination: {},
      headers: [],
      dicHeaders: [
        {
          text: "code",
          align: "start",
          sortable: false,
          value: "code",
        },
        { text: "name", value: "name" },
        { text: "sort", value: "sort" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      taskTypeHeaders: [
        { text: "name", value: "name" },
        { text: "color", value: "color" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      tableItems: [],
      tableType: null, // 当前Table中的类型（字典项/任务类型）
      itemCodeRule: [
        (value) => this.validItemCode(value),
        (value) => !!value || "Code is required",
      ],
      itemCodeRule2: [
        (value) => this.validItemCode2(value),
        (value) => !!value || "Code is required",
      ],
      aboutRule: {
        code: {
          error: false,
          errorMessages: [],
        },
        codeInEdit: {
          error: false,
          errorMessages: [],
        },
      },
      itemSortRulde: [(value) => !!value || "Sort is required"],
    };
  },
  computed: {
    items() {
      return [
        {
          id: 0,
          name: "Dictionary",
          children: this.dicItems,
        },
        {
          id: -1,
          name: "TaskType",
          chilrren: this.taskTypies,
        },
      ];
    },
  },
  created() {
    let _this = this;
    this.axios.get("/dictionary/root").then(function(rep) {
      if (200 == rep.code) {
        rep.data.forEach((element) => {
          element.children = [];
          element.type = "dictionary";
        });
        _this.headers = _this.dicHeaders;
        _this.tableType = "dictionary";
        _this.dicItems = rep.data;
      }
    });
  },
  methods: {
    showMsg(type, msg) {
      this.snackbar.value = true;
      this.snackbar.type = type;
      this.snackbar.msg = msg;
    },
    /**
     * 展示新增弹窗
     */
    showAddDialog() {
      if (this.active.length == 0) {
        this.showMsg("info", "Please selecte an item");
        return;
      }
      if (this.active[0] != 0){
        this.newItem = {
          supCodeId: this.active[0],
        };
      }
      this.addItemDialog = true;
    },
 
    /**
     * 关闭新增弹窗
     */
    closeAddDialog() {
      this.addItemDialog = false;
    },
    /**
     * 新增Item
     */
    addItem() {
      let _this = this;
      // 新增
      this.axios
        .post("/dictionary/add", qs.stringify(this.newItem))
        .then((rep) => {
          if (200 == rep.code) {
            _this.showMsg("success", "Add one item");
            _this.addItemDialog = false;
            _this.activeEvent(_this.active);
          } else {
            _this.showMsg("error", "Faild, please try again");
          }
        });
      this.addItemDialog = false;
    },
    /**
     * 显示修改窗口
     */
    showEditDialog(item) {
      this.editItem.id = item.id;
      this.editItem.code = item.code;
      this.editItem.name = item.name;
      this.editItem.sort = item.sort;
      this.eidtItemCopy = item;
      this.editItemDialog = true;
    },
    closeEditDialog() {
      this.editItem = {};
      this.editItemDialog = false;
    },
    updateItem() {
      let _this = this;
      this.axios
        .post("/dictionary/update", qs.stringify(this.editItem))
        .then((rep) => {
          if (200 == rep.code) {
            _this.showMsg("success", "Update one item");
            _this.editItemDialog = false;
            _this.eidtItemCopy.code = _this.editItem.code;
            _this.eidtItemCopy.name = _this.editItem.name;
            _this.eidtItemCopy.sort = _this.editItem.sort;
            _this.editItem = {};
          } else {
            _this.showMsg("error", "Faild, please try again");
          }
        });
    },
    /**
     * 展示确认删除字典项窗口
     */
    showDeleteDialog(id){
      this.deleteItemId = id;
      this.deleteDicItemDialog = true;
    },
    /**
     * 删除字典项
     */
    deleteItem() {
      let _this = this;
      this.axios
        .post("/dictionary/item/" + this.deleteItemId + "/delete")
        .then((rep) => {
          if (200 == rep.code) {
            _this.showMsg("success", "Delete one item");
            _this.deleteDicItemDialog = false;
            _this.tableItems = _this.tableItems.filter(
              (item) => item.id != _this.deleteItemId
            );
            _this.deleteItemId = null;
          } else {
            _this.showMsg("error", "Faild, please try again");
          }
        });
    },
    activeEvent(active) {
      this.isLoading = true;
      let _this = this;
      if (active.length == 0) {
        this.selectedItem = {};
        this.tableItems = [];
        this.isLoading = false;
        return;
      }
      if (active[0] == -1) {
        _this.tableType = "taskType";
        /**
         * 获取任务类型
         */
        this.axios.get("/task/type/all").then((rep) => {
          if (200 == rep.code) {
            if (rep.data.length == 0) {
              _this.snackbar.value = true;
              _this.snackbar.type = "warning";
              _this.snackbar.msg = "无数据";
              _this.headers = _this.dicHeaders;
              _this.tableItems = rep.data;
              _this.isLoading = false;
            } else {
              rep.data.forEach((type) => {
                type.type = "taskType";
              });
              _this.headers = _this.taskTypeHeaders;
              _this.tableItems = rep.data;
              _this.isLoading = false;
            }
          }
        });
        return;
      }

      var url = "";
      if (active[0] == 0) {
        url = "/dictionary/root";
      } else {
        this.axios
          .get("/dictionary/get/" + active[0])
          .then((rep) => (_this.selectedItem = rep.data));
        url = "/dictionary/items/" + active[0];
      }
      _this.tableType = "dictionary";
      this.axios.get(url).then(function(rep) {
        if (200 == rep.code) {
          if (rep.data.length == 0) {
            _this.snackbar.value = true;
            _this.snackbar.type = "warning";
            _this.snackbar.msg = "无数据";
            _this.headers = _this.dicHeaders;
            _this.tableItems = rep.data;
            _this.isLoading = false;
          } else {
            _this.tableItems = rep.data;
            _this.isLoading = false;
          }
        } else {
          _this.isLoading = false;
        }
      });
    },
    async fetchItems(item) {
      //打开节点的事件回调
      let _this = this;
      return this.axios.get("/dictionary/items/" + item.id).then((rep) => {
        if (200 == rep.code) {
          if (rep.data.length == 0) {
            _this.snackbar.value = true;
            _this.snackbar.type = "warning";
            _this.snackbar.msg = "无数据";
          } else {
            item.children = rep.data;
          }
        }
      });
    },
    /**
     * 新增时，对Code的唯一性校验
     */
    validItemCode(code) {
      let _this = this;
      this.axios.get("/dictionary/check/" + code + "/exist").then((rep) => {
        if (rep.data) {
          _this.aboutRule.code.error = true;
          _this.aboutRule.code.errorMessages[0] = "Code is exist";
        } else {
          _this.aboutRule.code.error = false;
          _this.aboutRule.code.errorMessages = [];
        }
      });
      return true;
    },
    /**
     * 修改时，对code的唯一性校验
     */
    validItemCode2(code) {
      if (code == this.eidtItemCopy.code) {
        return true;
      }
      let _this = this;
      this.axios.get("/dictionary/check/" + code + "/exist").then((rep) => {
        if (rep.data) {
          _this.aboutRule.codeInEdit.error = true;
          _this.aboutRule.codeInEdit.errorMessages[0] = "Code is exist";
        } else {
          _this.aboutRule.codeInEdit.error = false;
          _this.aboutRule.codeInEdit.errorMessages = [];
        }
      });
      return true;
    },

    closeAddTaskTypeDialog(){
      this.addTaskTypeDialog = false;
      this.newTaskType = {};
    },
    addTaskType(){
      let _this = this;
      let color = this.newTaskType.color.hexa;
      delete this.newTaskType.color;
      this.newTaskType.color = color;
      this.axios.post('/task/type/add',qs.stringify(this.newTaskType)).then(rep =>{
        if (200 == rep.code){
          _this.showMsg('success','Add one Task Type');
          _this.addTaskTypeDialog = false;
          _this.taskTypes.push(rep.data);
        }else{
          _this.showMsg('error','Falid, please try again');
        }
      });
    },

    showEditTaskTypeDialog(item){
      this.editTaskType.id = item.id;
      this.editTaskType.name = item.name;
      this.editTaskType.color = item.color;
      this.editTaskTypeDialog = true;
    },
    closeEditTaskTypeDialog(){
      this.editTaskTypeDialog = false;
      this.editTaskType = {};
    },
    editTaskTypeSubmit(){
      let _this = this;
      console.log(this.editTaskType);
      this.editTaskType.color = this.editTaskType.color.hexa;
      this.axios.post('/task/type/update',qs.stringify(this.editTaskType)).then(rep =>{
        if (200 == rep.code){
          _this.showMsg('success','Update one task type');
          _this.editTaskTypeDialog= false;
        }else{
          _this.showMsg('error','Faild, please try again');
        }
      })
    },
    showDeleteTaskTypeDialog(id){
      this.deleteTaskTypeId = id;
      this.deleteTasktypeDialog = true;
    },
    deleteTaskType(){
      let _this = this;
      this.axios
        .post("/task/type/" + this.deleteTaskTypeId + "/delete")
        .then((rep) => {
          if (200 == rep.code) {
            _this.showMsg("success", "Delete one item");
            _this.deleteTaskTypeId = false;
            _this.tableItems = _this.tableItems.filter(
              (item) => item.id != _this.deleteTaskTypeId
            );
            _this.deleteTaskTypeId = null;
          } else {
            _this.showMsg("error", "Faild, please try again");
          }
        });
    }
  },
};
</script>

<style></style>
