<template>
  <v-dialog
    transition="dialog-top-transition"
    max-width="500"
    v-model="isOpen"
    scrollable
  >
    <template v-slot:default>
      <v-card
        color="grey lighten-4"
        min-width="350px"
        max-height="400"
        flat
        v-if="null != eventDetail"
      >
        <v-toolbar :color="eventDetail.color" dark>
          <v-btn icon>
            <v-icon>mdi-note-multiple</v-icon>
          </v-btn>
          <v-toolbar-title v-html="eventDetail.name"></v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-select
              v-model="eventDetail.taskType"
              label="日程类型"
              no-data-text="没有可用选项"
              :items="types"
              item-value="id"
              item-text="name"
              outlined
              :disabled="!editable"
            ></v-select>
            <v-text-field
              outlined
              label="日程名称"
              placeholder="Placeholder"
              v-model="eventDetail.name"
              :disabled="!editable"
            ></v-text-field>
            <v-textarea
              outlined
              label="日程内容"
              :disabled="!editable"
              v-model="eventDetail.detail"
            ></v-textarea>
            <v-select
              v-model="eventDetail.position"
              label="办理位置"
              no-data-text="没有可用选项"
              outlined
              :items="positions"
              item-value="id"
              item-text="name"
              :disabled="!editable"
            ></v-select>
            <v-switch
              :disabled="!editable"
              v-model="eventDetail.allDay"
              label="Allday Task"
            ></v-switch>
            <v-text-field
              v-show="!editable"
              outlined
              label="开始时间"
              v-model="taskStartTime"
              disabled
            ></v-text-field>
            <v-text-field
              v-show="!editable"
              outlined
              label="结束时间"
              v-model="taskEndTime"
              disabled
            ></v-text-field>

            <v-row v-show="editable">
              <v-col cols="12" md="6">
                <date-picker
                  lable="开始日期"
                  :value.sync="eventDetail.startDate"
                ></date-picker>
              </v-col>
              <v-col cols="12" md="6" v-show="!eventDetail.allDay">
                <time-picker
                  lable="开始时间"
                  :value.sync="eventDetail.startTime"
                ></time-picker>
              </v-col>
            </v-row>
            <v-row v-show="editable">
              <v-col cols="12" md="6">
                <date-picker
                  lable="结束日期"
                  :value.sync="eventDetail.endDate"
                ></date-picker>
              </v-col>
              <v-col cols="12" md="6" v-show="!eventDetail.allDay">
                <time-picker
                  lable="结束时间"
                  :value.sync="eventDetail.endTime"
                ></time-picker>
              </v-col>
            </v-row>
            <span class="subtitle-2">创建人：</span>
            <v-sheet rounded outlined min-height="56" class="mb-8">
              <user-chip :user="eventDetail.createdBy"></user-chip>
            </v-sheet>

            <span class="subtitle-2">办理人：</span>
            <v-sheet
              v-show="!editable"
              rounded
              outlined
              min-height="56"
              class="mb-8"
            >
              <div class="d-flex flex-wrap">
                <user-chip
                  v-for="executor in eventDetail.executors"
                  :key="executor.id"
                  :user="executor"
                ></user-chip>
              </div>
            </v-sheet>
            <!-- 办理人修改框 -->
            <AccountSelecotr
              :isOpen.sync="executorsSelectorDialog"
              :selectedAccounts.sync="eventDetail.executors"
            ></AccountSelecotr>
            <v-sheet
              v-show="editable"
              rounded
              outlined
              min-height="56"
              class="mb-8 mt-4 pb-2"
            >
              <div class="d-flex flex-wrap">
                <user-chip
                  v-for="executor in eventDetail.executors"
                  :key="executor.id"
                  :user="executor"
                ></user-chip>
              </div>
              <v-btn
                @click="executorsSelectorDialog = !executorsSelectorDialog"
                small
                class="ml-2"
                >选择</v-btn
              >
            </v-sheet>

            <span class="subtitle-2">客户窗口：</span>
            <v-sheet
              v-show="!editable"
              rounded
              outlined
              min-height="56"
              class="mb-8"
            >
              <div class="d-flex flex-wrap">
                <user-chip
                  v-for="customer in eventDetail.customers"
                  :key="customer.id"
                  :user="customer"
                ></user-chip>
              </div>
            </v-sheet>
            <!-- 客户窗口修改框 -->
            <AccountSelecotr
              :isOpen.sync="customersSelectorDialog"
              :selectedAccounts.sync="eventDetail.customers"
            ></AccountSelecotr>
            <v-sheet
              v-show="editable"
              rounded
              outlined
              min-height="56"
              class="mb-8 mt-4 pb-2"
            >
              <div class="d-flex flex-wrap">
                <user-chip
                  v-for="customer in eventDetail.customers"
                  :key="customer.id"
                  :user="customer"
                ></user-chip>
              </div>
              <v-btn
                @click="customersSelectorDialog = !customersSelectorDialog"
                small
                class="ml-2"
                >选择</v-btn
              >
            </v-sheet>
            <v-textarea
              outlined
              label="备注"
              :disabled="!editable"
              v-model="eventDetail.remark"
            ></v-textarea>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-switch
            v-model="editable"
            label="Editable"
            color="red"
            value="red"
            class="mr-auto"
          ></v-switch>
          <v-btn-toggle>
            <v-btn v-show="editable" color="primary" @click="updateTask">
              Update
            </v-btn>
            <v-btn
              v-show="editable"
              color="red"
              @click="dialog_ask_delete_task = true"
            >
              Delete
            </v-btn>
            <v-btn color="secondary" @click="isOpen = false">
              Close
            </v-btn>
          </v-btn-toggle>
        </v-card-actions>
      </v-card>
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
        :isOpen.sync="dialog_ask_delete_task"
        msg="Are you sure to delete this task？"
        @agree="deleteTask"
      ></ask-dialog>
    </template>
  </v-dialog>
