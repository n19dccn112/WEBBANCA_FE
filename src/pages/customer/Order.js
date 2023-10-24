import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {get} from '../../api/callAPI';
import AuthService from '../../services/AuthService';
import NumberFormat from 'react-number-format';
import pdfMake from "pdfmake";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      datafile: [],
      total: 0,
      status: '',
      order: {},
      orderStatus: [],
      unitDetails: [],
      orderDetails: [],
      listData: []
    }
  }

  componentDidMount() {
    const orderId = this.props.match.params.id;
    const user = AuthService.getCurrentUser();
    if (!user) return;
    get(`orders/${orderId}`)
        .then(res => {
          if (res && res.status === 200) {
            this.setState({
              order: res.data,
            })
            // console.log("orders: ", res.data)
            get(`orderStatus/${res.data.orderStatusId}`)
                .then(res => {
                  if (res !== undefined) {
                    if (res.status === 200) {
                      this.setState({orderStatus: res.data})
                    }
                  }
                })
          }
        })
    get('orderDetails', {"orderId": orderId})
        .then(res => {
          if (res && res.status === 200) {
            this.setState({orderDetails: res.data})
            // console.log("orderDetails: ", res.data)
            let unitDetails = []
            Object.values(res.data).map((value, index) => {
              // console.log(index, ": ", value.unitDetailId)
              get(`unitDetail/${value.unitDetailId}`)
                  .then(res => {
                    if (res && res.status === 200) {
                      unitDetails.push(res.data)
                    }
                  })
            })
            setTimeout(() => this.setState({unitDetails: unitDetails}), 500)
            let listData = []
            let datafile = []
            let total = 0
            setTimeout(() => {
              Object.values(unitDetails).map((unitDetail, index) =>{
                let orderDetail = this.state.orderDetails.filter(item => item.unitDetailId === unitDetail.unitDetailId);
                // console.log("orderDetail: ", orderDetail)
                get(`products/${unitDetail.productId}`)
                    .then(res2 => {
                      if (res2 && res2.status === 200) {
                        // const products = res2.data;
                        // console.log("products 888: ", res2.data)
                        listData.push([res2.data.productId, res2.data.productName, res2.data.images,
                          unitDetail.productPrice, orderDetail[0].amount,
                          (unitDetail.productPrice * orderDetail[0].amount)]);
                        datafile.push([res2.data.productName, unitDetail.productPrice, orderDetail[0].amount,
                          (unitDetail.productPrice * orderDetail[0].amount)]);
                        total += unitDetail.productPrice * orderDetail[0].amount
                      }
                    })
                // let temp = products.reduce((ls, prod) => {
                //   let detail = res.data.filter(item => item.productId === prod.productId);
                //   detail[0]['name'] = prod.categoryName + ' ' + prod.name;
                //   detail[0]['price'] = prod.price;
                //   detail[0]['imageUrl'] = prod.imageUrl;
                //   ls = [...ls, detail[0]];
                //   return ls;
                // }, []);
                // const total = temp.reduce((prev, cur) => prev + cur.price * cur.amount, 0);
                // this.setState({
                //   total: total,
                //   details: temp,
                // })
              })
              setTimeout(() => this.setState({
                datafile: datafile,
                listData: listData,
                total: total
              }), 500)
            }, 500)
          }
        })
  }

  onChangeOutputFile(e){
    pdfMake.fonts = {
      // download default Roboto font from cdnjs.com
      Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      },
    }
    const orderId = this.props.match.params.id;
    const roundedTotal = this.state.total + (this.state.total * 5 / 100) + 30000
    const roundedNumber = Math.floor(roundedTotal / 1000) * 1000;
    console.log(roundedNumber); // Output: 150000
    const title = 'ĐƠN HÀNG #' + orderId;
    const total = 'Tổng hóa đơn             ' + this.state.total + ' vnđ';
    const total2 = 'Tổng hóa đơn             ' + roundedNumber + ' vnđ';
    const documentDefinition = {
      content: [
        { text: title, style: 'header' },
        { text: 'Cửa hàng HUỲNH MY', style: 'shop' },
        {
          table: {
            headerRows: 1,
            widths: [200, 100, 80, 100],
            body: [
              ['Sản phẩm', 'Giá', 'Số lượng', 'Tổng'],
              ...this.state.datafile
            ]
          }
        },
        {text: total, style: 'ordertotalsubfirst'},
        {text: 'Phí vận chuyển            30, 000 vnđ', style: 'ordertotalsub'},
        {text: 'Thuế                              5%', style: 'ordertotalsub'},
        {text: total2, style: 'ordertotalsubbold'},
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          marginBottom: 10,
          alignment: 'center'
        },
        shop: {
          marginLeft: 350,
          marginBottom: 10,
          bold: true
        },
        ordertotal: {
          fontSize: 15,
          bold: true,
          marginLeft: 320,
          marginTop: 40
        },
        ordertotalsubfirst: {
          fontSize: 12,
          marginLeft: 320,
          marginTop: 20
        },
        ordertotalsub: {
          fontSize: 12,
          marginLeft: 320,
          marginTop: 10
        },
        ordertotalsubbold: {
          fontSize: 12,
          marginLeft: 320,
          bold: true,
          marginTop: 10
        }
      }
    };

