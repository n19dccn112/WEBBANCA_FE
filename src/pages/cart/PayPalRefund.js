import React, { Component } from 'react';
import paypal from "@paypal/checkout-server-sdk";
import * as querystring from "querystring";

class PayPalRefund extends Component {
  refund(e) {
    e.preventDefault()
    console.log("Vào hàm")

    const CLIENT_ID = "AcHmmp1u5qqAwgRnmqR_G9fN9j31m_nDFlSognr6caYs9hhmwP3iplIVHOgn9A-bn4bhzNWTYDlwB6JN"
    const SECRET = "EITjFriGknYGZmwHFRIVbX-_8NjN03Wy7ZjVkEVjEtTP2hUdqPQpZpmKOvzGvPvzjiXexQZQxbAT1w8I"
    const orderId = '1C950705RM867771E'

    console.log("Tạo một môi trường xác thực PayPal")
    const environment = new paypal.core.SandboxEnvironment(CLIENT_ID, SECRET);
    const client = new paypal.core.PayPalHttpClient(environment);

    console.log("Tạo yêu cầu hoàn tiền")
    // const request = new paypal.payments.RefundsGetRequest(orderId)
    // const request = new paypal.orders.OrdersRefundRequest(orderId);

    const encodedOrderId = encodeURIComponent(orderId);
    const request = new paypal.payments.RefundsGetRequest(encodedOrderId);
// taken from http://stackoverflow.com/q/17983532/1952991
    querystring.escape = function(str) {
      str = encodeURIComponent(str)
          .replace(/\*/g, '%2A')
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
          .replace(/'/g, '%27');
      return str;
    };


    console.log("Thực hiện yêu cầu hoàn tiền")
    // Call API with your client and get a response for your call
    let createOrder  = async function() {
      let response = await client.execute(request);
      console.log(`Response: ${JSON.stringify(response)}`);

      // If call returns body in response, you can get the deserialized version from the result attribute of the response.
      console.log(`Order: ${JSON.stringify(response.result)}`);
    }
  }

  handleRefund = (e) => {
    e.preventDefault()
    // Gửi yêu cầu hoàn tiền đến PayPal sử dụng orderId và refundAmount
    // Ví dụ: sử dụng fetch API hoặc thư viện HTTP như axios để gửi yêu cầu POST đến API PayPal

    const orderId = '1C950705RM867771E'
    const refundAmount = 10

    const refundData = {
      orderId: orderId,
      refundAmount: refundAmount
    };

    fetch('/api/paypal/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(refundData)
    })
        .then(response => response.json())
        .then(data => {
          // Xử lý kết quả hoàn tiền từ PayPal
          console.log(data);
        })
        .catch(error => {
          // Xử lý lỗi trong quá trình hoàn tiền
          console.error(error);
        });
  }

  render() {
    return (
        <div>
          <button onClick={(e) => this.refund(e)}>Hoàn tiền</button>
        </div>
    );
  }
}

export default PayPalRefund;