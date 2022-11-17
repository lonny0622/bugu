"use strict";var e=require("../../../common/vendor.js"),t=require("../../../utils/dateUtils.js"),s=require("../../../common/storageFunctions.js"),o=require("../../../utils/messageUtils/storage.js"),i=require("../../../common/requestFunctions.js"),a=require("../../../common/constants.js"),n=require("../../../utils/request.js"),r=require("../../../utils/messageUtils/storageKeys.js"),c=require("../../../store/index.js"),h=require("../../../utils/aes/export.js"),d=require("../../../common/globalMsgKeys.js"),m=require("../../../utils/tabBarBadgeUtils.js");require("../../../common/storageKeys.js"),require("../../../store/modules/messageStore.js"),require("../../../store/modules/socketStateStore.js"),require("../../../utils/messageUtils/index.js"),require("../../../utils/messageUtils/service.js");const u={data:()=>({sendText:"",inputFocus:!1,onLineState:!1,fromUserInfo:{},myUserInfo:{},messageGroup:{},keyboardHeight:0,emojiContentHeight:300,showEmojiPicker:!1,expressionTabPage:0,isRecording:!1,sendVoice:!1,scrollInto:"",state:c.store.state,GettimeifferenceOfNow:t.GettimeifferenceOfNow,navHeight:0,contentHeight:0,recorderManager:e.index.getRecorderManager(),touchY:0,cancelSendVoice:!1,showSendVoiceToast:!1,voiceFile:{},voiceTime:0,stopTimer:!1,selectChatItem:{},isIOS:!1}),onReady(){let t=this;e.index.getSystemInfo({success(e){t.contentHeight=e.windowHeight,t.isIOS=-1!=e.system.indexOf("iOS")}}),e.index.createSelectorQuery().select("#chat-scrollview").boundingClientRect((e=>{t.navHeight=e.top})).exec()},onShow(){let t=this;e.index.$once(d.REFRESH_CHAT_CONTENT,(async function(e){if(e.needRefresh){t.$refs.customExpression.refresh();let e=await o.getChatRecord(t.myUserInfo.id,t.fromUserInfo.id);t.messageGroup=e;let s=t.messageGroup.messages;s.length>0&&(t.scrollInto=`chat_${s[s.length-1].id}`)}}))},async onLoad(t){this.initRecorderAndKeyboardManager(),e.index.showLoading({title:"加载中"});let a=t.fromUserId,n=await s.getMyUserInfo();if(!a||!n)return;this.myUserInfo=n;let r=await o.getChatRecord(n.id,a);this.messageGroup=r;let c=this.messageGroup.messages,h=c.length;if(e.index.hideLoading(),this.onLineState=await i.GetonlineState(a),this.fromUserInfo=await i.getUserinfo(a),h>0&&(this.scrollInto=`chat_${c[h-1].id}`,this.setMessageListUnReadSum(n.id,a),c[h-1].isMe&&c[h-1].isNotRead)){if(!(await this.getIsBeenRead([c[h-1].id]))[0].unread)for(let e=h-1;e>=0&&(c[e].isMe&&c[e].isNotRead);e--)c[e].isNotRead=!1}this.messageGroup.messages=await this.messageDataProcessing(c,a),this.messageGroup.messages.length>0&&(this.scrollInto=`chat_${c[c.length-1].id}`),this.saveNewestMessageGroup()},computed:{fromUsername(){return this.fromUserInfo.username?this.fromUserInfo.username.length>7?this.fromUserInfo.username.slice(0,7)+"...":this.fromUserInfo.username:""},newMessage(){return this.state.messageStore.newMessage},scollerHeight(){let e=this.showEmojiPicker?this.emojiContentHeight:this.keyboardHeight;return this.contentHeight-e-this.navHeight-110}},watch:{newMessage:async function(e){if(e.type===a.WITHDRAW){if(e.data.userId==this.fromUserInfo.id&&this.messageGroup){let t=this.messageGroup.messages;for(let s=t.length-1;s>=0;s--)if(t[s].id==e.data.messageId){t[s]={content:"对方撤回了一条消息",type:-1,id:e.data.messageId,createTime:t[s].createTime,isMe:!1};break}this.messageGroup.messages=t,this.scrollInto=`chat_${t[t.length-1].id}`}}else if(e.type===a.USER_MESSAGE){if(e.data.fromUserId==this.fromUserInfo.id&&(this.getUnReadMessage(this.fromUserInfo.id),this.messageGroup)){let s=this.messageGroup.messages;s.push({content:e.data.content,type:e.data.type,id:e.data.id,isMe:!1,createTime:t.getTime(),time:e.data.time}),this.messageGroup.messages=s,this.scrollInto=`chat_${s[s.length-1].id}`}}else if(e.type===a.ALREADY_READ&&e.data.userId==this.fromUserInfo.id&&this.messageGroup){let e=this.messageGroup.messages;for(let t=e.length-1;t>=0&&(e[t].isMe&&e[t].isNotRead);t--)e[t].isNotRead=!1;this.messageGroup.messages=e}this.saveNewestUserMessage()}},methods:{initRecorderAndKeyboardManager(){e.index.onKeyboardHeightChange((async e=>{0!=e.height?(this.keyboardHeight=e.height,this.emojiContentHeight=e.height,this.showEmojiPicker=!1,this.scrollInto="show_keyboard"):(this.keyboardHeight=0,this.scrollInto="")})),this.recorderManager.onStop((async t=>{if(clearInterval(),this.cancelSendVoice);else{let s=Math.floor(t.duration/1e3);s<1?e.index.showToast({title:"时间过短",icon:"none"}):this.uploadImageOrVoice([t.tempFilePath],2,s)}this.touchY=0,this.cancelSendVoice=!1,this.voiceTime=0,this.$refs.recordingPopup.close()})),this.recorderManager.onFrameRecorded((e=>{}))},onNarLeftClick(){e.index.navigateBack({delta:1})},onCopyTextClick(){e.index.setClipboardData({data:this.selectChatItem.content}),this.$refs.chatItemActionPopup.close()},onAddExpressionClick(){let e=this.selectChatItem.content.replace(a.ImageFatherPath,"");this.addExpression(e),this.$refs.chatItemActionPopup.close()},onDeleteTextClick(){this.deleteMessage(this.selectChatItem.id),this.$refs.chatItemActionPopup.close()},onWithdrawTextClick(){this.withdrawMessage(this.selectChatItem.id),this.$refs.chatItemActionPopup.close()},onInputFocus(){this.inputFocus=!0},onContentClick(){this.inputFocus=!1,this.showEmojiPicker=!1,e.index.hideKeyboard()},onChatItemLongPress(e){this.selectChatItem=e,this.$refs.chatItemActionPopup.open()},onInput(e){this.sendText=e.detail.value},onVoiceButtonTouchStart(t){0!=this.myUserInfo.isVerify?(this.touchY=t.changedTouches[0].clientY,this.$refs.recordingPopup.open(),this.recorderManager.start(this.options),this.voiceTimer()):e.index.showToast({title:"只有认证过的用户才可以发送语音消息哦",icon:"none"})},onVoiceButtonTouchEnd(){this.$refs.recordingPopup.close(),this.recorderManager.stop(),this.stopTimer=!0},onVoiceButtonTouchMove(e){this.touchY-e.changedTouches[0].clientY>50?this.cancelSendVoice=!0:this.cancelSendVoice=!1},sendButtonClick(){this.sendVoice||this.sendText&&this.sendMessage(this.fromUserInfo.id,this.sendText)},onChangeSendTypeClick(){this.sendVoice=!this.sendVoice,this.sendVoice&&(this.inputFocus=!1,this.showEmojiPicker=!1,e.index.hideKeyboard())},onImageChooseClick(){let t=this;e.index.chooseImage({count:9,sizeType:["original","compressed"],sourceType:["album"],success:function(e){var s=e.tempFilePaths;t.uploadImageOrVoice(s)}})},onCameraIconClick(){let t=this;e.index.chooseImage({count:1,sizeType:["original","compressed"],sourceType:["camera"],success:function(e){var s=e.tempFilePaths;t.uploadImageOrVoice(s)}})},onSmileIconClick(){this.showEmojiPicker=!this.showEmojiPicker,this.scrollInto="show_keyboard",this.showEmojiPicker&&(this.inputFocus=!1,e.index.hideKeyboard())},onSwiperChange(e){this.expressionTabPage=e.detail.current},onExpressionTabClick(e){this.expressionTabPage=e},onEmojiItemClick(e){this.sendText=this.sendText+e},onCustomExpressionClick(e){this.sendMessage(this.fromUserInfo.id,e.url.replace(a.ImageFatherPath,""),1)},onHistoryIconClick(){e.index.navigateTo({url:`/pages/message-secondary-page/chat-history/chat-history?fromUserId=${this.fromUserInfo.id}`})},showChatCreatTime(e){let s=this.messageGroup.messages,o=!1;if(0==e)o=!0;else{t.GetNumberOfMenit(s[e-1].createTime,s[e].createTime)>1&&(o=!0)}return o},voiceTimer(){if(this.voiceTime>=59)return;if(this.stopTimer)return void(this.stopTimer=!1);let e=this;setTimeout((function(){e.voiceTime=e.voiceTime+1,e.voiceTimer()}),1e3)},async setMessageListUnReadSum(t,s,i=0){let a=await o.getUserMessageList(t);for(let o=0;o<a.length;o++)if(s==a[o].userId){try{m.changeUnreadMessageSum(-a[o].unReadSum)}catch{}a[o].unReadSum=i;let s=r.getUserMessageListKey(t);await e.index.setStorage({key:s,data:a});break}},async addExpression(t){return(await n.request({data:{method:"POST",group:"message",action:"emoticon/add",data:{filename:t},header:{"content-type":"application/x-www-form-urlencoded"}}})).data.code===a.REQUEST_SUCCEEDED_CODE&&(this.$refs.customExpression.refresh(),e.index.showToast({title:"添加成功",icon:"success"}),!0)},async deleteMessage(e){if(this.messageGroup){let t=this.messageGroup.messages;for(let s=t.length-1;s>=0;s--)if(t[s].id==e){t.splice(s,1);break}this.messageGroup.messages=t,await n.request({data:{method:"POST",group:"message",action:`${e}/delete`,data:{id:e},header:{"content-type":"application/x-www-form-urlencoded"}}}),this.saveNewestMessageGroup(),this.saveNewestUserMessage()}},async withdrawMessage(e){if((await n.request({data:{method:"POST",group:"message",action:`${e}/withdraw`,data:{id:e},header:{"content-type":"application/x-www-form-urlencoded"}}})).data.code==a.REQUEST_SUCCEEDED_CODE&&this.messageGroup){let t=this.messageGroup.messages;for(let s=t.length-1;s>=0;s--)if(t[s].id==e){t[s]={id:e,content:"你撤回了一条消息",type:-1,isMe:!0,createTime:t[s].createTime};break}this.messageGroup.messages=t,this.saveNewestMessageGroup(),this.saveNewestUserMessage()}},async sendMessage(e,s,o=0,i=0){let a=await n.request({data:{method:"POST",group:"message",action:"send",data:{content:s,type:o,toUserId:e,time:i},header:{"content-type":"application/x-www-form-urlencoded"}}});if("00000"===a.data.code){this.sendText="";let n=a.data.data;this.messageGroup.messages?this.messageGroup.messages.push({content:0==o?s:n.url+s,type:o,id:n.messageId,isMe:!0,createTime:t.getTime(),isNotRead:!0,time:i}):this.messageGroup={fromUserId:e,type:"",badgeNumber:0,messages:[{content:1==o?n.url+s:s,type:o,isMe:!0,id:n.messageId,createTime:t.getTime(),isNotRead:!0,time:i}]},this.scrollInto=`chat_${n.messageId}`,this.saveNewestUserMessage(),this.saveNewestMessageGroup()}},async getIsBeenRead(e){let t=await n.request({data:{method:"GET",group:"message",action:"unread/check",data:{ids:JSON.stringify(e)},header:{"content-type":"application/x-www-form-urlencoded"}}});return t.data.code==a.REQUEST_SUCCEEDED_CODE?t.data.data:[]},async messageDataProcessing(e,t){let s=await this.getUnReadMessage(t);e=e.concat(s);let o=[],i=[];return e.forEach((e=>{-1==o.indexOf(e.id)&&(o.push(e.id),i.push(e))})),i.sort((function(e,t){return e.id>=t.id?1:-1})),i},async getUnReadMessage(e){let t=await n.request({data:{method:"DELETE",group:"message",action:"unRead/message",data:{userId:e},header:{"content-type":"application/x-www-form-urlencoded"}}});if(t.data.code===a.REQUEST_SUCCEEDED_CODE){return t.data.data}return[]},async saveNewestMessageGroup(){let t=r.getChatRecordKey(this.myUserInfo.id,this.fromUserInfo.id);e.index.setStorage({key:t,data:this.messageGroup})},async saveNewestUserMessage(){if(this.messageGroup.messages){let t=await o.getUserMessageList(this.myUserInfo.id),s=!1,i=this.messageGroup.messages[this.messageGroup.messages.length-1];for(let e=0;e<t.length;e++)if(t[e].userId===this.fromUserInfo.id){let o=t[e];m.changeUnreadMessageSum(-o.unReadSum),o.lastMessage=i.content,o.lastMessageType=i.type,o.lastTime=i.createTime,o.unReadSum=0,t.splice(e,1),t.push(o),s=!0;break}this.fromUserInfo&&(s||t.push({avatar:this.fromUserInfo.avatar,lastMessage:i.content,lastMessageType:i.type,lastTime:i.createTime,online:this.onLineState,unReadSum:0,userId:this.fromUserInfo.id,username:this.fromUserInfo.username}));let a=r.getUserMessageListKey(this.myUserInfo.id);e.index.setStorage({key:a,data:t})}},async uploadImageOrVoice(t,s=1,o){let i,r=this,c=[],d=t.length;if(2==s&&0==this.myUserInfo.isVerify)return void e.index.showToast({title:"只有认证过的用户才可以发送语音消息哦",icon:"none"});if(d<1)return;let m=await n.request({data:{method:"GET",group:"message",action:"tokens",data:{sum:d},header:{"content-type":"application/x-www-form-urlencoded"}}});m.data.code===a.REQUEST_SUCCEEDED_CODE&&(i=m.data.data,i.forEach((e=>{c.push(e.fileName)})),t.forEach((async(t,n)=>{1==s&&e.index.showLoading({title:`正在发送${n+1}/${d}`}),await e.index.uploadFile({url:a.UploadUrl,filePath:t,name:"file",formData:{key:i[n].fileName,token:h.aes.decrypt(i[n].token)},success(){r.sendMessage(r.fromUserInfo.id,i[n].fileName,s,o)}})})),e.index.hideLoading())}}};if(!Array){(e.resolveComponent("uni-nav-bar")+e.resolveComponent("chat-item")+e.resolveComponent("uni-popup")+e.resolveComponent("emoji")+e.resolveComponent("custom-expression")+e.resolveComponent("action-sheet-item")+e.resolveComponent("action-sheet"))()}Math||((()=>"../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js")+(()=>"../../../components/chat-item/chat-item.js")+(()=>"../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js")+(()=>"../../../components/emoji/emoji.js")+(()=>"../../../components/custom-expression/custom-expression.js")+(()=>"../../../components/action-sheet-item/action-sheet-item.js")+(()=>"../../../components/action-sheet/action-sheet.js"))();var l=e._export_sfc(u,[["render",function(t,s,o,i,a,n){return e.e({a:e.t(n.fromUsername),b:a.onLineState?"#2ee98e":"#979797",c:e.t(a.onLineState?"在线":"离线"),d:e.o((e=>n.onNarLeftClick())),e:e.p({"left-icon":"back",fixed:"true",backgroundColor:"#fff",color:"#808080",statusBar:"true"}),f:a.messageGroup.messages},a.messageGroup.messages?e.e({g:e.f(a.messageGroup.messages,((t,s,o)=>e.e({a:n.showChatCreatTime(s)},n.showChatCreatTime(s)?{b:e.t(a.GettimeifferenceOfNow(t.createTime).Detailed)}:{},{c:e.o((e=>n.onChatItemLongPress(t))),d:"91d12b26-1-"+o,e:e.p({avatarUrl:t.isMe?a.myUserInfo.avatar:a.fromUserInfo.avatar,chatText:t.content,isMe:t.isMe,voiceTime:t.time,isNotRead:t.isMe&&t.isNotRead,messageType:t.type}),f:t.id,g:"chat_"+t.id}))),h:0!=a.keyboardHeight||a.showEmojiPicker},(0!=a.keyboardHeight||a.showEmojiPicker,{}),{i:a.cancelSendVoice?"/static/svgs/chat-cancel.svg":"/static/svgs/chat-recording.svg",j:e.t(a.cancelSendVoice?"松手取消发送":`正在录音 ${a.voiceTime}S 上划取消`),k:e.sr("recordingPopup","91d12b26-2"),l:e.o((e=>n.onContentClick())),m:a.scrollInto,n:n.scollerHeight>0?n.scollerHeight+"px":"80vh"}):{},{o:a.sendVoice},a.sendVoice?{p:a.isRecording?"#dddddd":"#FFF",q:e.o(((...e)=>n.onVoiceButtonTouchStart&&n.onVoiceButtonTouchStart(...e))),r:e.o(((...e)=>n.onVoiceButtonTouchEnd&&n.onVoiceButtonTouchEnd(...e))),s:e.o(((...e)=>n.onVoiceButtonTouchMove&&n.onVoiceButtonTouchMove(...e)))}:{},{t:a.isIOS},a.isIOS?{v:!a.sendVoice&&a.inputFocus,w:a.inputFocus,x:e.o(((...e)=>n.onInputFocus&&n.onInputFocus(...e))),y:a.sendText,z:e.o((e=>a.sendText=e.detail.value))}:{A:!a.sendVoice&&a.inputFocus,B:a.inputFocus,C:e.o(((...e)=>n.onInputFocus&&n.onInputFocus(...e))),D:a.sendText,E:e.o((e=>a.sendText=e.detail.value))},{F:e.t(a.sendText),G:!a.sendVoice&&!a.inputFocus,H:e.o(((...e)=>n.onInputFocus&&n.onInputFocus(...e))),I:e.o((e=>n.sendButtonClick())),J:a.sendVoice},a.sendVoice?{K:e.o(((...e)=>n.onChangeSendTypeClick&&n.onChangeSendTypeClick(...e)))}:{L:e.o(((...e)=>n.onChangeSendTypeClick&&n.onChangeSendTypeClick(...e)))},{M:e.o(((...e)=>n.onImageChooseClick&&n.onImageChooseClick(...e))),N:e.o(((...e)=>n.onCameraIconClick&&n.onCameraIconClick(...e))),O:e.o(((...e)=>n.onSmileIconClick&&n.onSmileIconClick(...e))),P:e.o(((...e)=>n.onHistoryIconClick&&n.onHistoryIconClick(...e))),Q:e.o((e=>n.onExpressionTabClick(0))),R:0==a.expressionTabPage?"#fff":"",S:e.o((e=>n.onExpressionTabClick(1))),T:1==a.expressionTabPage?"#fff":"",U:e.o(n.onEmojiItemClick),V:e.p({contentHeight:a.emojiContentHeight-45}),W:e.sr("customExpression","91d12b26-4"),X:e.o(n.onCustomExpressionClick),Y:e.p({contentHeight:a.emojiContentHeight-45}),Z:a.expressionTabPage,aa:a.emojiContentHeight-45+"px",ab:e.o(((...e)=>n.onSwiperChange&&n.onSwiperChange(...e))),ac:a.showEmojiPicker,ad:a.showEmojiPicker?a.emojiContentHeight+"px":a.keyboardHeight+"px",ae:a.selectChatItem.id},a.selectChatItem.id?e.e({af:0==a.selectChatItem.type},0==a.selectChatItem.type?{ag:e.o(n.onCopyTextClick),ah:e.p({title:"复制"})}:{},{ai:1==a.selectChatItem.type},1==a.selectChatItem.type?{aj:e.o(n.onAddExpressionClick),ak:e.p({title:"添加到表情"})}:{},{al:e.o(n.onDeleteTextClick),am:e.p({title:"删除"}),an:a.selectChatItem.isMe},a.selectChatItem.isMe?{ao:e.o(n.onWithdrawTextClick),ap:e.p({title:"撤回"})}:{}):{},{aq:e.sr("chatItemActionPopup","91d12b26-5"),ar:e.p({needHead:!0,title:"设置消息",needCancelButton:!0})})}]]);wx.createPage(l);