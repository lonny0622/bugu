"use strict";var e=require("../../../common/vendor.js"),t=require("../../../utils/tabBarBadgeUtils.js"),i=require("../../../utils/request.js"),s=require("../../../common/constants.js"),a=require("../../../common/storageFunctions.js"),r=require("../../../utils/messageUtils/storage.js"),n=require("../../../utils/messageUtils/storageKeys.js");require("../../../common/globalMsgKeys.js"),require("../../../utils/messageUtils/index.js"),require("../../../utils/messageUtils/service.js"),require("../../../common/requestFunctions.js"),require("../../../common/storageKeys.js"),require("../../../utils/dateUtils.js");const o={data:()=>({type:s.PUNISH,officialNews:[],navHeight:0,contentHeight:0,scrollInto:""}),onReady(){let t=this;e.index.getSystemInfo({success(e){t.contentHeight=e.windowHeight}}),e.index.createSelectorQuery().select("#news-scrollview").boundingClientRect((e=>{t.navHeight=e.top})).exec()},async onLoad(i){let s=i.type;this.type=s;let o=await a.getMyUserInfo(),c=await r.getTypeOfficalNews(o.id,s);this.officialNews=c.reverse(),this.officialNews.length>0&&(this.scrollInto=`news_${this.officialNews[this.officialNews.length-1].id}`),c.reverse();let l=await this.getUnreadTypeofficialNews(s);c=c.concat(l),this.officialNews=c.reverse(),this.officialNews.length>0&&(this.scrollInto=`news_${this.officialNews[this.officialNews.length-1].id}`);let u=n.getOfficeTypeNewsListKey(o.id,s);e.index.setStorage({key:u,data:c});let f=await r.getOfficalList(o.id);for(let e=0;e<f.length;e++)if(f[e].type===s){t.changeUnreadMessageSum(-f[e].unreadSum),f[e].unreadSum=0;break}let d=n.getOfficeNewsListKey(o.id);e.index.setStorage({key:d,data:f})},computed:{scollerHeight(){return this.contentHeight-this.navHeight}},methods:{onNarLeftClick(){e.index.navigateBack({delta:1})},async getUnreadTypeofficialNews(e){let t=await i.request({data:{method:"GET",group:"message",action:"official/unread/special",data:{type:e},header:{"content-type":"application/x-www-form-urlencoded"}}});if(t.data.code===s.REQUEST_SUCCEEDED_CODE){return t.data.data}return[]}}};if(!Array){(e.resolveComponent("uni-nav-bar")+e.resolveComponent("Text")+e.resolveComponent("uni-card"))()}Math||((()=>"../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js")+(()=>"../../../uni_modules/uni-card/components/uni-card/uni-card.js"))();var c=e._export_sfc(o,[["render",function(t,i,s,a,r,n){return{a:e.o(n.onNarLeftClick),b:e.p({"left-icon":"back",fixed:"true",backgroundColor:"#fff",color:"#808080",statusBar:"true"}),c:e.f(r.officialNews,((t,i,s)=>({a:e.t(t.createTime),b:e.t(t.text),c:"0ecafc26-2-"+s+",0ecafc26-1-"+s,d:"0ecafc26-1-"+s,e:t.id,f:`news_${t.id}`}))),d:e.p({extra:"有任何问题请联系官方客服",title:"官方消息"}),e:r.scrollInto,f:n.scollerHeight+"px"}}]]);wx.createPage(c);