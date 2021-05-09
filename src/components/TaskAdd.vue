<template>
  <v-dialog transition="dialog-top-transition" max-width="600" v-model="isOpen">
    <template v-slot:default>
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar flat>
          <v-btn icon>
            <v-icon>mdi-note-multiple</v-icon>
          </v-btn>
          <v-toolbar-title>Add Task</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text style="height: 500px; overflow-y: scroll">
          <v-container>
            <v-row>
              <v-col>
                <v-card color="grey lighten-4" class="pa-4" flat>
                  <v-form ref="form">
                    <v-select
                      v-model="task.taskType"
                      label="日程类型"
                      no-data-text="没有可用选项"
                      :items="types"
                      item-value="id"
                      item-text="name"
                      outlined
                    ></v-select>
                    <v-text-field
                      v-model="task.name"
                      label="日程名称"
                      loader-height="2"
                      outlined
                      type="text"
                    ></v-text-field>
                    <v-textarea
                      v-model="task.detail"
                      label="日程内容"
                      loader-height="2"
                      outlined
                      row-height="24"
                      rows="2"
                      type="text"
                    ></v-textarea>
                    <v-select
                      v-model="task.position"
                      label="办理位置"
                      no-data-text="没有可用选项"
                      outlined
                      :items="positions"
                      item-value="id"
                      item-text="name"
                    ></v-select>
                    <v-switch
                      v-model="task.allDay"
                      label="Allday Task"
                    ></v-switch>
                    <v-row>
                      <v-col cols="12" md="6">
                        <date-picker
                          lable="开始日期"
                          :value.sync="local_startDate"
                        ></date-picker>
                      </v-col>
                      <v-col cols="12" md="6" v-show="!task.allDay">
                        <time-picker
                          lable="开始时间"
                          :value.sync="local_startTime"
                        ></time-picker>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6">
                        <date-picker
                          lable="结束日期"
                          :value.sync="local_endDate"
                        ></date-picker>
                      </v-col>
                      <v-col cols="12" md="6" v-show="!task.allDay">
                        <time-picker
                          lable="结束时间"
                          :value.sync="local_endTime"
                        ></time-picker>
                      </v-col>
                    </v-row>
                    <span class="subtitle-2">办理人：</span>
                    <AccountSelecotr
                      :selectedAccounts.sync="executors"
                      :isOpen.sync="executorsSelectorDialog"
                    ></AccountSelecotr>
                    <v-sheet
                      rounded
                      outlined
                      min-height="56"
                      class="mb-8 mt-4 pb-2"
                    >
                      <div class="d-flex flex-wrap">
                        <user-chip
                          v-for="executor in executors"
                          :key="executor.id"
                          :user="executor"
                        ></user-chip>
                      </div>
                      <v-btn
                        @click="
                          executorsSelectorDialog = !executorsSelectorDialog
                        "
                        small
                        class="ml-2"
                        >选择</v-btn
                      >
                    </v-sheet>
                    <span class="subtitle-2">客户窗口:</span>
                   
                    <AccountSelecotr
                      :isOpen.sync="customersSelectorDialog"
                      :selectedAccounts.sync="customers"
                    ></AccountSelecotr>
                    <v-sheet
                      rounded
                      outlined
                      min-height="56"
                      class="mb-8 mt-4 pb-2"
                    >
                      <div class="d-flex flex-wrap">
                        <user-chip
                          v-for="customer in customers"
                          :key="customer.id"
                          :user="customer"
                        ></user-chip>
                      </div>
                      <v-btn
                        @click="
                          customersSelectorDialog = !customersSelectorDialog
                        "
                        small
                        class="ml-2"
                        >选择</v-btn
                      >
                    </v-sheet>
                    <v-textarea
                      v-model="task.remark"
                      label="备注"
                      loader-height="2"
                      outlined
                      row-height="24"
                      rows="2"
                      type="text"
                    ></v-textarea>
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
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import DatePicker from "./DatePicker.vue";
import TimePicker from "./TimePicker.vue";
import AccountSelecotr from "./AccountSelector.vue";
import UserChip from "./UserChip.vue";
import qs from "qs";
import {store} from "../store";
export default {
  components: { DatePicker, TimePicker, AccountSelecotr, UserChip },
  props: ["isShow", "startDate", "startTime", "endDate", "endTime"],
  created() {
    let _this = this;
    /**
     * 获取作业类型列表
     */
    this.axios.get("/task/type/all").then((rep) => {
      if (200 == rep.code) {
        _this.types = rep.data;
      }
    });
    /**
     * 获取作业地点列表
     */
    this.axios.get("/dictionary/subItems/of/City").then((rep) => {
      if (200 == rep.code) {
        _this.positions = rep.data;
      }
    });
    this.executors.push({
      id:store.state.currentUser.id,
      userName:store.state.currentUser.userName,
      avatar:store.state.currentUser.avatar,
      companyId:store.state.currentUser.companyId,
      deptId:store.state.currentUser.deptId
    })
  },
  computed: {
    isOpen: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit("update:isShow", val);
      },
    },
    local_startDate: {
      get() {
        return this.startDate;
      },
      set(val) {
        this.$emit("update:startDate", val);
      },
    },
    local_startTime: {
      get() {
        return this.startTime;
      },
      set(val) {
        this.$emit("update:startTime", val);
      },
    },
    local_endDate: {
      get() {
        return this.endDate;
      },
      set(val) {
        this.$emit("update:endDate", val);
      },
    },
    local_endTime: {
      get() {
        return this.endTime;
      },
      set(val) {
        this.$emit("update:endTime", val);
      },
    },
    defaultAccount(){
      return {
          id: this.currentUser.id,
          userName: this.currentUser.userName,
          companyId: this.currentUser.companyId,
          deptId: this.currentUser.deptId,
          avatar: this.currentUser.avatar,
          selected: true,
        };
    }
  },
  data: () => ({
    task: {
      taskType: "",
      allDay: false,
      name: "",
      detail: "",
      position: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      remark: "",
      executors: [],
      customers: [],
    },
    types: [],
    positions: [],
    currentUser: store.state.currentUser,
    
    executorsSelectorDialog: false,
    customersSelectorDialog: false,
    executors: [],
    customers: [],
  }),
  methods: {
    submit() {
      let _this = this;

      this.task.customers = [];
      this.customers.forEach((customer) => {
        this.task.customers.push(customer.id);
      });

      this.task.executors = [];
      this.executors.forEach((executor) => {
        this.task.executors.push(executor.id);
      });

      this.task.startDate = this.local_startDate;
      this.task.endDate = this.local_endDate;
      if (!this.task.allDay) {
        this.task.startTime = this.local_startTime;
        this.task.endTime = this.local_endTime;
      }
      this.axios.post("/task/add", qs.stringify(this.task)).then((rep) => {
        if (200 == rep.code) {
          _this.$emit("success", rep);
          _this.task = {
            taskType: "",
            allDay: false,
            name: "",
            detail: "",
            position: "",
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            remark: "",
            executors: [],
            customers: [],
          };
          _this.customers = [];
          _this.executors = [_this.currentUser];
        } else {
          _this.$emit("error", rep);
        }
      });
    },
    close() {
      this.task = {
        taskType: "",
        allDay: false,
        name: "",
        detail: "",
        position: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        remark: "",
        executors: [],
        customers: [],
      };
      this.customers = [];
      this.executors = [this.currentUser];
      this.isOpen = false;
    },
    
  },
};
</script>
