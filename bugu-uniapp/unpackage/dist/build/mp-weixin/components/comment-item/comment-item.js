"use strict";var e=require("../../utils/textFilter.js"),t=require("../../common/constants.js"),i=require("../../utils/request.js"),o=require("../../utils/dateUtils.js"),a=require("../../services/answerServices.js"),s=require("../../common/vendor.js");const n={name:"comment-item",props:{commentType:{type:String,default:"activity"},commentData:{type:Object,required:!0},replyData:{type:Array,default:[]},needRefresh:{type:Boolean,default:!1},authorId:{type:Number,default:0},needShowAll:{type:Boolean,default:!1},replyAlign:{type:Boolean,default:!1},showReplyCount:{type:Boolean,default:!1}},watch:{needRefresh(e){console.log("needRefresh",e),e&&this.refreshReply()}},computed:{publishTime(){return o.GettimeifferenceOfNow(this.commentData.createTime).DistanceNow},avatar(){return this.commentData.publisher?this.commentData.publisher.avatar+t.avatar_pic_hendle:t.AnonymousAvatar},username(){return this.commentData.publisher?this.commentData.publisher.username:"某只小布咕"},commentText(){return e.textFilter(this.commentData.content)},publisherId(){return this.commentData.publisher?this.commentData.publisher.id:0}},data:()=>({replyCommentDatas:[],likeSum:0,isLiked:!1,showAll:!0,replySum:0,page:1,havaMoreData:!0,showBottomLoading:!1}),async created(){this.isLiked=this.commentData.isLiked||this.commentData.isLike,this.likeSum=this.commentData.likeSum,this.replySum=this.commentData.responseSum,this.needShowAll?(this.showBottomLoading=!0,this.replyCommentDatas=await this.getCommentReply(this.commentData.id,this.page),this.showBottomLoading=!1):(this.replyCommentDatas=this.replyData,console.log("this.replyCommentDatas",this.replyCommentDatas),this.replySum>3?this.showAll=!1:this.showAll=!0)},methods:{onClick(){this.$emit("onCommentClick")},onMoreClick(){this.$emit("onCommentMoreClick")},onReplyClick(e,t){this.$emit("onReplyClick",this.commentData,e,t)},async onReplyMoreClick(e,t){await this.$emit("onReplyMoreClick",this.commentData,e,t)},onShowAllClick(){this.$emit("onShowAllClick",this.isLiked)},async getMoreReplys(){if(this.havaMoreData){this.showBottomLoading=!0,this.page=this.page+1;let e=await this.getCommentReply(this.commentData.id,this.page);e.length>0?this.replyCommentDatas=this.replyCommentDatas.concat(e):this.havaMoreData=!1,this.showBottomLoading=!1}},addReplyItem(e){this.replyCommentDatas.push(e)},deleteReplyItem(e){let t=this.replyCommentDatas;for(let i=0;i<t.length;i++)if(t[i].id==e){t[i].isDeleted=1;break}this.replyCommentDatas=t},async onLikeButtonClick(){if(this.isLiked){this.likeSum=this.likeSum-1,this.isLiked=!1,await this.CancelikeThisComment(this.commentData.id)||(this.likeSum=this.likeSum+1,this.isLiked=!0)}else{this.likeSum=this.likeSum+1,this.isLiked=!0,await this.likeThisComment(this.commentData.id)||(this.likeSum=this.likeSum-1,this.isLiked=!1)}},async refreshReply(){this.page=1,this.havaMoreData=!0;let e=await this.getCommentReply(this.commentData.id,this.page);this.replySum=e.length,this.replySum<=3||this.needShowAll?(this.showAll=!0,this.replyCommentDatas=e):(this.showAll=!1,this.replyCommentDatas=e.splice(0,3))},async likeThisComment(e){let o={};return"activity"===this.commentType?(o=await i.request({data:{method:"PUT",group:"activity/comment",action:`${e}/like`,data:{id:e},header:{"content-type":"application/x-www-form-urlencoded"}}}),o.data.code===t.REQUEST_SUCCEEDED_CODE):"answer"===this.commentType?await a.likeAnwserComment(e):void 0},async CancelikeThisComment(e){if("activity"===this.commentType){let o=await i.request({data:{method:"DELETE",group:"activity/comment",action:`${e}/like/remove`,data:{id:e},header:{"content-type":"application/x-www-form-urlencoded"}}});return o.data.code===t.REQUEST_SUCCEEDED_CODE?(console.log(o.data),!0):(console.log(o),!1)}if("answer"===this.commentType)return await a.cancelLikeAnwserComment(e)},async getCommentReply(e,o){if("activity"===this.commentType){let a=await i.request({data:{method:"GET",group:"activity/comment",action:`${e}/responseList`,data:{id:e,pageSize:10,startPage:o},header:{"content-type":"application/x-www-form-urlencoded"}}});return a.data.code===t.REQUEST_SUCCEEDED_CODE?a.data.data:[]}if("answer"===this.commentType){let a=await i.request({data:{method:"GET",group:"answer/comment",action:`comment/${e}/responseList`,data:{id:e,pageSize:10,startPage:o},header:{"content-type":"application/x-www-form-urlencoded"}}});return console.log("getCommentReply",a.data),a.data.code===t.REQUEST_SUCCEEDED_CODE?a.data.data:[]}}}};if(!Array){(s.resolveComponent("reply-item")+s.resolveComponent("uni-icons")+s.resolveComponent("uni-load-more"))()}Math||((()=>"../reply-item/reply-item.js")+(()=>"../../uni_modules/uni-icons/components/uni-icons/uni-icons.js")+(()=>"../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js"))();var m=s._export_sfc(n,[["render",function(e,t,i,o,a,n){return s.e({a:n.avatar,b:s.t(n.username),c:!i.commentData.publisher},(i.commentData.publisher,{}),{d:0==i.commentData.isDeleted},0==i.commentData.isDeleted?{e:s.o((e=>n.onMoreClick()))}:{},{f:1==i.commentData.isDeleted},1==i.commentData.isDeleted?{}:{g:s.t(n.commentText)},{h:s.t(n.publishTime),i:0==i.commentData.isDeleted},0==i.commentData.isDeleted?s.e({j:a.isLiked},(a.isLiked,{}),{k:s.t(a.likeSum),l:s.o((e=>n.onLikeButtonClick()))}):{},{m:s.o((e=>n.onClick())),n:i.showReplyCount},i.showReplyCount?{o:s.t(a.replyCommentDatas.length)}:{},{p:s.f(a.replyCommentDatas,((e,t,o)=>({a:e.id,b:s.o((i=>n.onReplyClick(e,t)),e.id),c:s.o((i=>n.onReplyMoreClick(e,t)),e.id),d:"3911632c-0-"+o,e:s.p({replyCommentData:e,isAuthor:i.authorId==e.fromUserId,isLead:n.publisherId==e.fromUserId})}))),q:!a.showAll},a.showAll?{}:{r:s.t(a.replySum),s:s.o(((...e)=>n.onShowAllClick&&n.onShowAllClick(...e))),t:s.p({customPrefix:"customicons",type:"right",color:"#808080",size:"15"})},{v:i.needShowAll},i.needShowAll?{w:s.p({status:a.havaMoreData?a.showBottomLoading?"loading":"more":"noMore",contentText:{contentdown:"上拉显示更多",contentrefresh:"正在加载...",contentnomore:"没有更多数据了"},iconType:"circle"})}:{},{x:i.replyAlign?"0rpx":"90rpx",y:i.showReplyCount?"2px solid #F5F5F5":"none",z:`comment_${i.commentData.id}`})}]]);wx.createComponent(m);