/**
 * Created by Moment on 16/5/28.
 */
require("./message.less");
var moduleTpl = require("./messageTpl.html");
// 基础vue
var BaseVue = require("BaseVue");

module.exports = BaseVue.extend({
    template: moduleTpl,
    props: ['session', 'user', 'userList','params'],
    computed: {
        sessionUser:function() {
            var self = this;
            var users = this.userList.filter(function (item) {
                return item.id === self.session.userId;
            });
            return users[0];
        }
    },
    data:function () {
        return {
            scrollFlag:true,
            scrollTopDistance:20
        }
    },
    events:{
        /**
         * 监听seesionIndex变化(也可以通过watch监听)
         * @constructor
         */
        'SessionIndexChanged':function () {
            this.scrollFlag = true;
        }
    },
    methods:{
        onScroll:function (e) {
            if(e.target.scrollTop < this.scrollTopDistance && this.scrollFlag){
                this.scrollFlag = false;
                var self = this;
                var reqParams = {
                    userId:this.session.id,
                    pageSize:this.params.pageSize
                };
                if(this.session.messages && this.session.messages[0]){
                    reqParams.fromChatId = this.session.messages[0].chatId;
                }
                $.ajax({
                    url:'/business/chat/list',
                    type:"GET",
                    data:reqParams,
                    success:function (res) {
                        if(_.size(res.data.data) > 0){
                            self.$dispatch('ScrollEventLoadMessage',res.data);
                            self.scrollFlag = true;
                        }
                    }
                });
            }
        }
    },
    filters: {
        // 筛选出用户头像
        avatar:function(item) {
            if(item.speakerId == this.user.id){
                return this.user.avatar;
            }else{
                var user = _.findWhere(this.userList,{id:item.speakerId.toString()});
                if(!user){
                    return "/static/build/images/defaultUser.jpeg";
                }
                return user.avatar;
            }
        }
    },
    directives: {
        // 发送消息后滚动到底部
        'scroll-bottom':function() {
            var self = this;
            Vue.nextTick(function () {
                self.el.scrollTop = self.el.scrollHeight - self.el.clientHeight;
            });
        }
    }
});