import Vue from 'vue';
export default {
	state: {
		currentUser: null,
		taskTypes:[],
		postions:[]
	},

	setCurrentUser(val){
		this.state.currentUser = val
	},
	getCurrentUser(callback){
		let _this = this;
		if (null == this.state.currentUser){
			Vue.axios.get('/auth/currentUser').then(rep => {
				if (200 == rep.code){
					_this.setCurrentUser(rep.data);
					callback(rep.data);
				}else{
					console.error("Get currentUserInfo faild");
				}
			})
		}else{
			callback(this.state.currentUser);
		}
	},

	setTaskTypes(val){
		this.state.taskTypes = val;
	},
	getTaskTypes(callback){
		let _this = this;
		if (this.state.taskTypes.length == 0){
			Vue.axios.get('/task/type/all').then(rep => {
				if (200 == rep.code){
					_this.setTaskTypes(rep.data);
					callback(rep.data);
				}else{
					console.error("Get TaskTypes faild");
				}
			})
		}else{
			callback(this.state.taskTypes);
		}
	},

	setPositions(val){
		this.state.postions = val;
	},
	getPositions(callback){
		let _this = this;
		if (this.state.taskTypes.length == 0){
			Vue.axios.get('/dictionary/subItems/of/City').then(rep => {
				if (200 == rep.code){
					_this.setPositions(rep.data);
					callback(rep.data);
				}else{
					console.error("Get TaskTypes faild");
				}
			})
		}else{
			callback(this.state.postions);
		}
	}
}


