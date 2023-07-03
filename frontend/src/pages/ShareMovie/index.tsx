import {Button, Card, Form, Input, notification} from 'antd';
import API from '../../configs/api';
import { useHistory } from "react-router-dom";
import {HTTP_STATUS_CODE, ROUTE_PATH} from '../../ts/enums';
import socketIO from '../../configs/socket';


const ShareMovie = () => {
  const [form] = Form.useForm();
  const history = useHistory();

  const onFinish = (values: any) => {

    API.shareVideo(values).then((response: any) => {

      if (response.status === HTTP_STATUS_CODE.CREATED) {
        notification["success"]({
          message: 'Shared video Success!'
        });
        socketIO.emit('send_message',{email: response.data.email, title: response.data.title, room: 'Login'})
        history.push(ROUTE_PATH.home);
      }
    }).catch((err: any) => {

    });
  };

  const onFinishFailed = () => {
    notification["error"]({
      message: 'Share video failed!'
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card title="Share a youtube movie" style={{ width: 600, marginTop: 100 }} >
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="videoUrl"
            label="Youtube URL"
            rules={[{ required: true }, { type: 'url', warningOnly: true }, { type: 'string', min: 6 }]}
          >
            <Input placeholder="input placeholder"/>
          </Form.Item>
          <Form.Item>
              <Button type="primary" htmlType="submit" style={{width: 450, marginLeft: 100}} block>
                Share
              </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ShareMovie;