// Tạo tài liệu PDF từ định nghĩa tài liệu
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

// Xuất tài liệu PDF thành Blob
    pdfDocGenerator.getBlob((blob) => {
      // Tạo URL đến tệp tin
      const fileURL = URL.createObjectURL(blob);

      // Tạo một phần tử a để tạo liên kết tải xuống
      const downloadLink = document.createElement('a');
      downloadLink.href = fileURL;
      const nameFile = 'D://Thuc tap//xuatFile//order#' + orderId + '.pdf';
      downloadLink.download = nameFile; // Đặt tên tệp tin
      downloadLink.innerText = 'Tải xuống'; // Văn bản hiển thị cho liên kết

      // Thêm phần tử a vào trang web
      document.body.appendChild(downloadLink);

      // Bấm vào liên kết để tải xuống tệp tin
      downloadLink.click();

      // Xóa URL và phần tử a sau khi tải xuống
      URL.revokeObjectURL(fileURL);
      downloadLink.remove();
    });
  }



  onChange(e) {
    console.log(this.state.datafile)
    pdfMake.fonts = {
      // download default Roboto font from cdnjs.com
      Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      },
    }
    // const content = {
    //   content: [
    //     {
    //       table: {
    //         // headerRows: 1,
    //         // widths: ['*', '*', '*', '*'],
    //         // body: [
    //           // ['Tiêu đề 1', 'Tiêu đề 2', 'Tiêu đề 3', 'Tiêu đề 4'], // Dòng tiêu đề
    //           this.state.datafile
    //         // ]
    //       }
    //     }
    //   ]
    // };

    const content = {
      content: [
        {
          table: {
            body: this.state.datafile.map(row => row.map(cell => cell.toString()))
          }
        }
      ]
    };
    const pdfDoc = pdfMake.createPdf({content: content});

    // Chuyển đổi PDFDocument thành mảng byte
    pdfDoc.getBuffer((pdfBytes) => {
      // Tạo Blob từ mảng byte PDF
      const blob = new Blob([pdfBytes], {type: 'application/pdf'});

      // Tạo URL cho Blob
      const url = URL.createObjectURL(blob);

      // Tạo một thẻ a và thiết lập thuộc tính href để tải xuống tệp PDF
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'D://Thuc tap//xuatFile//file.pdf';

      // Thêm thẻ a vào tài liệu và kích hoạt sự kiện click để tải xuống
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Xóa URL và thẻ a sau khi tệp đã được tải xuống
      URL.revokeObjectURL(url);
      document.body.removeChild(downloadLink);
    });
  }

  render() {
    return (
        <>
          <section className="hero">
            <div className="container">
              {/* Breadcrumbs */}
              <ol className="breadcrumb justify-content-center">
                {AuthService.getCurrentUser().role === "ROLE_SHOP" &&
                    <li className="breadcrumb-item"><a href="/dashboard/orders">Quay lại</a></li>}
              </ol>
              {/* Hero Content*/}
              <div className="hero-content pb-5 text-center">
                <h1 className="hero-heading">Order #{this.props.match.params.id}</h1>

              </div>
            </div>
          </section>
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-xl-9">
                  <div className="cart">
                    <div className="cart-wrapper">
                      <div className="cart-header text-center">
                        <div className="row">
                          <div className="col-6">Sản phẩm</div>
                          <div className="col-2">Giá</div>
                          <div className="col-2">Số lượng</div>
                          <div className="col-2">Tổng</div>
                        </div>
                      </div>
                      <div className="cart-body">
                        {/*{listData.push([res2.data.productId, res2.data.productName, res2.data.images,*/}
                        {/*  unitDetail.productPrice, orderDetail[0].amount,*/}
                        {/*  (unitDetail.productPrice * orderDetail[0].amount)])}*/}
                        {/*{console.log("this.state.datafile: ", this.state.datafile)}*/}
                        {this.state.listData !== [] && this.state.listData.map((item, index) => (
                            <div className="cart-item" key={index}>
                              <div className="row d-flex align-items-center text-center">
                                <div className="col-6">
                                  <div className="d-flex align-items-center">
                                    <a href={`/products/${item[0]}`}>
                                      <img className="cart-item-img" src={item[2][0]}/>
                                    </a>
                                    <div className="cart-title text-start">
                                      <a className="text-uppercase text-dark" href={`/products/${item[0]}`}>
                                        <strong>{item[1]}</strong>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-2">
                                  <NumberFormat value={item[3]} displayType={'text'} thousandSeparator={true}
                                                suffix='$'/>
                                </div>
                                <div className="col-2">{item[4]}
                                </div>
                                <div className="col-2 text-center"><NumberFormat
                                    value={item[5]} displayType={'text'}
                                    thousandSeparator={true} suffix=' vnđ'/></div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="padding-button-file">
                    {AuthService.getCurrentUser().role === "ROLE_SHOP" && this.state.order.orderStatusId === 1 &&
                        <a className="btn btn-dark btn-sm"
                           onClick={(e) => this.onChangeOutputFile(e)}>Xuất file</a>}
                  </div>
                </div>
                <div className="col-lg-4 col-xl-3">
                  <div className="block mb-5">
                    <div className="block-header">
                      <h6 className="text-uppercase mb-0">Tổng hóa đơn</h6>
                    </div>
                    <div className="block-body bg-light pt-1">
                      <p className="text-sm">Mễn phí giao hàng cho mọi đơn đặt hàng</p>
                      <ul className="order-summary mb-0 list-unstyled">
                        <li className="order-summary-item">
                          <span>Tổng hóa đơn </span>
                          <span>
                            <NumberFormat value={this.state.total} displayType={'text'} thousandSeparator={true}
                                          suffix=' vnđ'/>
                          </span>
                        </li>
                        <li className="order-summary-item">
                          <span>phí vận chuyển</span><span>30,000 vnđ</span></li>
                        <li className="order-summary-item"><span>Thuế</span><span>5%</span></li>
                        <li className="order-summary-item border-0"><span>Tổng</span>
                          <strong className="order-summary-total">
                            <NumberFormat value={this.state.total + (this.state.total*5/100) + 30000} displayType={'text'} thousandSeparator={true}
                                          suffix=' vnđ'/>
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Customer Sidebar*/}
              </div>
            </div>
          </section>
        </>
    )
  }
}

export default withRouter(Order);