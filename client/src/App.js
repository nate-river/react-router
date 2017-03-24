import 'antd/dist/antd.min.css';
import React, {Component} from 'react';
import {Layout, Menu, Breadcrumb, Form, Icon, Input, Button, Checkbox} from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import user from './Controller/User.js';
import news from './Controller/News.js';
const FormItem = Form.Item;
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

const Auth = {
  isAuth: false
};

const Welcome = ()=>(
  <div>Welcome to the Admin console</div>
);

class Admin extends Component {
  state = {
    collapsed: false,
    mode: 'inline',
  };
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }

  render() {
    const urlInfo = location.pathname.split('/');
    urlInfo.shift();
    const openKeys = [urlInfo.slice(0, 2).join('/')];
    const selectKeys = [urlInfo.slice(0, urlInfo.length).join('/')];
    return (
      <Layout>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo"></div>
          <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={selectKeys} defaultOpenKeys={openKeys}>
            <SubMenu
              key="admin/user"
              title={<span><Icon type="user"/><span className="nav-text">User</span></span>}
            >
              <Menu.Item key="admin/user/info"><Link to="/admin/user/info">userInfo</Link></Menu.Item>
              <Menu.Item key="admin/user/changePassWord"><Link to="/admin/user/changePassWord">Change
                passWord</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="admin/news"
              title={<span><Icon type="team"/><span className="nav-text">news</span></span>}
            >
              <Menu.Item key="admin/news/list"><Link to="/admin/news/list">newsList</Link></Menu.Item>
              <Menu.Item key="admin/news/add"><Link to="/admin/news/add">addNews</Link></Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{background: '#fff', padding: 0}}/>
          <Content style={{margin: '0 16px'}}>
            <Breadcrumb style={{margin: '12px 0'}}>
            </Breadcrumb>
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
              <Route exact path={`${this.props.match.url}/`} component={Welcome}/>
              <Route path={`${this.props.match.url}/user/info`} component={user.Info}/>
              <Route path={`${this.props.match.url}/user/changePassword`} component={user.ChangePassword}/>
              <Route exact path={`${this.props.match.url}/news/list`} component={news.List}/>
              <Route path={`${this.props.match.url}/news/add`} component={news.Add}/>
              <Route path={`${this.props.match.url}/news/list/:newsId`} component={news.NewsShow}/>
            </div>
          </Content>
          <Footer style={{textAlign: 'center'}}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

class NormalLoginForm extends Component {
  state = {
    redirectToRef: false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        fetch('/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify(values)
        }).then(res=>res.json()).then(data=> {
          if (data.code === '200') {
            Auth.isAuth = true;
            this.setState({redirectToRef: true});
          }
        })
      }
    });
  };
  componentDidMount = ()=> {
    fetch('/auth', {
      credentials: 'same-origin',
    }).then(res=>res.json()).then(data=> {
      if (data.code === '200') {
        Auth.isAuth = true;
        this.setState({redirectToRef: true});
      }
    })
  }

  render() {
    const {from}  = this.props.location.state || {from: {pathname: '/admin'}}
    const {redirectToRef} = this.state;
    const {getFieldDecorator} = this.props.form;
    if (redirectToRef) {
      return (
        <Redirect to={from}/>
      )
    }
    return (
      <Layout>
        <Header/>
        <Content style={{padding:"80px 0"}}>
          <Form onSubmit={this.handleSubmit} style={{width:400,margin:'0 auto'}} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{required: true, message: 'Please input your username!'}],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username"/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{required: true, message: 'Please input your Password!'}],
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password"/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>Remember me</Checkbox>
              )}
              <a className="login-form-forgot">Forgot password</a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
            </FormItem>
          </Form>
        </Content>
        <Footer/>
      </Layout>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

const PrivateRoute = ({component, ...rest}) => {
  return (
    <Route {...rest} render={props => (
    Auth.isAuth ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
  )
};

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/login" component={WrappedNormalLoginForm}/>
          <PrivateRoute path="/admin" component={Admin}/>
        </div>
      </Router>
    );
  }
}

export default App;
