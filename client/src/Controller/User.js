import React, {Component} from 'react';
import {Form, Input, Row, Col, Card} from 'antd';
const FormItem = Form.Item;

class Info extends Component {
  render() {
    return (
      <Row type="flex" justify="space-around" align="center">
        <Col span="8">
          <Card style={{width:240}} bodyStyle={{ padding: 10 }}>
            <div className="custom-image" style={{display:'block'}}>
              <img alt="example" width="100%" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>
            </div>
            <div className="custom-card" style={{padding:'10px 16px'}}>
              <h3>Europe Street beat</h3>
              <p style={{color:'#999'}}>www.instagram.com</p>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}


class PasswordForm extends Component {
  handlePasswordRepeat = (value)=> {
    this.props.form.validateFields((err, values) => {
      console.log(values);
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form>
        <FormItem label="old password" labelCol={{span:4}} wrapperCol={{span:8}}>
          {getFieldDecorator('oldValue', {
            rules: [{required: true, message: 'Please input your old password!'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="new password" labelCol={{span:4}} wrapperCol={{span:8}}>
          {getFieldDecorator('newValue', {
            rules: [{required: true, message: 'Please input your new password!'}],
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem label="repeat" labelCol={{span:4}} wrapperCol={{span:8}}>
          {getFieldDecorator('newValueAgain', {
            rules: [{required: true, message: 'Please input your new password again!'}],
            onChange: this.handlePasswordRepeat
          })(
            <Input type="password"/>
          )}
        </FormItem>
      </Form>
    );
  }
}
const ChangePassword = Form.create()(PasswordForm);

var user = {
  Info,
  ChangePassword
};
export default user;