</template>
<script>
import UserChip from "./UserChip.vue";
import AccountSelecotr from "./AccountSelector.vue";
import DatePicker from "./DatePicker.vue";
import TimePicker from "./TimePicker.vue";
import AskDialog from "./AskDialog";
import qs from "qs";
export default {
  components: { UserChip, AccountSelecotr, DatePicker, TimePicker, AskDialog },
  props: ["selectedEvent", "selectedOpen", "selectedElement"],
  created() {
    let _this = this;

    this.axios.get("/task/type/all").then((rep) => {
      if (200 == rep.code) {
        _this.types = rep.data;
      }
    });
    this.axios.get("/dictionary/subItems/of/City").then((rep) => {
      if (200 == rep.code) {
        _this.positions = rep.data;
      }
    });
  },
  data: () => {
    return {
      eventDetail: null,
      editable: false,
      positions: [],
      types: [],
      executorsSelectorDialog: false,
      customersSelectorDialog: false,
      dialog_ask_delete_task: false,
      snackbar: {
        value: false,
        type: "success",
        msg: "",
      },
    };
  },
  computed: {
    isOpen: {
      get() {
        return this.selectedOpen;
      },
      set(val) {
        this.$emit("update:selectedOpen", val);
      },
    },
    taskStartTime() {
      if (this.eventDetail != null && this.eventDetail.allDay) {
        return `${this.eventDetail.startDate} 00::00:00`;
      } else {
        return `${this.eventDetail.startDate} ${this.eventDetail.startTime}`;
      }
    },
    taskEndTime() {
      if (this.eventDetail != null && this.eventDetail.allDay) {
        return `${this.eventDetail.endDate} 23::59:59`;
      } else {
        return `${this.eventDetail.endDate} ${this.eventDetail.endTime}`;
      }
    },
  },
  watch: {
    selectedEvent(newVal, oldVal) {
      let _this = this;
      if (null != newVal) {
        this.axios.get(`/task/get/${newVal.id}`).then((rep) => {
          if (200 == rep.code) {
            _this.eventDetail = rep.data;
          }
        });
      }
    },
  },
  methods: {
    showMsg(type, msg) {
      this.snackbar.value = true;
      this.snackbar.type = type;
      this.snackbar.msg = msg;
    },

    updateTask() {
      let _this = this;
      let executors = [];
      this.eventDetail.executors.forEach((executor) => {
        executors.push(executor.id);
      });
      this.eventDetail.executors = executors;
      let customers = [];
      this.eventDetail.customers.forEach((customer) => {
        customers.push(customer.id);
      });
      this.eventDetail.customers = customers;
      this.eventDetail.createdBy = this.eventDetail.createdBy.id;
      this.axios
        .post("/task/update", qs.stringify(this.eventDetail))
        .then((rep) => {
          if (200 == rep.code) {
            _this.showMsg("success", "Update one task");
            _this.eventDetail = rep.data;
            _this.editable = false;
            _this.$emit("update", rep);
          } else {
            _this.showMsg("error", "Faild,please try again");
          }
        });
    },
    deleteTask() {
      let _this = this;
      this.axios.post(`/task/${this.eventDetail.id}/delete`).then((rep) => {
        if (200 == rep.code) {
          _this.showMsg("success", "Delete one task");
          _this.editable = false;
          _this.$emit("delete", rep);
        } else {
          _this.showMsg("error", "Faild,please try again");
        }
      });
    },
  },
};
</script>

<style></style>
