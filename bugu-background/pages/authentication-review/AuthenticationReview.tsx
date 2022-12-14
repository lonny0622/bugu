import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, List, message, Modal, Pagination, Spin,Image,Form} from 'antd';
import * as React from 'react';
import { Component } from 'react';
import PageContent from '../../components/PageContent';
import styles from '../../styles/pages/AuthenticationReview.module.scss'
import { REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
import request, { servicePath } from '../../utils/request';
interface AuthenticationReviewProps {

}
interface AuthenticationItem {
    createTime: string
    id: number
    pic: string
    sex: number
    stuId: string
    userId:number
}



interface AuthenticationReviewState {
    showDeleteModel: boolean
    deleteReason?: string
    isLoading: boolean
    pageNumber: number
    authenticationList:AuthenticationItem[]
    total:number
    deleteItem?:AuthenticationItem
    passItem?:AuthenticationItem
    deleteIndex?:number
    showPassModel: boolean
    stuId:string,
    sex?:number,
    passIndex?:number
}

class AuthenticationReview extends React.Component<AuthenticationReviewProps, AuthenticationReviewState> {
    constructor(props: AuthenticationReviewProps) {
        super(props);
        this.state = {
            showDeleteModel: false,
            isLoading: false,
            pageNumber: 1,
            authenticationList:[],
            total:0,
            showPassModel:false,
            stuId:''

        };
    }
    componentDidMount() {
        this.getAuthenticationNotReview()
    }
    private getAuthenticationNotReview(page: number = 1) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.AuthenticationReview,
            data: {
                page: page
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                console.log(data)
                this.setState({
                   authenticationList: data.data.list as AuthenticationItem[],
                   total:data.data.total
                })
            } else {
                message.error(data.userMsg)
            }
        })
    }
    //????????????????????????
    private passAuthentication(id:number,index:number,stuId:string,sex?:number){
        this.setState({
            isLoading: true
        })
        request({
            method: 'POST',
            url: servicePath.AuthenticationAction+`${id}/pass`,
            data: {
                id: id,
                stuId:stuId,
                sex:sex
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                let authenticationList = this.state.authenticationList
                authenticationList.splice(index,1)
                this.setState({
                    authenticationList 
                })
               message.success('????????????')
            } else {
                message.error(data.userMsg)
            }
        })
    }
//????????????????????????
private deleteAuthentication(id:number,reason:string,index:number){
    this.setState({
        isLoading: true
    })
    request({
        method: 'DELETE',
        url: servicePath.AuthenticationAction+`${id}/delete`,
        data: {
            id: id,
            reason:reason
        }
    }).then(async data => {
        this.setState({
            isLoading: false
        })
        console.log(data)
        if (data.code === REQUEST_SUCCEEDED_CODE) {
            let authenticationList = this.state.authenticationList
            authenticationList.splice(index,1)
            this.setState({
                authenticationList 
            })
           message.success('????????????')
        } else {
            message.error(data.userMsg)
        }
    })
}
    render() {
        return (
            <PageContent selectKey='/authentication-review/AuthenticationReview' title='??????????????????'>
                <div className={styles.authentication_review_content}>
                    <Modal
                        title="??????????????????????????????????????????"
                        visible={this.state.showDeleteModel}
                        onOk={() => {
                            if(this.state.deleteReason.length>1){
                                this.deleteAuthentication(this.state.deleteItem.id,this.state.deleteReason,this.state.deleteIndex)
                                this.setState({
                                    showDeleteModel: false,
                                    deleteReason: undefined,
                                    deleteItem: undefined,
                                    deleteIndex: undefined
                                })
                            }else{
                                message.error('??????????????????')
                            }
                            
                        }}

                        okText='??????'
                        cancelText='??????'
                        onCancel={() => {
                            this.setState({
                                showDeleteModel: false,
                                deleteReason: undefined,
                                deleteItem: undefined,
                                deleteIndex: undefined
                            })
                        }}
                    >

                        <Input
                            required
                            id="newFileName"
                            size="large"
                            placeholder='???????????????'
                            value={this.state.deleteReason}
                            onChange={(e) => {
                                this.setState({
                                    deleteReason: e.target.value
                                })
                            }}
                        />

                    </Modal>
                    <Modal
                        title="????????????????????????"
                        visible={this.state.showPassModel}
                        onOk={() => {
                            if(this.state.stuId.length>1){
                                this.passAuthentication(this.state.passItem.id,this.state.passIndex,this.state.stuId,this.state.sex)
                                this.setState({
                                    showPassModel: false,
                                    stuId:'',
                                    sex: undefined,
                                })
                            }else{
                                message.error('???????????????')
                            }
                        }}
                        okText='??????'
                        cancelText='??????'
                        onCancel={() => {
                            this.setState({
                                showPassModel: false,
                                    stuId:'',
                                    sex: undefined,
                            })
                        }}
                    >

                            <Form.Item label="??????">
                                <Input
                                    required
                                    id="stuId"
                                    size="large"
                                    placeholder='???????????????'
                                    value={this.state.stuId}
                                    onChange={(e) => {
                                        this.setState({
                                            stuId: e.target.value
                                        })
                                    }}
                                />
                            </Form.Item>

                            <Form.Item label="??????(0???1???)">
                                <Input
                                    required
                                    id="sex"
                                    size="large"
                                    placeholder='???????????????'
                                    value={this.state.sex}
                                    onChange={(e) => {
                                        this.setState({
                                            sex: Number(e.target.value)
                                        })
                                    }}
                                />
                            </Form.Item>

                    </Modal>
                    
                    <Spin spinning={this.state.isLoading}>
                        <List
                            dataSource={this.state.authenticationList}
                            renderItem={(item, index) => (<List.Item
                                key={index}
                                extra={
                                    <Image
                                      height={150}
                                      alt="picture"
                                      src={item.pic}
                                    />
                                  }
                                >
                                
                                <List.Item.Meta
    
                                    title={<div style={{
                                        display: 'flex'
                                    }}><h3>{index + 1}.<a >Id:{item.id} userId:{item.userId}  ???????????????{item.createTime}</a></h3>
                                        <Button className={styles.authentication_review_button} size='small' onClick={() => {
                                            this.setState({
                                                showPassModel:true,
                                                passItem:item,
                                                passIndex:index
                                            })
                                        }} icon={<CheckOutlined />}>????????????</Button>
                                        <Button className={styles.authentication_review_button} size='small' onClick={() => {

                                            this.setState({
                                                showDeleteModel: true,
                                                deleteItem: item,
                                                deleteIndex: index
                                            })

                                        }} icon={<DeleteOutlined />}>????????????</Button>
                                    </div>}
                                    description={'?????????'+item.stuId}
                                />

                            </List.Item>)}
                        >


                        </List>
                        <Pagination current={this.state.pageNumber} total={this.state.total} onChange={(e) => {
                            this.getAuthenticationNotReview(e)
                            this.setState({
                                pageNumber: e
                            })
                        }} />
                    </Spin>
                </div>
            </PageContent>

        );
    }
}

export default AuthenticationReview;