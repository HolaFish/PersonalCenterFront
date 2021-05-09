<template>
  <v-card
    color="grey lighten-4"
    style="overflow-y:auto"
    min-width="300"
    max-height="500"
    flat
    v-if="null != eventDetail"
  >
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
          disabled
        ></v-select>
        <v-text-field
          outlined
          label="日程名称"
          placeholder="Placeholder"
          v-model="eventDetail.name"
          disabled
        ></v-text-field>
        <v-textarea
          outlined
          label="日程内容"
          disabled
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
          disabled
        ></v-select>
        <v-switch
          disabled
          v-model="eventDetail.allDay"
          label="Allday Task"
        ></v-switch>
        <v-text-field
          outlined
          label="开始时间"
          v-model="taskStartTime"
          disabled
        ></v-text-field>
        <v-text-field
          outlined
          label="结束时间"
          v-model="taskEndTime"
          disabled
        ></v-text-field>

        <span class="subtitle-2">创建人：</span>
        <v-sheet rounded outlined min-height="56" class="mb-8">
          <user-chip :user="eventDetail.createdBy"></user-chip>
        </v-sheet>

        <span class="subtitle-2">办理人：</span>
        <v-sheet
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
        <span class="subtitle-2">客户窗口：</span>
        <v-sheet
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
        <v-textarea
          outlined
          label="备注"
          disabled
          v-model="eventDetail.remark"
        ></v-textarea>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import UserChip from './UserChip';
import {store} from '../store';
export default {
  components:{UserChip},
  props: ["event"],
  created(){
    this.axios.get(`/task/get/${this.event.id}`).then(rep => {
        if (200 == rep.code){
          this.eventDetail = rep.data;
        }
      })
    store.getTaskTypes(types => this.types = types);
    store.getPositions(positions => this.positions = positions);
  },
  data(){
    return {
      types:[],
      postions:[],
      eventDetail:null
    }
  },
  computed:{
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
  }
};
</script>

<style></style>
