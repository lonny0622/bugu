"use strict";var e=require("../../common/vendor.js"),t=require("../../common/constants.js");const a=e.index.createInnerAudioContext(),i={name:"chat-item",props:{chatText:{type:String,required:!0},messageType:{type:Number,required:!0},avatarUrl:{type:String,default:""},isMe:{type:Boolean,default:!1},voiceTime:{type:Number,default:0},isNotRead:{type:Boolean,default:!1}},data:()=>({isPlayVoice:!1,avatar_pic_hendle:t.avatar_pic_hendle}),methods:{onVoicePlayClick(){this.isPlayVoice?(a.stop(),this.isPlayVoice=!1):(a.src=this.chatText,a.play(),this.isPlayVoice=!0,a.onEnded((()=>{this.isPlayVoice=!1})))},onLongPress(){this.$emit("onLongPress")},onImageClick(){e.index.previewImage({urls:[this.chatText],current:this.chatText})}}};var o=e._export_sfc(i,[["render",function(t,a,i,o,s,n){return e.e({a:-1==i.messageType},-1==i.messageType?{b:e.t(i.chatText)}:e.e({c:i.avatarUrl+s.avatar_pic_hendle,d:1==i.messageType},1==i.messageType?{e:i.chatText,f:e.o(((...e)=>n.onImageClick&&n.onImageClick(...e)))}:2==i.messageType?{h:e.t(s.isPlayVoice?"正在播放":`${i.voiceTime}`),i:e.o(((...e)=>n.onVoicePlayClick&&n.onVoicePlayClick(...e))),j:i.voiceTime/20*100+"px"}:{k:e.t(i.chatText)},{g:2==i.messageType,l:i.isNotRead},(i.isNotRead,{}),{m:e.o(((...e)=>n.onLongPress&&n.onLongPress(...e))),n:e.n(i.isMe?"chat-item-me-content":"chat-item-content")}))}]]);wx.createComponent(o);