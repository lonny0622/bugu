
import * as React from 'react';
import { Component } from 'react';
import md5 from 'js-md5'
import {Menu, message, Modal} from 'antd'
import {HomeOutlined,ToolOutlined,
FileTextOutlined,
FolderOutlined,
ClusterOutlined,
InsertRowAboveOutlined,
MehOutlined,
IdcardOutlined,
TagOutlined,
AlertOutlined,
WalletOutlined,
FireOutlined,
TagsOutlined
}from '@ant-design/icons'
import styles  from '../styles/components/LeftNav.module.css';
import Router  from 'next/router';
const { SubMenu } = Menu;

interface LeftNavProps{
  selectKey?:string,
  openKeys?:string[]
}

interface LeftNavState {
  isLogin:boolean,
  ToastVisable:boolean,
  confirmLoading:boolean

}
 
class LeftNav extends React.Component<LeftNavProps, LeftNavState> {
  constructor(props) {
    super(props);
    this.state = { 
      isLogin:false,
      ToastVisable:false,
      confirmLoading:false,
     
        };
  }

  componentDidMount(){
  }
  handleClick = e => {
    if(e.key=='api-doc'){
      this.setState({
        ToastVisable:true
      })
    }else{
      Router.push(e.key)
    }
    
  };




 OpenWindow(METHOD,URL,PARAMS,target) {
    if(target==null) target = "_blank";
    var temp_form = document.createElement("form");
    temp_form.action = URL;
    temp_form.target = target;
    temp_form.method = METHOD;
    temp_form.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        temp_form.appendChild(opt);
    }
    document.body.appendChild(temp_form);
    temp_form.submit();
    document.body.removeChild(temp_form);
  }
  handleCancel = () => {
    this.setState({
      ToastVisable:false
    })
  };
  render() { 
    return (
      <>
      
      <Menu
      style={{
        border:'none'
      }}
      onClick={this.handleClick}
      defaultSelectedKeys={[this.props.selectKey]}
      defaultOpenKeys={this.props.openKeys}
      mode="inline"
    >
      <div className={styles.menu_heading }>Home</div>
      <Menu.Item key="/" icon={<HomeOutlined />} style={{
        marginTop:'20px',
        marginBottom:'30px'
      }}
  
      >
         ??????
      </Menu.Item>
      <div className={styles.menu_heading }>Option</div>
      <Menu.Item key="api-doc" icon={<ToolOutlined />} onClick={()=>{
        window.open("https://activity.bgxq.kaleer.cn/doc.html")
      }} >api??????</Menu.Item>
       <Menu.Item key="/hot-activities/HotActivities" icon={<FireOutlined />}  >????????????</Menu.Item>
      <Menu.Item key="/article-review/ArticleReview" icon={<FileTextOutlined />}  >????????????</Menu.Item>
      <Menu.Item key="/question-review/QuestionReview" icon={<FileTextOutlined />}  >????????????</Menu.Item>
      <Menu.Item key="/answer-review/AnswerReview" icon={<FileTextOutlined />}  >????????????</Menu.Item>
      <Menu.Item key="/avatar-review/AvatarReview" icon={<MehOutlined />}  >????????????</Menu.Item>
      <Menu.Item key="/label-review/labelReview" icon={<TagOutlined />}  >????????????</Menu.Item>
      <Menu.Item key="/label-manage" icon={<TagsOutlined />}  >????????????</Menu.Item>
      <Menu.Item key="/authentication-review/AuthenticationReview" icon={<IdcardOutlined />}>??????????????????</Menu.Item>
      <Menu.Item key="/user-report/userReport" icon={<AlertOutlined />}>??????????????????</Menu.Item>
      <Menu.Item key="/official-news/officialNews" icon={<WalletOutlined />}>????????????</Menu.Item>
      <Menu.Item key="/fileManager/fileManager" icon={<FolderOutlined />}  >????????????</Menu.Item>
      <Menu.Item key="/apiLog/apiLog" icon={<ClusterOutlined />}>api????????????</Menu.Item>
      <Menu.Item key="/apiLog/apiLogList" icon={<InsertRowAboveOutlined />}>api????????????</Menu.Item>
    </Menu>
    <div className={styles.sidenav_footer}>
          <div className="d-flex align-items-center justify-content-between small">
              <div className="text-muted">Copyright &copy; HBUTLiving 2021</div>
                      <div>
                          <a href="https://beian.miit.gov.cn/">???ICP???2020018386???-3</a>
                      </div>
          </div>
    </div>
  </>);
  }
}
 
export default LeftNav;

