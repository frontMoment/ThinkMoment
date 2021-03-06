/**
 * Created by Moment on 16/6/14.
 */
'use strict';

import Base from './base.js';
import Pusher from 'pusher';
import _ from 'underscore';
import lodash from 'lodash';

export default class extends Base {
    /**
     * init
     * @param  {Object} http []
     * @return {}      []
     */
    async init(http){
        super.init(http);
        this.messagePusher = new Pusher(this.config("pusher"));
        this.adminUser = await this.getAdminUserInfo();
    }
    showAction(){
        return this.display();
    }
    showbakAction(){
        return this.display();
    }

    /**
     * 获取聊天的用户列表
     * @returns {*}
     */
    async usersAction(){
        let loginUser = await this.session("userInfo");
        let [fields,userList,totalUserList] = ["id,name,avatar,motto,position,isAdmin",{},{}];
        totalUserList = await this.model("user").field(fields).select();
        if(loginUser.isAdmin){
            userList = _.where(totalUserList,{isAdmin:0});
            loginUser = _.findWhere(totalUserList,{isAdmin:1});
        }else{
            userList = _.where(totalUserList,{isAdmin:1});
            loginUser = _.findWhere(totalUserList,{id:loginUser.userId});
        }
        return this.success({
            userList:userList,
            loginUser:loginUser
        });
    }

    /**
     * 根据某个用户id获取聊天列表,支持分页
     * @returns {*}
     */
    async listAction(){
        let loginUser = await this.session("userInfo");
        let userId = this.get("userId");
        if(!loginUser.isAdmin){
            // 非管理员登录用户只获取与管理员的对话列表
            userId = loginUser.userId;
        }
        let pageSize = this.get("pageSize");
        if(think.isEmpty(pageSize)){
            pageSize = 10;
        }
        let options = {
            relationId:userId
        }
        let fromChatId = this.get("fromChatId");
        if(!think.isEmpty(fromChatId)){
            options.chatId = {"<": fromChatId};
        }
        // userId即聊天的relationId
        // let query =`select * from moment_chat where relationId = ${userId} and chatId < ${fromChatId} order by chatId desc limit 0,${pageSize}`;
        let chatList = await this.model("chat").where(options).page(1,pageSize).order("chatId DESC").countSelect();
        chatList.data = lodash.reverse(chatList.data);
        return this.success(chatList);
    }

    /**
     * 发送消息action
     */
    async sendAction(){
        let params = this.post();
        // 保存消息
        think.extend(params,{
            status:0,
            create_time:new Date().getTime(),
            update_time:new Date().getTime()
        });
        params.relationId = parseInt(params.relationId);
        params.speakerId = parseInt(params.speakerId);
        params.audienceId = parseInt(params.audienceId);
        // 虚拟chat id ,用于前端网络慢的时候菊花转,提升前端性能
        // params.virtualChatId = parseInt(params.virtualChatId);
        
        let chatId = await this.model("chat").add(params);
        if(think.isEmpty(chatId)){
            this.fail("MESSAGE_SEND_FAIL");
            return;
        }
        this.pushMessage(params);
        this.success({
            result:true,
            chatId:chatId,
            message:"发送消息成功!"
        });
    }

    /**
     * 推送消息(每次发送一条消息,推送给管理员和当前关系人)
     * @param msg 消息
     */
    pushMessage(params){
        if(!params.relationId){
            return;
        }
        const pushEvent = 'moment-push';
        // 设计userId为relationId
        this.messagePusher.trigger(this.adminUser.id.toString(), pushEvent, params);
        this.messagePusher.trigger(params.relationId.toString(), pushEvent, params);
    }

    /**
     * 获取管理员信息
     * @returns {*}
     */
    async getAdminUserInfo(){
        let fields = "id,name,avatar,motto,position,isAdmin";
        let adminUser = await this.model("user").field(fields).where({id:100000}).find();
        return adminUser;
    }
    // async addmsgAction(){
    //     let msg = {
    //         // chatId:"",
    //         relationId:500002,
    //         speakerId:100000,
    //         audienceId:100003,
    //         message:"if you recieve this message , reply me",
    //         status:0,
    //         create_time:new Date().getTime(),
    //         update_time:new Date().getTime()
    //     };
    //     let chatId = await this.model("chat").add(msg);
    //     this.success({chatId:chatId});
    // }
    async deleteAction(){
        let chatId = this.get("chatId");
        if(think.isEmpty(chatId)){
            return this.fail({'msg':'Must provide chatId'});
        }
        let affectedRows = await this.model("chat").where({chatId:chatId}).delete();
        let data = {
            message:"没有此ID!",
            affectedRows:affectedRows
        };
        if(affectedRows > 0){
            data = {
                message:"删除成功!",
                affectedRows:affectedRows
            };
        }
        return this.success(data);
    }
}