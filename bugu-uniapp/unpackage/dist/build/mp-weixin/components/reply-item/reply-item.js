"use strict";var e=require("../../common/constants.js"),t=require("../../utils/textFilter.js"),r=require("../../common/vendor.js");const a={name:"reply-item",props:{replyCommentData:{type:Object,required:!0},isAuthor:{type:Boolean,default:!1},isLead:{type:Boolean,default:!1},commentType:{type:String,default:"activity"}},data:()=>({}),computed:{replyText(){return t.textFilter(this.replyCommentData.content)},avatar(){return this.replyCommentData.fromUserAvatar?this.replyCommentData.fromUserAvatar+e.avatar_pic_hendle:e.AnonymousAvatar},username(){return this.replyCommentData.fromUsername?this.replyCommentData.fromUsername:"某只小布咕"}},methods:{onClick(){1!=this.replyCommentData.isDeleted&&this.$emit("onClick")},onMoreClick(){this.$emit("onMoreClick")}}};var o=r._export_sfc(a,[["render",function(e,t,a,o,m,n){return r.e({a:n.avatar,b:r.t(n.username),c:a.isAuthor},(a.isAuthor||a.isLead,{}),{d:a.isLead,e:1!=a.replyCommentData.isDeleted},1!=a.replyCommentData.isDeleted?{f:r.o((e=>n.onMoreClick()))}:{},{g:1==a.replyCommentData.isDeleted},1==a.replyCommentData.isDeleted?{}:r.e({h:0!=a.replyCommentData.toUserId},0!=a.replyCommentData.toUserId?{i:r.t(-1==a.replyCommentData.toUserId?"某只小布咕":a.replyCommentData.toUsername)}:{},{j:r.t(n.replyText)}),{k:r.o((e=>n.onClick())),l:`reply_${a.replyCommentData.id}`})}]]);wx.createComponent(o);