import React, {Component} from 'react'
import {get, post, put} from '../../../api/callAPI';
import AuthService from '../../../services/AuthService'
import Message from '../../../util/Message';

export default class FormReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      userId: -1,
      email: '',
      comment: '',
      point: 5,
      isReview: -1,
      type: 'success',
      isShow: false,
      message: '',
      userProductId: -1,
    }
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (!user) return;
    let params = {}
    params["productId"] = this.props.productId
    params["userId"] = user.userId
    get("userProducts", params)
        .then(res => {
          if (res && res.status === 200 && res.data.length !== 0) {
            console.log("res.data.userProductId", res.data[0].userProductId, res.data.userProductId)
            this.setState({
              isReview: 1,
              point: res.data[0].point,
              userProductId: res.data[0].userProductId
            })
          }
          else if (res && res.status === 200 && res.data.length === 0) {
            // console.log("res.data.userProductId", res.data[0].userProductId, res.data.userProductId)
            this.setState({
              isReview: 0,
            })
          }
        }, err => {
          this.setState({
            isReview: 0
          })
        });
    console.log("3333333333333: " + user.userId)
    this.setState({
      name: user.username,
      userId: user.userId,
      email: user.email,
    })
  }
  onChanePoint(e) {
    this.setState({
      point: e.target.value,
    })
  }
  onChangeComment(e) {
    this.setState({
      comment: e.target.value,
    })
  }
  onChangeName(e) {
    this.setState({
      name: this.state.name,
    })
  }
  onChangeEmail(e) {
    this.setState({
      email: this.state.email,
    })
  }
  async handlePostReview(e) {
    e.preventDefault();
    if (this.state.isReview === 1) {
      console.log("this.state.isReview: ", this.state.isReview)

      let params = {}
      params[""] = this.props.productId
      params["userId"] = this.state.userId
      put(`userProducts/${this.state.userProductId}`, {
        "point": Number(this.state.point),
        "comment": this.state.comment,
      })
          .then(res => {
            if (res && res.status === 202) {
              this.setState({
                message: `Cập nhập lại bình luận thành công!`,
                type: 'success',
                isShow: true,
              });
              this.props.postReview(res.data, false);
            }
          }, err => {
            this.setState({
              message: err.response.data.message,
              type: 'danger',
              isShow: true,
            });
          });
    }
    if (this.state.isReview === 0){
      post('userProducts', {
        "point": Number(this.state.point),
        "comment": this.state.comment,
        "productId": this.props.productId,
        "userId": this.state.userId
      })
          .then(res => {
            if (res && res.status === 201) {
              this.setState({
                message: `Bình luận thành công!`,
                type: 'success',
                isShow: true,
                isReview: 1,
                point: res.data.point,
                userProductId: res.data.userProductId
              });
              this.props.postReview(res.data, true);
            }
          }, err => {
            this.setState({
              message: err.response.data.message,
              type: 'danger',
              isShow: true,
            });
          })
    }
    await this.setState({
      isShow: !this.setState.isShow,
    })
  }
  render() {
    const user = AuthService.getCurrentUser();
    return (
        <>
          {user && user.role === 'ROLE_USER' && this.state.userProductId !== -1 &&
              <div className="py-5 px-3">
                <h5 className="detail-nav-link mb-4">ĐỂ LẠI BÌNH LUẬN CỦA BẠN</h5>
                <form className="form" id="contact-form" method="post" onSubmit={(e) => this.handlePostReview(e)}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-4">
                        <label className="form-label" htmlFor="rating">Điểm của bạn *</label>
                        <select className="custom-select focus-shadow-0" name="rating" id="rating"
                                onChange={(e) => this.onChanePoint(e)} value={this.state.point}>
                          <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733; (5/5)</option>
                          <option value="4">&#9733;&#9733;&#9733;&#9733;&#9734; (4/5)</option>
                          <option value="3">&#9733;&#9733;&#9733;&#9734;&#9734; (3/5)</option>
                          <option value="2">&#9733;&#9733;&#9734;&#9734;&#9734; (2/5)</option>
                          <option value="1">&#9733;&#9734;&#9734;&#9734;&#9734; (1/5)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="review">Bình luân *</label>
                    <textarea className="form-control" rows="4" name="review" value={this.state.comment}
                              onChange={(e) => this.onChangeComment(e)} id="review"
                              placeholder="Bình luận của bạn" required="required"></textarea>
                  </div>
                  <button className="comment-button" type="submit">Đăng</button>
                </form>
                <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>
              </div>
      }
        </>
    )
  }
}
