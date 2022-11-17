"use strict";var e=require("../../../common/vendor.js"),t=require("../../../utils/request.js"),o=require("../../../common/constants.js");const i={data:()=>({tabSelected:0,tookBoxInfos:[],tookBoxPage:1,tookBoxSum:0,tookBoxDetail:{},putBoxInfos:[],putBoxPage:1,putBoxSum:0,putBoxDetail:{}}),onLoad(){this.tookBoxLog(1),this.putBoxLog(1)},methods:{onNarLeftClick(){e.index.navigateBack({delta:1})},onTabChange(e){this.tabSelected=e},tookBoxPageChange(e){this.tookBoxPage=e.current,this.tookBoxLog(this.tookBoxPage)},putBoxPageChange(e){this.putBoxPage=e.current,this.putBoxLog(this.putBoxPage)},onTookBoxItemClick(e){this.tookBoxDetail=e,this.$refs.tookBoxDetailPopup.open()},onPutBoxItemClick(e){this.putBoxDetail=e,this.$refs.putBoxDetailPopup.open()},onDeleteButtonClick(t){let o=this;e.index.showModal({title:"删除盒子",content:"你确定要删除这个盒子吗？已经被收取的盒子无法删除哦",success:function(e){e.confirm&&(o.deleteBox(t.id),o.$refs.putBoxDetailPopup.close())}})},async tookBoxLog(e){let i=await t.request({data:{method:"GET",group:"blindBox",action:"collect/log",data:{page:e},header:{"content-type":"application/x-www-form-urlencoded"}}});i.data.code===o.REQUEST_SUCCEEDED_CODE&&(this.tookBoxInfos=i.data.data.list,this.tookBoxSum=i.data.data.total)},async putBoxLog(e){let i=await t.request({data:{method:"GET",group:"blindBox",action:"deliver/log",data:{page:e},header:{"content-type":"application/x-www-form-urlencoded"}}});i.data.code===o.REQUEST_SUCCEEDED_CODE&&(this.putBoxInfos=i.data.data.list,this.putBoxSum=i.data.data.total)},onGoToHomepageClick(t){e.index.navigateTo({url:`/pages/user-home-page/user-home-page?userId=${t}`})},async deleteBox(e){if((await t.request({data:{method:"DELETE",group:"blindBox",action:`${e}/delete`,data:{id:e},header:{"content-type":"application/x-www-form-urlencoded"}}})).data.code===o.REQUEST_SUCCEEDED_CODE)for(let t=0;t<this.putBoxInfos.length;t++)if(this.putBoxInfos[t].id==e){this.putBoxInfos[t].isDeleted=1;break}}}};if(!Array){(e.resolveComponent("uni-nav-bar")+e.resolveComponent("my-box-item")+e.resolveComponent("uni-pagination")+e.resolveComponent("uni-transition")+e.resolveComponent("uni-list-item")+e.resolveComponent("uni-list")+e.resolveComponent("action-sheet"))()}Math||((()=>"../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js")+(()=>"../../../components/my-box-item/my-box-item.js")+(()=>"../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js")+(()=>"../../../uni_modules/uni-transition/components/uni-transition/uni-transition.js")+(()=>"../../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js")+(()=>"../../../uni_modules/uni-list/components/uni-list/uni-list.js")+(()=>"../../../components/action-sheet/action-sheet.js"))();var a=e._export_sfc(i,[["render",function(t,o,i,a,n,s){return e.e({a:e.o((e=>s.onNarLeftClick())),b:e.p({"left-icon":"back",fixed:"true",backgroundColor:"#fff",color:"#808080",statusBar:"true"}),c:0==n.tabSelected?"#ffd5a9":"#fff",d:0==n.tabSelected?"#000":"#8a8a8a",e:e.o((e=>s.onTabChange(0))),f:1==n.tabSelected?"#ffd5a9":"#fff",g:1==n.tabSelected?"#000":"#8a8a8a",h:e.o((e=>s.onTabChange(1))),i:0==n.tabSelected},0==n.tabSelected?{j:e.f(n.tookBoxInfos,((t,o,i)=>({a:t.id,b:e.o((e=>s.onTookBoxItemClick(t)),t.id),c:"e791e980-2-"+i+",e791e980-1",d:e.p({myBoxData:{time:t.collectTime,id:t.id,sex:t.sex,text:t.text,userId:t.userId,isCollected:0,isDeleted:0}})}))),k:e.o(s.tookBoxPageChange),l:e.p({total:n.tookBoxSum,prevText:"上一页",nextText:"下一页",pageSize:"5",pagerCount:n.tookBoxPage}),m:e.p({"mode-class":"slide-left",show:0==n.tabSelected})}:{},{n:1==n.tabSelected},1==n.tabSelected?{o:e.f(n.putBoxInfos,((t,o,i)=>({a:t.id,b:e.o((e=>s.onPutBoxItemClick(t)),t.id),c:"e791e980-5-"+i+",e791e980-4",d:e.p({myBoxData:{time:t.createTime,id:t.id,sex:t.sex,text:t.text,userId:t.userId,isCollected:t.isCollected,isDeleted:t.isDeleted}})}))),p:e.o(s.putBoxPageChange),q:e.p({total:n.putBoxSum,prevText:"上一页",nextText:"下一页",pageSize:"5",pagerCount:n.putBoxPage}),r:e.p({"mode-class":"slide-right",show:1==n.tabSelected})}:{},{s:n.tookBoxDetail.id},n.tookBoxDetail.id?{t:e.p({title:"获取时间",rightText:n.tookBoxDetail.collectTime}),v:e.p({title:"内容",note:n.tookBoxDetail.text}),w:e.p({title:"性别",rightText:0==n.tookBoxDetail.sex?"女":"男"})}:{},{x:e.o((e=>s.onGoToHomepageClick(n.tookBoxDetail.userId))),y:e.sr("tookBoxDetailPopup","e791e980-7"),z:e.p({needHead:!0,title:"盒子详情"}),A:n.putBoxDetail.id},n.putBoxDetail.id?{B:e.p({title:"创建时间",rightText:n.putBoxDetail.createTime}),C:e.p({title:"内容",note:n.putBoxDetail.text}),D:e.p({title:"性别",rightText:0==n.putBoxDetail.sex?"女":"男"})}:{},{E:1!=n.putBoxDetail.isDeleted},1!=n.putBoxDetail.isDeleted?{F:e.o((e=>s.onDeleteButtonClick(n.putBoxDetail)))}:{},{G:e.sr("putBoxDetailPopup","e791e980-12"),H:e.p({needHead:!0,title:"盒子详情"})})}]]);wx.createPage(a);