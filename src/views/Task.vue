<template>
  <v-container>
    <v-row>
      <v-expansion-panels accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>Query Params</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col sm="6">
                <v-select
                  v-model="typeSelected"
                  :items="types"
                  label="任务分类"
                  multiple
                  chips
                  persistent-hint
                  item-text="name"
                  item-value="id"
                ></v-select>
              </v-col>
              <v-col sm="6">
                <v-select
                  v-model="personSelected"
                  :items="persons"
                  label="人员"
                  multiple
                  chips
                  persistent-hint
                  item-value="id"
                  item-text="userName"
                ></v-select>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="focus"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="focus"
                  @input="menu2 = false"
                  locale="cn-ZH"
                ></v-date-picker>
              </v-menu>
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-sheet>
        <v-sheet>
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            type="category"
            category-show-all
            interval-minutes="15"
            interval-count="64"
            first-time="06:00"
            locale="CN"
            :category-hide-dynamic="true"
            :categories="personNameSelected"
            :events="eventsToShow"
            :event-color="getEventColor"
            @change="fetchEvents"
            @click:event="showEvent"
          ></v-calendar>
          <task-detail
            :selectedEvent="selectedEvent"
            :selectedOpen.sync="selectedOpen"
            :selectedElement="selectedElement"
          ></task-detail>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TaskDetail from "../components/TaskDetail.vue";
import store from "../store";
export default {
  components: { TaskDetail },
  created() {
    // 获取任务分类
    store.getTaskTypes((types) => {
      this.types = types;
      this.types.forEach((type) => this.typeSelected.push(type.id));
    });
    /**
     * 获取本公司的所有成员
     */
    this.axios.get("/account/user/all").then((rep) => {
      if (200 == rep.code) {
        this.persons = rep.data;
        this.persons.forEach((person) => this.personSelected.push(person.id));
      }
    });
  },
  data: () => ({
    focus: "",
    menu2: false,
    events: [], // 所有的事件
    eventNames: [],
    types: [],
    typeSelected: [],
    persons: [],
    personSelected: [],
    positions: [],
    customers: [],
    selectedEvent: null,
    selectedElement: null,
    selectedOpen: false,
  }),
  computed: {
    eventsToShow() {
      let events = [];
      this.events.forEach((event) => {
        this.typeSelected.forEach((type) => {
          if (event.taskType == type) {
            events.push(event);
          }
        });
      });
      return events;
    },
    personNameSelected() {
      let names = [];
      this.personSelected.forEach((personId) => {
        this.persons.forEach((person) => {
          if (person.id == personId) {
            names.push(person.userName);
          }
        });
      });
      return names;
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
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
    fetchEvents({ start, end }) {
      let events = [];
      this.axios
        .get("/task/all", {
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
                category: task.category,
                taskType: task.taskType
              });
            });
            this.events = events;
          }
        });
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    showEvent({ nativeEvent, event }) {
      var _this = this;
      const open = () => {
        this.selectedElement = nativeEvent.target;
        this.selectedEvent = event;
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
  },
};
</script>

<style>
.task-text-title {
  width: 100px;
  vertical-align: text-bottom;
}
.task-text {
  max-width: 300px;
}
</style>
