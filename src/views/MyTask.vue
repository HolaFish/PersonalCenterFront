<template>
  <v-row class="fill-height" no-gutters>
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet class="fill-height">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          locale="CN"
          interval-minutes="15"
          interval-count="64"
          first-time="06:00"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
          @click:time="addEvent($event)"
        >
          <template v-slot:day-body="{ date, week }">
            <div
              class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            ></div>
          </template>
          <template v-slot:interval>
            <div class="interval"></div>
          </template>
        </v-calendar>

        <task-detail
          :selectedEvent="selectedEvent"
          :selectedOpen.sync="selectedOpen"
          :selectedElement="selectedElement"
        ></task-detail>

        <task-add
          :isShow.sync="dialog"
          :startDate.sync="initDate.startDate"
          :endDate.sync="initDate.endDate"
          :startTime.sync="initDate.startTime"
          :endTime.sync="initDate.endTime"
          @success="addTaskSuccess"
        ></task-add>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import TaskDetail from "../components/TaskDetail.vue";
import TaskAdd from "../components/TaskAdd.vue";
export default {
  components: { TaskDetail, TaskAdd },
  data: () => ({
    focus: "",
    type: "week",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    initDate: {
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
    },
    dialog: false,
    ready: false,
  }),
  computed: {
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
  },
  methods: {
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);

      this.cal.scrollToTime(first);
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];
      let _this = this;
      this.axios
        .get("/task/myTask", {
          params: {
            startDate: start.date,
            endDate: end.date,
          },
        })
        .then((rep) => {
          if (200 == rep.code) {
            rep.data.forEach((task) => {
              let start = null;
              let end = null;
              if (task.allDay) {
                start = new Date(`${task.startDate} 00:00:00`);
                end = new Date(`${task.endDate} 23:59:59`);
              } else {
                start = new Date(`${task.startDate} ${task.startTime}`);
                end = new Date(`${task.endDate} ${task.endTime}`);
              }
              events.push({
                id: task.id,
                name: task.name,
                start: start,
                end: end,
                startDate: task.startDate,
                startTime: task.startTime,
                endDate: task.endDate,
                endTime: task.endTime,
                color: task.color,
                timed: !task.allDay,
              });
            });
            _this.events = events;
          }
        });
    },
    addEvent(data) {
      let startDate = new Date(data.date + "T" + data.time);
      let endDate = new Date(startDate.getTime() + 1000 * 60 * 15); // 15分钟间隔
      this.initDate.startDate = startDate
        .toLocaleDateString()
        .replaceAll("/", "-");
      this.initDate.startTime = startDate.toLocaleTimeString("it-IT");
      this.initDate.endDate = endDate.toLocaleDateString().replaceAll("/", "-");
      this.initDate.endTime = endDate.toLocaleTimeString("it-IT");
      this.dialog = true;
    },
    addTaskSuccess(rep) {
      let task = rep.data;
      let start = null;
      let end = null;
      if (task.allDay) {
        start = new Date(`${task.startDate} 00:00:00`);
        end = new Date(`${task.endDate} 23:59:59`);
      } else {
        start = new Date(`${task.startDate} ${task.startTime}`);
        end = new Date(`${task.endDate} ${task.endTime}`);
      }
      let event = {
        id: task.id,
        name: task.name,
        start: start,
        end: end,
        startDate: task.startDate,
        startTime: task.startTime,
        endDate: task.endDate,
        endTime: task.endTime,
        color: task.color,
        timed: !task.allDay,
      };

      this.events.push(event);
      console.log(this.events);
      this.dialog = false;
    },
  },
};
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
.interval{
  width:100%;
  height: 100%;
}
.interval:hover{
  background-color: bisque;
}
</style>