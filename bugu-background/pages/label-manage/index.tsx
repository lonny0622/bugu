/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button, Card, Col, Form, Image, Input, InputNumber, List, message, Modal, Pagination, Radio, RadioChangeEvent, Row, Spin, Switch, Tooltip, Upload, UploadProps } from 'antd';
import * as React from 'react';
import PageContent from '../../components/PageContent';
import styles from './index.module.scss';
import { useEffect, useRef, useState } from 'react';
import { deleteActivityLabel, getIconUploadToken, getLabelList, getRecommendedLabelList, LabelItem, uploadIconFile, uploadLabelInfo } from '../../utils/service';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { RcFile } from 'antd/lib/upload';
import aes from '../../utils/aes/export';
import request from '../../utils/request';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
const iconFaterPath = 'http://file.bgxq.kaleer.cn/';
const LabelManage: React.FC = ()=>{
    const [labelList,setLabelList] = useState<LabelItem[]>([]);
    const [editLabelItem,setEditLabelItem] = useState<LabelItem>(null);
    const [isShowEditModel,setIsShowEditModel] = useState(false);
    const [iconUrl,setIconUrl] = useState('');
    const [isRecommended,setIsRecommended] = useState(0)
    const [isOnlyShowRecommendedLabel,setIsOnlyShowRecommendedLabel] = useState(false)
    const [page,setPage] = useState(1);
    const [isLoading,setIsLoading] = useState(false);
    const [isModelLoading,setIsModelLoading] = useState(false);
    const [isHaveMore,setIsHaveMore] = useState(true)
    const fileUploadRef = useRef(null)
    const modelFormRef = useRef(null)
    useEffect(()=>{
        getList();
    },[page,isOnlyShowRecommendedLabel]);
    
    const getList = async ()=>{
        setIsLoading(true)
        if(isOnlyShowRecommendedLabel){
            const list = await getRecommendedLabelList();
            setLabelList(list);
        }else{
            const list = await getLabelList(page);
            if(list.length>0){
                setLabelList([...labelList,...list]);
                setIsHaveMore(true);
            }else{
                setIsHaveMore(false);
            }
        }
        setIsLoading(false)
    }
    const onRadioChange = ()=>{
        setIsOnlyShowRecommendedLabel(!isOnlyShowRecommendedLabel);
        setIsHaveMore(true);
        setLabelList([]);
        setPage(1);
    }
    const onLoadMore = ()=>{
        setPage(page+1);
    }
    const loadMore =
     (isOnlyShowRecommendedLabel?null:
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        {isHaveMore?(isLoading?'????????????':<Button onClick={onLoadMore}>????????????</Button>):'???????????????'}
      </div>
    );
    const onModelFormFinish = async (e:any)=>{
        setIsModelLoading(true)
        let icon = editLabelItem.icon
        if (fileUploadRef.current) {
          const fileConfigData = await getIconUploadToken();
          if (fileConfigData) {
            const token = aes.decrypt(fileConfigData.token);
            const key = fileConfigData.fileName;
            await uploadIconFile(fileUploadRef.current,key,token);
            setIconUrl(iconFaterPath+key);
            icon = key;
          }
        }
        const res = await uploadLabelInfo({
            id:editLabelItem.id,
            content:e.content,
            hot:e.hot,
            icon:icon,
            isRecommended:isRecommended
        })
        setIsModelLoading(false)
        if(res){
            message.success('????????????');
            for(const item of labelList){
                if(item.id === editLabelItem.id){
                    item.content = e.content;
                    item.hot = e.hot;
                    item.icon = icon;
                    item.isRecommended = isRecommended;
                    break
                }
            }
            setIsShowEditModel(false);
        }
        
    }
    const onEditButtonClick = (item:LabelItem)=>{
        setIsShowEditModel(true)
        setEditLabelItem(item);
        setIconUrl(item.icon?iconFaterPath+item.icon:'');
        setIsRecommended(item.isRecommended);
        modelFormRef.current?.setFieldsValue(item);
    }
    const onDeleteButtonClick = (item:LabelItem)=>{
        Modal.confirm({
            title:'????????????',
            content:`???????????????${item.content}????????????`,
            okText:'??????',
            onOk:()=>{
                deleteActivityLabel(item.id);
                for(let index =0 ;index<labelList.length;index++){
                    if(labelList[index].id === item.id){
                        labelList.splice(index,1)
                        break;
                    }
                }
                setLabelList([...labelList])
            },
            cancelText:'??????'
        })
    }
    const uploadProps: UploadProps = {
        maxCount: 1,
        showUploadList: false,
        onRemove: () => {
          fileUploadRef.current = null;
        },
        beforeUpload: (file) => {
          fileUploadRef.current = file;
          getBase64(file as RcFile, (url) => {
            setIconUrl(url);
            console.log(url)
          });
          return false;
        },
    };
    
    return (
        <>
            <PageContent selectKey={'/label-manage'} title='??????????????????'>
                <Card title='????????????' 
                    extra={<Radio 
                    checked={isOnlyShowRecommendedLabel} 
                    onClick={onRadioChange}>
                    ??????????????????
                    </Radio>}>
                    <List
                        loading={isLoading}
                        loadMore={loadMore}
                        dataSource={labelList}
                        renderItem={item => (
                            <List.Item key={item.id}
                            actions={[<a key="delete"><Tooltip title='??????'><DeleteOutlined onClick={()=>onDeleteButtonClick(item)} /></Tooltip></a>,
                            <a key="edit"><Tooltip title="??????"><EditOutlined onClick={()=>{onEditButtonClick(item)}} /></Tooltip></a>]}
                            >
                            <List.Item.Meta
                                avatar={<Avatar className={styles.label_icon}  src={item.icon?iconFaterPath+item.icon:<div>{item.content[0]}</div>} />}
                                title={item.content}
                                description={<><div className={styles.list_item_description}> <a>?????????:{item.hot}</a>  id:{item.id} ????????????:{item.isRecommended}</div></>}
                            />
                            </List.Item>
                        )}
                    />
                    <Modal
                    title="????????????"
                    confirmLoading={isModelLoading}
                    visible={isShowEditModel}
                    onOk={() => {
                        modelFormRef.current.submit();
                    }}
                    okText='??????'
                    cancelText='??????'
                    onCancel={() => {
                        setIsShowEditModel(false);
                    }}
                    >
                        <Form ref={modelFormRef} onFinish={onModelFormFinish}>
                            <Form.Item initialValue={editLabelItem?.content}  name='content' label="??????" rules={[{ required: true, message: '???????????????!' }]}>
                                <Input defaultValue={editLabelItem?.content} size="large" placeholder="???????????????" />
                            </Form.Item>
                            <Form.Item initialValue={editLabelItem?.hot} name='hot' label="?????????" rules={[{ required: true, message: '??????????????????!' }]}>
                                <Input defaultValue={editLabelItem?.hot} type='number' size="large" placeholder="??????????????????" />
                            </Form.Item>
                            <Form.Item  name='icon' label="??????" rules={[{ message: '????????????!' }]}>
                                <div className={styles.icon_content}>
                                    <div className={styles.icon_img}>
                                        <Avatar className={styles.label_icon} size={100} src={iconUrl?iconUrl:<div>{editLabelItem?.content[0]}</div>} />
                                    </div>
                                    <div className={styles.select_button}>
                                        <ImgCrop>
                                            <Upload {...uploadProps}>
                                            <Button type="primary">????????????</Button>
                                            </Upload>
                                        </ImgCrop>
                                    </div>
                                </div>
                            </Form.Item>
                            <Form.Item  name='isRecommended' label="????????????" >
                                <Switch checked={isRecommended===1} onChange={(checked)=>{
                                    setIsRecommended(checked?1:0);
                                }} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </Card>
                
            </PageContent>
        </>
    )

}

export default LabelManage;