import {Button, Divider, Form, Input, Layout, Modal, notification} from 'antd';
import {AppLayoutProps} from '../../ts/interface';
import {HTTP_STATUS_CODE, ROUTE_PATH} from '../../ts/enums';
import {useHistory} from "react-router-dom";
import {EyeInvisibleOutlined, EyeTwoTone, HomeFilled} from '@ant-design/icons';
import './applayout.css';
import {useEffect, useState} from 'react';
import API from '../../configs/api';
import STORAGES_CONFIG from '../../configs/storage';
import React from 'react';
import socketIO from '../../configs/socket';


const {Header, Content} = Layout;

const AppLayout = ({children}: AppLayoutProps) => {
  const loginStorage = localStorage.getItem((STORAGES_CONFIG.isLogin))
  const [open, setOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLogin, setIsLogin] = useState(loginStorage === 'true');
  const [email, setEmail] = useState(localStorage.getItem((STORAGES_CONFIG.email)));

  const [form] = Form.useForm();
  const history = useHistory();

  const openNotification = (data: any) => {
    notification["success"]({
      message: `${data.email} just share new video: ${data.title}`
    });
  };

  useEffect(() => {
    socketIO.on('receive_message', (data) => {
      openNotification(data);
    });
    // eslint-disable-next-line
  }, [socketIO])
  const sendMessage = () => {
    socketIO.emit('message',{data: 'DATA===>'});
  }
  const onCreate = (values: any) => {
    if (isRegister) {
      if (values.password === values.rePassword) {
        API.register({email: values.email, password: values.password}).then((response: any) => {
          const res = response;
          if (res.status === HTTP_STATUS_CODE.CREATED ) {
            form.resetFields();
            setIsRegister(false);
            notification["success"]({
              message: 'Register Success!'
            });
          }
        }).catch((err: any) => {
          console.log(err)
        });
      } else {
        notification["error"]({
          message: 'Password and Re-entered Password do not match'
        });
      }
    } else {
      API.login(values).then((response: any) => {
        console.log(response)

        const res = response;
        if (res.status === HTTP_STATUS_CODE.CREATED && res.data.token) {
          setIsLogin(true);
          setEmail(values.email);
          localStorage.setItem(STORAGES_CONFIG.token, res.data.token);
          localStorage.setItem(STORAGES_CONFIG.userID, res.data.userId);
          localStorage.setItem(STORAGES_CONFIG.email, values.email);
          localStorage.setItem(STORAGES_CONFIG.isLogin, 'true');
          socketIO.emit('join_room',{ room: 'Login' });
          form.resetFields();
          notification["success"]({
            message: 'Login Success!'
          });
        }
      }).catch((err: any) => {
        if (err.response.status === HTTP_STATUS_CODE.EMAIL_NOT_REGISTER) {
          setIsRegister(true);
        }
      });
    }
    if (open) {
      setOpen(false);
    }
  };
  const onLogOut = () => {
    setIsLogin(false);
    setEmail('');
    socketIO.emit('leave_room', { room: 'Login' });
    localStorage.clear();
  };
  const onCancel = () => {
    setOpen(false);
  };

  return (
    <Layout className="min-vh-100" style={{background: 'white'}}>
      <Header style={{position: "sticky", top: 0, zIndex: 100, width: "85%", background: 'white', margin: '0 auto'}}>
        <div className="logo d-inline-flex align-items-center" style={{fontSize: '350%'}}>
          <HomeFilled onClick={() => {
            history.push(ROUTE_PATH.home)
          }}/>
          <span style={{fontSize: '50px', marginLeft: '10px', fontWeight: 'bold'}} onClick={() => {
            sendMessage()}
          }>Funny Movies</span>
        </div>
        {
          isLogin ?
            <div className="pe-3 d-inline-flex float-end me-3">
              <label className="text-overflow" style={{maxWidth: "75ch"}}>
                {email}
              </label>
              <Button type="primary" className="ms-2 mt-3" onClick={() => { history.push(ROUTE_PATH.shareMovie)}}>
                Share a movie
              </Button>
              <Button type="primary" className="ms-2 mt-3" onClick={() => {onLogOut()}}>
                Logout
              </Button>
            </div> :
            <div className="d-inline-flex float-end ">
              <Form form={form} name="horizontal_login" onFinish={onCreate} className="d-inline-flex float-end">
                <Form.Item name="email" rules={[{required: true, message: 'Please input your email!'}]}>
                  <Input placeholder="Email" type="email" className="mt-3 login"/>
                </Form.Item>
                <Form.Item name="password" rules={[{required: true, message: 'Please input your password!'}]} className="ms-2">
                  <Input.Password type="password" placeholder="Password" className="mt-3 login" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                </Form.Item>
                {isRegister ?
                  <Form.Item name="rePassword" rules={[{required: true, message: 'Please Re input your password!'}]} className="ms-2">
                    <Input.Password type="password" placeholder="Confirm Password" className="mt-3 login" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                  </Form.Item>
                  :
                  <></>
                }
                <Form.Item shouldUpdate>
                  {() => (
                    <Button type="primary" htmlType="submit" className="ms-2 mt-3 login"
                            disabled={
                              !form.isFieldsTouched(true) ||
                              !!form.getFieldsError().filter(({errors}) => errors.length).length
                            }
                    >
                      Login / Register
                    </Button>
                  )}
                </Form.Item>
              </Form>
              <span className="icon">
            <i className="fa fa-bars" onClick={() => {
              setOpen(true);
            }}></i>
          </span>
            </div>
        }
        <Divider style={{margin: "-20px", border: '1px solid black'}}/>
        <Modal
          open={open}
          title="Login / Register"
          okText="Login / Register"
          cancelText="Cancel"
          onCancel={onCancel}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                onCreate(values);
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{modifier: 'public'}}
          >
            <Form.Item name="email" label="Email" rules={[{required: true, message: 'Please input the email!'}]}>
              <Input/>
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{required: true, message: 'Please input the password!'}]}>
              <Input.Password  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} type="textarea"/>
            </Form.Item>
            {isRegister ?
              <Form.Item name="rePassword" label="Confirm Password" rules={[{required: true, message: 'Please input the password!'}]}>
                <Input.Password  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} type="textarea"/>
              </Form.Item>
              :
              <></>
            }
          </Form>
        </Modal>
      </Header>
      <Content>
        <div style={{marginLeft: '17rem', marginRight: '17rem'}} className="mt-4">{children}</div>
      </Content>
    </Layout>
  )
}

export default AppLayout;
