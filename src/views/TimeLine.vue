<template>
  <v-card class="fill-height">
    <v-row class="pa-4 fill-height" justify="space-between">
      <v-col md="3">
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
                <v-img
                  v-if="null != item.avatar"
                  :src="item.avatar"
                  width="36"
                  height="36"
                ></v-img>
                <v-icon v-else>mdi-account</v-icon>
              </div>
              <v-icon v-else>{{ item.avatar }}</v-icon>
            </v-avatar>
          </template>
        </v-treeview>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col md="9">
        <v-scroll-y-transition mode="out-in">
          <div
            v-if="!selected"
            class="title grey--text text--lighten-1 font-weight-light"
          >
            Select a User
          </div>
          <div v-else>
            <v-row>
              <v-expansion-panels accordion>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    >Query Params</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col sm="6">
                        <date-picker
                          lable="StartDate"
                          :value.sync="startDate"
                        ></date-picker>
                      </v-col>
                      <v-col sm="6">
                        <date-picker
                          lable="endDate"
                          :value.sync="endDate"
                        ></date-picker>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-row>
            <v-row class="pb-2">
              <v-card flat class="mx-auto">
                <v-card-text>
                  <v-timeline>
                    <v-slide-x-reverse-transition group hide-on-leave>
                      <v-timeline-item
                        v-for="event in events"
                        :key="event.id"
                        :color="event.color"
                        right
                      >
                        <template v-slot:opposite>
                          <span
                            >{{ event.start.toLocaleDateString() }}
                            {{ event.start.toLocaleTimeString() }}
                            至
                            {{ event.end.toLocaleDateString() }}
                            {{ event.end.toLocaleTimeString() }}
                          </span>
                        </template>
                        <v-expansion-panels>
                          <v-expansion-panel>
                            <v-expansion-panel-header>
                              {{ event.name }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <task-detail-card
                                :event="event"
                              ></task-detail-card>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </v-timeline-item>
                    </v-slide-x-reverse-transition>
                  </v-timeline>
                </v-card-text>
              </v-card>
            </v-row>
            <!-- 无问题 -->
          </div>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import TaskDetailCard from "../components/TaskDetailCard.vue";
import DatePicker from "../components/DatePicker";
export default {
  components: { TaskDetailCard, DatePicker },
  created() {
    let date = new Date();
    date.setDate(date.getDate() - date.getDay() + 1);
    this.startDate = new Date(date).toLocaleDateString().replaceAll("/", "-");
    date.setDate(date.getDate() + 6);
    this.endDate = new Date(date).toLocaleDateString().replaceAll("/", "-");
    console.log(this.startDate, this.endDate);
  },
  data: () => ({
    active: [],
    open: [],
    colors: [],
    types: [],
    eventNames: [],
    persons: [],
    positions: [],
    users: [],
    companies: [],
    interval: null,
    events: [],
    nonce: 2,
    startDate: null,
    endDate: null,
  }),
  computed: {
    items() {
      return [
        {
          id: 0,
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
      this.fetchEvents(user);
      return user;
    },
  },
  methods: {
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    async fetchUsers(item) {
      switch (item.type) {
        case "root":
          return this.axios.get("/account/companies").then((rep) => {
            if (null == rep.data || rep.data.length == 0) {
              this.showMsg("warning", "No data");
            } else {
              rep.data.forEach((company) => {
                company.type = "company";
                company.key = `company_${company.id}`;
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
                this.showMsg("warning", "No data");
              } else {
                rep.data.forEach((dept) => {
                  dept.type = "department";
                  dept.key = `dept_${dept.id}`;
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
          this.axios
            .get("/account/department/" + item.id + "/subDepts")
            .then((rep) => {
              // 加载子部门
              if (200 == rep.code) {
                rep.data.forEach((dept) => {
                  dept.type = "department";
                  dept.key = `dept_${dept.id}`
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
              this.axios.get("/account/user/of/" + item.id).then((rep) => {
                if (200 == rep.code) {
                  rep.data.forEach((user) => {
                    user.type = "user";
                    user.key = `user_${user.id}`;
                    user.name = user.userName;
                    user.company = {
                      id: item.company.id,
                      name: item.company.name,
                    };
                    user.dept = {
                      id: item.id,
                      name: item.name,
                    };
                    let positionName = "";
                    this.positions.forEach((p) => {
                      if (p.id == user.position) {
                        positionName = p.name;
                      }
                    });
                    user.positionName = positionName;
                  });
                  item.children.push(...rep.data);
                  this.users = rep.data;
                }
              });
            });
      }
    },
    fetchEvents(user) {
      let events = [];
      this.axios
        .get(`/task/of/${user.id}`, {
          params: {
            startDate: this.startDate,
            endDate: this.endDate,
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
                taskType: task.taskType,
              });
            });
          }
          events.sort((a, b) => b.start.getDate() - a.start.getDate());
          this.events = events;
        });
    },
  },
};
</script>
<style></style>
