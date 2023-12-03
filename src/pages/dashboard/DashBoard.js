import React, {Component} from 'react'
import {Link, Route,} from 'react-router-dom';

import AuthService from '../../services/AuthService';
import FormCate from './FormCate';
import FormCustomer from './FormCustomer';
import FormProduct from './FormProduct';
import TableCate from './TableCate';
import TableCustomer from './TableCustomer';
import TableProduct from './TableProduct';
import FormOrder from "./FormOrder";
import TableOrder from "./TableOrder";
import TableFeature from "./TableFeature";
import FormFeature from "./FormFeature";
import ChartStatus from "./ChartStatus";
import TablePond from "./TablePond";
import FormPond from "./FormPond";
import FormStatusFish from "./FormStatusFish";
import TableEvent from "./TableEvent";
import FormEvent from "./FormEvent";
import TablePromotion from "./TablePromotion";


export default class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      table: <></>,
      statusComponent: <FormStatusFish/>,
      cateComponent: <TableCate addNewCate={() => this.handleAddNewCate()}/>,
      eventComponent: <TableEvent addNewEvent={() => this.handleAddNewEvent()}/>,
      promotionComponent: <TablePromotion addNewEvent={()=> this.handleAddNewEvent()}/>,
      pondComponent: <TablePond addNewPond={() => this.handleAddNewPond()}/>,
      productComponent: <TableProduct addNewProc={() => this.handleAddNewProduct()}/>,
      customerComponent: <TableCustomer addNewUser={() => this.handleAddNewUser()}/>,
      orderComponent: <TableOrder addNewOrder={() => this.handleAddNewOrder()}/>,
      featureComponent: <TableFeature addNewFeature={() => this.handleAddNewFeature()}/>,
      statusChartComponent: <ChartStatus />
    }
  }
  componentWillMount() {
    let user = AuthService.getCurrentUser();
    console.log(user);
    this.setState({
      user: user,
    });
  }
  componentDidMount() {
  }
  async handleAddNewUser() {
    await this.setState({
      customerComponent: <FormCustomer/>,
    })
  }
  async handleAddNewProduct() {
    await this.setState({
      productComponent: <FormProduct/>,
    })
  }
  async handleAddNewOrder() {
    await this.setState({
      orderComponent: <FormOrder/>,
    })
  }
  async handleAddNewFeature() {
    await this.setState({
      featureComponent: <FormFeature/>,
    })
  }
  async handleAddNewStatus() {
    await this.setState({
    })
  }
  async handleAddNewCate() {
    await this.setState({
      cateComponent: <FormCate/>,
    })
  }
  async handleAddNewEvent() {
    await this.setState({
      eventComponent: <FormEvent/>,
    })
  }

  async handleAddNewPond() {
    await this.setState({
      pondComponent: <FormPond/>,
    })
  }

  async resetProductComponent() {
    await this.setState({
      productComponent: <TableProduct addNewProc={() => this.handleAddNewProduct()}/>,
    })
  }
  async resetStatusFishComponent(){
    await this.setState({
      statusComponent: <FormStatusFish/>
    })
  }
  async resetOrderComponent() {
    await this.setState({
      OrderComponent: <TableOrder addNewOrder={() => this.handleAddNewOrder()}/>,
    })
  }
  async resetFeatureComponent() {
    await this.setState({
      featureComponent: <TableFeature addNewFeature={() => this.handleAddNewFeature()}/>,
    })
  }
  async resetChartStatusComponent() {
    await this.setState({
      chartStatusComponent: <ChartStatus addNewStatus={() => this.handleAddNewStatus()}/>,
    })
  }
  async resetUserComponent() {
    await this.setState({
      customerComponent: <TableCustomer addNewUser={() => this.handleAddNewUser()}/>,
    })
  }
  async resetCateComponent() {
    console.log("resetCateComponent vào nút bấm chọn loại hàng")
    await this.setState({
      cateComponent: <TableCate addNewCate={() => this.handleAddNewCate()}/>,
      // cateComponent: <div>vô vô 7777777</div>
    })

    console.log("resetCateComponent kết thúc")
  }
  async resetEventComponent() {
    await this.setState({
      eventComponent: <TableEvent addNewEvent={() => this.handleAddNewEvent()}/>,
    })
  }
  async resetPromotionComponent() {
    await this.setState({
      eventComponent: <TablePromotion />,
    })
  }
  async resetPondComponent() {
    await this.setState({
      pondComponent: <TablePond addNewPond={() => this.handleAddNewPond()}/>,
    })
  }
  render() {
    return (this.state.user &&
        <section>
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-4 mb-5">
                <div className="customer-sidebar card border-0">
                  <div className="customer-profile"><a className="d-inline-block"><img
                      className="img-fluid rounded-circle customer-image shadow"
                      src="https://cdn2.f-cdn.com/contestentries/1440473/30778261/5bdd02db9ff4c_thumb900.jpg"/></a>
                    <h5>{this.state.user.username}</h5>
                    <p className="text-muted text-sm mb-0">{this.state.user.email}</p>
                  </div>
                  <nav className="list-group customer-nav">
                    <Link className="list-group-item d-flex justify-content-between align-items-center text-decoration-none"
                        to="/dashboard/categoryTypes" onClick={() => this.resetCateComponent()}>
                      <span><svg className="svg-icon svg-icon-heavy me-2"></svg>Quản lý loại hàng</span>
                    </Link>
                    <Link className="list-group-item d-flex justify-content-between align-items-center text-decoration-none"
                          to="/dashboard/events" onClick={() => this.resetEventComponent()}>
                      <span><svg className="svg-icon svg-icon-heavy me-2"></svg>Quản lý sự kiện</span>
                    </Link>
                    <Link className="list-group-item d-flex justify-content-between align-items-center text-decoration-none"
                          to="/dashboard/promotions" onClick={() => this.resetPromotionComponent()}>
                      <span><svg className="svg-icon svg-icon-heavy me-2"></svg>Quản lý khuyến mãi</span>
                    </Link>
                    <Link className="list-group-item d-flex justify-content-between align-items-center text-decoration-none"
                          to="/dashboard/ponds" onClick={() => this.resetPondComponent()}>
                      <span><svg className="svg-icon svg-icon-heavy me-2"></svg>Quản lý kho hàng</span>
                    </Link>
                    <Link
                        className="list-group-item d-flex justify-content-between align-items-center text-decoration-none"
                        to="/dashboard/customers" onClick={() => this.resetUserComponent()}>
                      <span><svg className="svg-icon svg-icon-heavy me-2"></svg>Quản lý khách hàng</span>
                    </Link>
                    <Link
                        className="list-group-item d-flex justify-content-between align-items-center text-decoration-none"
                        to="/dashboard/products" onClick={() => this.resetProductComponent()}>
                      <span><svg className="svg-icon svg-icon-heavy me-2"></svg>Quản lý sản phẩm</span>
                    </Link>
                    <Link
                        className="list-group-item d-flex justify-content-between align-items-center text-decoration-none"
                        to="/dashboard/statusFish" onClick={() => this.resetStatusFishComponent()}>
                      <span><svg className="svg-icon svg-icon-heavy me-2"></svg>Quản lý trạng thái cá</span>
                    </Link>
                    <Link
                        className="list-group-item d-flex justify-content-between align-items-center text-decoration-none"
                        to="/dashboard/orders" onClick={() => this.resetOrderComponent()}>
                      <span><svg className="svg-icon svg-icon-heavy me-2"></svg>Quản lý đơn hàng</span>
                    </Link>
                    <Link
                        className="list-group-item d-flex justify-content-between align-items-center text-decoration-none"
                        to="/dashboard/features" onClick={() => this.resetFeatureComponent()}>
                      <span><svg className="svg-icon svg-icon-heavy me-2"></svg>Quản lý tính năng</span>
                    </Link>
                    <Link
                        className="list-group-item d-flex justify-content-between align-items-center text-decoration-none"
                        to="/dashboard/chartStatus" onClick={() => this.resetChartStatusComponent()}>
                      <span><svg className="svg-icon svg-icon-heavy me-2"></svg>Quản lý báo cáo</span>
                    </Link>
                  </nav>
                </div>
              </div>


              <div className="col-lg-8 col-xl-9">

                <Route exact path="/dashboard/categoryTypes">
                  {this.state.cateComponent}
                </Route>
                <Route exact path="/dashboard/categoryTypes/:id">
                  <FormCate/>
                </Route>
                <Route exact path="/dashboard/events">
                  {this.state.eventComponent}
                </Route>
                <Route exact path="/dashboard/events/:id">
                  <FormEvent/>
                </Route>
                <Route exact path="/dashboard/promotions">
                  {this.state.promotionComponent}
                </Route>


                <Route exact path="/dashboard/ponds">
                  {this.state.pondComponent}
                </Route>
                <Route exact path="/dashboard/ponds/:id">
                  <FormPond/>
                </Route>

                <Route exact path="/dashboard/featureTypes">
                  {this.state.featureComponent}
                </Route>
                <Route exact path="/dashboard/featureTypes/:id">
                  <FormFeature/>
                </Route>


                <Route exact path="/dashboard/products">
                  {this.state.productComponent}
                </Route>
                <Route exact path="/dashboard/products/:id">
                  <FormProduct/>
                </Route>

                <Route exact path="/dashboard/statusFish">
                  {this.state.statusComponent}
                </Route>

                <Route exact path="/dashboard/orders">
                  {this.state.orderComponent}
                </Route>
                <Route exact path="/dashboard/orders/:id">
                  <FormOrder/>
                </Route>

                <Route exact path="/dashboard/features">
                  {this.state.featureComponent}
                </Route>
                <Route exact path="/dashboard/features/:id">
                  <FormFeature/>
                </Route>

                <Route exact path="/dashboard/chartStatus">
                  {this.state.statusChartComponent}
                </Route>

                <Route exact path="/dashboard/customers">
                  {this.state.customerComponent}
                </Route>
                <Route exact path="/dashboard/customers/:id">
                  <FormCustomer/>
                </Route>
              </div>

            </div>
          </div>
        </section>
    )
  }
}
