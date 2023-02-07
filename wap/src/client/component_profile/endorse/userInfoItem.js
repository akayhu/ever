import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import Image from 'src/client/component_common/image';

class UserInfoItem extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
  }
  handleDeleteSubmit() {
    const { pid } = this.props;
    this.props.handleDelete({creator: pid});
  }
  handleDeleteCancel() {}
  render() {
    const { url, avatarWebUrl, userName, companyName, jobTitle, schoolName, major, viewas } = this.props;
    return (
      <div styleName="user_box">
        <div styleName="user_left">
          <a href={ url } >
            <Image
              src={ avatarWebUrl }
              type="avatar"
            />
          </a>
        </div>
        <div styleName="user_right">
          <a className="name_link" href={ url } >
            { userName }
          </a>
          {  viewas === "self" &&
            <DropdownMenu  toggleOpen={()=>{}}>
              <DropdownTarget>
                <i className="delete icon"></i>
              </DropdownTarget>
              <DropdownList>
                <div styleName="trash_content">
                  <p >是否要刪除此筆肯定</p>
                  <div styleName="action_cotent">
                    <button
                      className="ui primary button"
                      onClick={this.handleDeleteSubmit}
                    >
                      確認
                    </button>
                    <button
                      className="ui normal button"
                      onClick={this.handleDeleteCancel}
                    >
                      取消
                    </button>
                  </div>
                </div>
              </DropdownList>
            </DropdownMenu>
          }
          { companyName
            ?  <p className="body_text">{`${jobTitle || ''} - ${companyName || ''}`}</p>
            : schoolName
              ? <p className="body_text">{`${jobTitle || ''} - ${schoolName || ''}`}</p>
              : null
          }

        </div>
      </div>
    )
  }
}

UserInfoItem.propTypes = {
  avatarWebUrl: PropTypes.string,
  companyName: PropTypes.string,
  jobTitle: PropTypes.string,
  major: PropTypes.string,
  schoolName: PropTypes.string,
  pid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userName: PropTypes.string,
  viewas: PropTypes.string,
  handleDelete: PropTypes.func
}

export default  CSSModules(UserInfoItem, css, {allowMultiple : true});
