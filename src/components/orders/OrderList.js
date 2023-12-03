import React, {Component} from 'react';
import get from '../../api/callAPI';
import Order from "./Order";

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    }
  }
  componentDidMount() {
    get('orders')
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              this.setState({
                orders: res.data
              });

              if (this.props.handleNumberPage !== undefined)
                this.props.handleNumberPage(Math.round(Object.keys(res.data).length/10))
            }
        });
  }
  render() {
    let listOrders = this.state.orders
    return (
        listOrders.map((order, index) => {
          if (index < this.props.maxNumber && index >= this.props.minNumber)
          return (
              <Order
                  id={order.orderId}
                  address={order.orderAddress}
                  phone={order.orderPhone}
                  timeStart={order.orderTimeStart}
                  timeEnd={order.orderTimeEnd}
                  paymentAmount={order.paymentAmount}
                  paymentDate={order.paymentDate}
                  userId={order.userId}
                  paymentMethodId={order.paymentMethodId}
                  orderStatusId={order.orderStatusId}
                  key={order.orderId}
                  isTable={this.props.isTable}
                  deleteOrder={(id) => this.props.deleteOrder(id)}
              />
          )
        })
    );
  }

}
export default OrderList;