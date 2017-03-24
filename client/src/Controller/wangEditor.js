import React, {Component} from 'react';
import $ from 'jquery/dist/jquery.min';
import wangEditor from 'wangeditor/dist/js/wangEditor.min';
class WangEditor extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.editor = new wangEditor(this.el);
    this.editor.config.uploadImgUrl = this.props.url;
    this.editor.config.menus = $.map(wangEditor.config.menus, function (item, key) {
      if (item === 'location') {
        return null;
      }
      return item;
    });
    this.editor.create();
    if (this.props.content) {
      this.editor.$txt.html(this.props.content);
    }
  }

  render() {
    return (
      <div>
        <div ref={(el)=>{this.el = el }} style={{height:500}}>
        </div>
        <div onClick={()=>{this.props.save(this.editor.$txt.html())}}>点击获取内容</div>
      </div>
    )
  }
}
export default WangEditor;
