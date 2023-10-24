import React, {Component} from 'react'
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {get, post, put} from '../../api/callAPI';
import {withRouter} from 'react-router-dom';
import Message from '../../util/Message';
import CategoryButton from "../productpage/CategoryButton";

class FormProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      haveOnClickType: true,
      type: 'success',
      isShow: false,
      message: '',
      key: 0,
      id: 0,
      name: '',
      descript: '',
      date: '',
      price: 0,
      remain: 0,
      cate: 0,
      features: [],
      currentFeatures: [],
      feaTypes: [],
      imgs: [],
      showProgess: false,
      imageAdd: '',
      product: {},

      unitDetails: [],
      speedGrowths: {},
      lengths: {},
      productPrices: {},
      // unitUnitPrices: {},
      // unitDetailAmounts: {},

      dictUnitDetails: {},
      imagesDetails: [],
      categoryDetails: [],
      categoryId: 0,
      categories: [],
      units: [],
      unitsSelect: [],
      unitsSelectId: [],
      checkIsAnimal: false,

      featureTypes: [],
      featureTypesFeature: {},
      featureSelects: [],
      statusFishDetails: {},
      featureDetails: {},
      // unitDetailAmount: [],

      canSave: true,
      nameOk: false,
      descriptOk: false,
      categoriesOk: false,
      dateOk: false,
      imgsOk: false,
      unitsSelectOk: false,

      statusFishDetailsOk: {},
      featureDetailsOk: {},
      priceOk: {},
      // unitDetailAmountsOk: {},
      speedGrowthsOk: {},
      lengthsOk: {},
    }
    this.statusFishName = ["Sống", "Phát triển", "Không sống", "Khỏe", "Bệnh"]
  }
  hasId(){
    if (this.props.match.params.id) {
      this.setState({id: this.props.match.params.id})
      get(`products/${this.props.match.params.id}`)
          .then(res => {
            if (res !== undefined)
              if (res.status === 200) {
                let checkIsAnimal = res.data.isAnimal === 'true' ? true : false;
                let date = res.data.isAnimal === 'true' ? res.data.importDate : res.data.expirationDate
                this.setState({
                  product: res.data,
                  name: res.data.productName,
                  nameOk: true,
                  checkIsAnimal: checkIsAnimal,
                  descript: res.data.productDescription,
                  descriptOk: true,
                  date: moment(date).toDate(),
                  dateOk: true
                });
              }
          });
      get('unitDetail', {"productId": this.props.match.params.id})
          .then(res => {
            if (res !== undefined) {
              if (res.status === 200) {
                let dictUnitDetails = this.state.dictUnitDetails
                let unitOk = {}
                let speedGrowths = {}
                let lengths = {}
                let productPrices = {}
                // let unitUnitPrices = {}
                // let unitDetailAmounts = {}
                res.data.map((value, index) => {
                  dictUnitDetails[value.unitId] = value
                  unitOk[value.unitId] = true
                  speedGrowths[value.unitId] = value.speedGrowth
                  lengths[value.unitId] = value.length
                  productPrices[value.unitId] = value.productPrice
                  // unitUnitPrices[value.unitId] = value.unitUnitPrice
                  // unitDetailAmounts[value.unitId] = value.unitDetailAmount
                })
                this.setState({
                  unitDetails: res.data,
                  dictUnitDetails: dictUnitDetails,

                  speedGrowths: speedGrowths,
                  lengths: lengths,
                  productPrices: productPrices,
                  // unitUnitPrices: unitUnitPrices,
                  // unitDetailAmounts: unitDetailAmounts,

                  speedGrowthsOk: unitOk,
                  lengthsOk: unitOk,
                  priceOk: unitOk,
                  // unitUnitPricesOk: unitOk,
                  // unitDetailAmountsOk: unitOk,
                });


                let statusFishDetails = {}
                let statusFishDetailsOk = {}
                let finish = 0
                // console.log("unitDetails: ", res.data)
                res.data.map((value, index) => {
                   get('statusFishDetail', {"unitDetailId": value.unitDetailId})
                      .then(res => {
                        if (res !== undefined)
                          if (res.status === 200) {
                            res.data.map((valueD, indexD) => {
                              statusFishDetails[[value.unitId, value.productId, valueD.statusFishId]] = true
                              // console.log(indexD, ": ", valueD.statusFishId)
                            })
                            // console.log(index, " res.data status fish: ", res.data)
                          }
                      });
                  finish = finish + 1
                  statusFishDetailsOk[value.unitId] = true
                })
                setTimeout(
                    () => {
                      // console.log("res.data, statusFishDetails: 888888 ", res.data, finish)
                      if (Object.keys(res.data).length === finish){
                        // console.log("res.data, statusFishDetails: 88888 9999", res.data, statusFishDetails)
                        this.setState({
                          statusFishDetails: statusFishDetails,
                          statusFishDetailsOk: statusFishDetailsOk})
                      }
                    },
                    1000)
                // console.log("statusFishDetails: ", statusFishDetails)

                  let unitsSelect = this.state.unitsSelect;
                  let unitsSelectId = this.state.unitsSelectId
                  res.data.map((value, index) => {
                    // console.log(index, "value.unitId: ", value.unitId)
                    get(`unit/${value.unitId}`)
                        .then(res => {
                          if (res !== undefined) {
                            if (res.status === 200) {
                              // console.log(index, "value.unitId res.data: ", res.data)
                              unitsSelect.push(res.data);
                              unitsSelectId.push(res.data.unitId);
                              // console.log(index, "value.unitId unitsSelect: ", unitsSelect)
                            }
                          }
                        });
                  });

                setTimeout(() => {
                  if (Object.keys(res.data).length === unitsSelect.length) {
                    // console.log("Object.keys(res.data).length === unitsSelect.length: kkkkkkkkkkk",
                    //     res.data, unitsSelect)
                    this.setState({
                      unitsSelect: unitsSelect,
                      unitsSelectId: unitsSelectId,
                      unitsSelectOk: true
                    });
                  }
                  }, 1000)


                let featureDetails = {}
                let featureDetailsOk = {}
                finish = 0
                // console.log("featureDetail: ", res.data)
                res.data.map((value, index) => {
                  get('featureDetails', {"unitDetailId": value.unitDetailId})
                      .then(res => {
                        if (res !== undefined)
                          if (res.status === 200) {
                            // console.log(index, " 1111 res.data: ", res.data)
                            res.data.map((valueD, indexD) => {
                              featureDetails[[value.unitId, value.productId, valueD.featureId]] = true;
                            })
                          }
                      });
                  finish = finish + 1
                  featureDetailsOk[value.unitId] = true
                })

                setTimeout(
                    () => {
                      // console.log("res.data, statusFishDetails: 888888 ", res.data, finish)
                      if (Object.keys(res.data).length === finish){
                        // console.log("res.data, statusFishDetails: 88888 9999", res.data, featureDetails)
                        this.setState({
                          featureDetails: featureDetails,
                          featureDetailsOk: featureDetailsOk
                        });
                      }
                    },
                    1000)
                // console.log("featureDetails: ", featureDetails)
              }
            }
          })
      get('imagesDetail', {"productId": this.props.match.params.id})
          .then(res => {
            if (res !== undefined) {
              if (res.status === 200) {
                this.setState({
                  imagesDetails: res.data
                });

                let imgs = this.state.imgs
                res.data.map((value, index) => (
                    get(`images/${value.imageId}`)
                        .then(res => {
                          if (res !== undefined) {
                            if (res.status === 200) {
                              imgs.push(res.data.url)
                            }
                          }
                        })
                ))
                this.setState({
                  imgs: imgs,
                  imgsOk: true
                });
              }
            }
          })
      get('categoryDetail', {"productId": this.props.match.params.id})
          .then(res => {
            if (res !== undefined) {
              if (res.status === 200) {
                this.setState({
                  categoryDetails: res.data
                });

                let categories = this.state.categories
                res.data.map((value, index) => (
                    get(`categories/${value.categoryId}`)
                        .then(res => {
                          if (res !== undefined) {
                            if (res.status === 200) {
                              categories.push(res.data)
                            }
                          }
                        })
                ))
                this.setState({
                  categories: categories,
                  categoriesOk: true
                });
              }
            }
          })
    }
  }
  componentDidMount() {
    get('unit')
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                units: res.data
              });
            }
          }
        })
    get('featureTypes')
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                featureTypes: res.data
              });
              let features = []
              res.data.map((value, index) => (
                  get('features', {"featureTypeId": value.featureTypeId})
                      .then(resf => {
                        if (resf !== undefined) {
                          if (resf.status === 200) {
                            let featureTypesFeature = this.state.featureTypesFeature
                            featureTypesFeature[value.featureTypeId] = resf.data
                            this.setState({
                              featureTypesFeature: featureTypesFeature,
                            });
                            resf.data.map((f, index) => (features.push(f)))
                          }
                        }
                      })
              ))
              setTimeout(() => this.setState({features: features}), 1000)
            }
          }
        })
    this.hasId()
  }
  imageAdd(e) {
    e.preventDefault()
    this.setState((prevState) => ({
      imgs: [...prevState.imgs, ""]
    }));
    const newInput = <input className="form-control" name="image"
                            value="" onChange={(e) => this.imgOnChange(e)} type="text" />;
    this.setState({
      imageInputs: newInput,
    });
  }
  imgOnChange(e) {
    const images = []
    this.state.imgs.map((value, index) =>
        (index === parseInt(e.target.id) ? images.push(e.target.value) : images.push(value)));
    this.setState({
      imgs: images,
      imgsOk: true
    })
    let hasImage = false
    images.map((value, index) => {
      if (value !== '') {
        hasImage = true
      }
    })
    if (Object.keys(images).length === 0 || !hasImage){
      this.setState({
        message: `Hình ảnh của sản phẩm không được trống`,
        type: 'danger',
        imgsOk: false,
        isShow: true
      });
    }
  }
  idOnChange(e) {
    this.setState({
      id: this.state.id,
    })
  }
  descOnChange(e) {
    this.setState({
      descript: e.target.value,
      descriptOk: true
    })
    if (e.target.value === ''){
      this.setState({
        message: `Chi tiết sản phẩm không được trống`,
        type: 'danger',
        isShow: true,
        descriptOk: false
      });
      // console.log('Chi tiết sản phẩm không được trống')
    }
  }
  nameOnChange(e) {
    this.setState({
      name: e.target.value,
      nameOk: true
    })
    if (e.target.value === ''){
      // console.log("tên sp k dc trong")
      this.setState({
        message: `Tên sản phẩm không được trống`,
        type: 'danger',
        nameOk: false,
        isShow: true
      });
    }
  }
  priceOnChange(e, unitId) {
    let productPrices = this.state.productPrices
    productPrices[unitId] = e.target.value
    this.setState({
      productPrices: productPrices,
    })
    let priceOk = this.state.priceOk
    if (e.target.value >= 1000) {
      priceOk[unitId] = true
      this.setState({
        priceOk: priceOk
      })
    }else {
      priceOk[unitId] = false
      this.setState({
        priceOk: priceOk
      })
    }
  }
  async handleCheckFeature(e, unitId, productId, featureId) {
    let featureDetails = this.state.featureDetails
    let featureDetailsOk = this.state.featureDetailsOk

    console.log("featureDetails: trước ", featureDetails)

    if (featureDetails[[unitId, productId, featureId]] !== undefined &&
        featureDetails[[unitId, productId, featureId]] === true){
      featureDetails[[unitId, productId, featureId]] = false
      featureDetailsOk[unitId] = false
    }else {
      featureDetails[[unitId, productId, featureId]] = true
      featureDetailsOk[unitId] = true
    }
    this.setState({
      featureDetails: featureDetails,
      featureDetailsOk: featureDetailsOk
    })

    console.log("featureDetails: sau ", featureDetails)
  }
  post(paramsProduct){
    post('products', paramsProduct)
        .then(res => {
              if (res && res.status === 201){
                // console.log("post product thành công: ", this.state.unitsSelectId)

                get('products/name', {"name": paramsProduct['productName'] + ''})
                    .then(res => {
                          if (res !== undefined)
                            if (res.status === 200) {
                              let id = res.data.productId;
                              this.state.unitsSelectId.forEach(unitId => {
                                let paramUnitDetail = {}
                                paramUnitDetail['unitId'] = unitId
                                paramUnitDetail['productId'] = id
                                paramUnitDetail['speedGrowth'] = this.state.speedGrowths[unitId]
                                paramUnitDetail['productPrice'] = this.state.productPrices[unitId]
                                paramUnitDetail['length'] = this.state.lengths[unitId]
                                paramUnitDetail['unitUnitPrice'] = 'vnđ'
                                // paramUnitDetail['unitDetailAmount'] = this.state.unitDetailAmounts[unitId]

                                console.log("post product thành công: paramUnitDetail", paramUnitDetail);
                                this.setState({
                                  message: `Lưu sản phẩm thành công`,
                                  type: 'success',
                                  isShow: true,
                                  dateOk: false
                                });
                                post('unitDetail', paramUnitDetail)
                                    .then(res => {
                                          if (res && res.status === 201) {
                                            console.log("tạo unit thành công")
                                            get('unitDetail/name', {"productId": id, "unitId": unitId})
                                                .then(res => {
                                                  if (res !== undefined)
                                                    if (res.status === 200) {
                                                      console.log("unitDetail mới lưu: ", res.data)
                                                      let unitDId = res.data.unitDetailId
                                                      let productId = this.state.id
                                                      this.state.features.forEach(f => {
                                                        let featureId = f.featureId;
                                                        let featureDetails = this.state.featureDetails
                                                        console.log("unitId, productId, featureId: ", unitId, productId, featureId,
                                                            featureDetails[[unitId, productId, featureId]] )
                                                        if (featureDetails[[unitId, productId, featureId]] !== undefined
                                                            && featureDetails[[unitId, productId, featureId]] === true){
                                                          let paramFeatureDetail = {}
                                                          paramFeatureDetail['unitDetailId'] = unitDId;
                                                          paramFeatureDetail['featureId'] = f.featureId;
                                                          console.log("paramFeatureDetail: ", paramFeatureDetail)
                                                          post(`featureDetails`, paramFeatureDetail)
                                                              .then(res => {
                                                                    if (res && res.status === 201)
                                                                      console.log("tạo tính năng thành công", res.data)
                                                                  },
                                                                  err => {
                                                                    err.response && this.setState({
                                                                      message: `${err.response.data.error} ${err.response.data.message}`,
                                                                      type: 'danger',
                                                                    });
                                                                  })
                                                        }
                                                      })
                                                      console.log("this.statusFishName: ", this.statusFishName, this.state.statusFishDetails)
                                                      this.statusFishName.map((value, index) => {
                                                        let statusFishDetails = this.state.statusFishDetails
                                                        console.log("statusFishDetails[[unitId, productId, index]], unitId, productId, index: ",
                                                            statusFishDetails[[unitId, productId, index]], unitId, productId, index)
                                                        if (statusFishDetails[[unitId, productId, index + 1]] !== undefined
                                                            && statusFishDetails[[unitId, productId, index+1]] === true){
                                                          let paramStatusFishDetail = {}
                                                          paramStatusFishDetail['statusFishId'] = index + 1;
                                                          paramStatusFishDetail['unitDetailId'] = unitDId;

                                                          console.log("paramStatusFishDetail: ", paramStatusFishDetail)
                                                          post(`statusFishDetail`, paramStatusFishDetail)
                                                              .then(res => {
                                                                    if (res && res.status === 201)
                                                                      console.log("tạo trạng thái thành công", res.data)
                                                                  },
                                                                  err => {
                                                                    err.response && this.setState({
                                                                      message: `${err.response.data.error} ${err.response.data.message}`,
                                                                      type: 'danger',
                                                                    });
                                                                  })
                                                        }
                                                      })
                                                    }
                                                });
                                          }
                                        },
                                        err => {
                                          err.response && this.setState({
                                            message: `${err.response.data.error} ${err.response.data.message}`,
                                            type: 'danger',
                                          });
                                        })
                              })
                              let paramImage = {}
                              paramImage['productId'] = id;
                              this.state.imgs.forEach(img => {
                                paramImage['url'] = img;
                                post('images', paramImage)
                                    .then(res => {
                                          if (res && res.status === 201)
                                            console.log("tạo image thành công")
                                        },
                                        err => {
                                          err.response && this.setState({
                                            message: `${err.response.data.error} ${err.response.data.message}`,
                                            type: 'danger',
                                          });
                                        })
                              })

                              let paramCategory = {}
                              paramCategory['productId'] = id;

                              this.state.categories.forEach(category => {
                                paramCategory['categoryId'] = category.categoryId;
                                post(`categoryDetail`, paramCategory)
                                    .then(res => {
                                          if (res && res.status === 201)
                                            console.log("tạo loại hàng thành công")
                                        },
                                        err => {
                                          err.response && this.setState({
                                            message: `${err.response.data.error} ${err.response.data.message}`,
                                            type: 'danger',
                                          });
                                        })
                              })
                            }
                        }
                    )
              }
            },
            err => {
              err.response && this.setState({
                message: `${err.response.data.error} ${err.response.data.message}`,
                type: 'danger',
              });
            })
    console.log("post products")
  }
  put(e, paramsProduct) {
    e.preventDefault()
    put(`products/${this.state.id}`, paramsProduct)
        .then(res => {
              if (res && res.status === 202){
                console.log("put product thành công")
                this.setState({
                  message: `Sửa sản phẩm thành công`,
                  type: 'success',
                  isShow: true,
                  dateOk: false
                });
                this.state.unitsSelectId.forEach(unitId => {
                  let paramUnitDetail = {}
                  paramUnitDetail['unitId'] = unitId
                  paramUnitDetail['productId'] = this.state.id
                  paramUnitDetail['speedGrowth'] = this.state.speedGrowths[unitId] === undefined ?
                      this.state.dictUnitDetails[unitId].speedGrowth : this.state.speedGrowths[unitId]
                  paramUnitDetail['productPrice'] = this.state.productPrices[unitId] === undefined ?
                      this.state.dictUnitDetails[unitId].productPrice : this.state.productPrices[unitId]
                  paramUnitDetail['length'] = this.state.lengths[unitId] === undefined ?
                      this.state.dictUnitDetails[unitId].length : this.state.lengths[unitId]
                  paramUnitDetail['unitUnitPrice'] = 'vnđ'
                  // paramUnitDetail['unitDetailAmount'] = this.state.dictUnitDetails[unitId].unitDetailAmount

                  post(`unitDetail`, paramUnitDetail)
                      .then(res => {
                            if (res && res.status === 201) {
                              console.log("to unit thành công")
                              get('unitDetail/name', {"productId": this.state.id, "unitId": unitId})
                                  .then(res => {
                                    if (res !== undefined)
                                      if (res.status === 200) {
                                        console.log("unitDetail mới lưu + features", res.data, this.state.features)
                                        let unitDId = res.data.unitDetailId
                                        let productId = this.state.id
                                        this.state.features.forEach(f => {
                                          let featureId = f.featureId;
                                          let featureDetails = this.state.featureDetails

                                          if (featureDetails[[unitId, productId, featureId]] !== undefined && featureDetails[[unitId, productId, featureId]] === true){
                                            let paramFeatureDetail = {}
                                            paramFeatureDetail['unitDetailId'] = unitDId;
                                            paramFeatureDetail['featureId'] = f.featureId;
                                            post(`featureDetails`, paramFeatureDetail)
                                                .then(res => {
                                                      if (res && res.status === 201)
                                                        console.log("tạo tính năng thành công")
                                                    },
                                                    err => {
                                                      err.response && this.setState({
                                                        message: `${err.response.data.error} ${err.response.data.message}`,
                                                        type: 'danger',
                                                      });
                                                    })
                                          }
                                        })
                                        console.log("statusFishName ", this.statusFishName)

                                        this.statusFishName.map((value, index) => {
                                          let statusFishDetails = this.state.statusFishDetails
                                          if (statusFishDetails[[unitId, productId, index + 1]] !== undefined && statusFishDetails[[unitId, productId, index+1]]){
                                            let paramStatusFishDetail = {}
                                            paramStatusFishDetail['statusFishId'] = index + 1;
                                            paramStatusFishDetail['unitDetailId'] = unitDId;

                                            console.log("paramStatusFishDetail: ", paramStatusFishDetail)
                                            post(`statusFishDetail`, paramStatusFishDetail)
                                                .then(res => {
                                                      if (res && res.status === 201)
                                                      console.log("Tạo trạng thái thành công!")
                                                    },
                                                    err => {
                                                      err.response && this.setState({
                                                        message: `${err.response.data.error} ${err.response.data.message}`,
                                                        type: 'danger',
                                                      });
                                                    })
                                          }
                                        })
                                      }
                                  });
                            }
                          },
                          err => {
                            err.response && this.setState({
                              message: `${err.response.data.error} ${err.response.data.message}`,
                              type: 'danger',
                            });
                          })
                })

                let paramImage = {}
                paramImage['productId'] = this.state.id;
                this.state.imgs.forEach(img => {
                  paramImage['url'] = img;
                  post('images', paramImage)
                      .then(res => {
                            if (res && res.status === 201)
                              console.log("tạo image thành công")
                          },
                          err => {
                            err.response && this.setState({
                              message: `${err.response.data.error} ${err.response.data.message}`,
                              type: 'danger',
                            });
                          })
                })

                let paramCategory = {}
                paramCategory['productId'] = this.state.id;

                this.state.categories.forEach(category => {
                  paramCategory['categoryId'] = category.categoryId;
                  post(`categoryDetail`, paramCategory)
                      .then(res => {
                            if (res && res.status === 201)
                              console.log("tạo loại hàng thành công")
                          },
                          err => {
                            err.response && this.setState({
                              message: `${err.response.data.error} ${err.response.data.message}`,
                              type: 'danger',
                            });
                          })
                })
              }
            },
            err => {
              err.response && this.setState({
                message: `${err.response.data.error} ${err.response.data.message}`,
                type: 'danger',
              });
            })
    console.log("put products")
  }
  async doCreate(e) {
    e.preventDefault()
    let unitOk = true
    this.state.unitsSelect.forEach(unit => {
      unitOk = this.state.statusFishDetailsOk[unit.unitId] ? true : unitOk
      unitOk = this.state.featureDetailsOk[unit.unitId] ? true : unitOk
      unitOk = this.state.priceOk[unit.unitId] ? true : unitOk
      // unitOk = this.state.unitDetailAmountsOk[unit.unitId] ? true : unitOk
      unitOk = this.state.speedGrowthsOk[unit.unitId] ? true : unitOk
      unitOk = this.state.lengthsOk[unit.unitId] ? true : unitOk
    })
    console.log(this.state.nameOk, this.state.descriptOk, this.state.categoriesOk, this.state.dateOk,
        this.state.imgsOk, this.state.unitsSelectOk, unitOk)
    if (!(this.state.nameOk && this.state.descriptOk && this.state.categoriesOk && this.state.dateOk &&
        this.state.imgsOk && this.state.unitsSelectOk && unitOk)) {
      this.setState({
        canSave: false,
        message: `Điền vào thông tin bắt buộc`,
        type: 'danger',
        isShow: true,
      })
    }
    else {
      if (!this.state.checkIsAnimal && this.state.date < new Date()) {
        console.log("Ngày hết hạn không sớm hơn ngày hôm nay")
        this.setState({
          message: `Ngày hết hạn không sớm hơn ngày hôm nay`,
          type: 'danger',
          isShow: true,
          dateOk: false
        });
      } else if (Object.keys(this.state.imgs).length === 0) {
        console.log("Hình ảnh của sản phẩm không được trống")
        this.setState({
          message: `Hình ảnh của sản phẩm không được trống`,
          type: 'danger',
          isShow: true,
          imgsOk: false
        });
      } else if (Object.keys(this.state.categories).length === 0) {
        console.log("Loại của sản phẩm chọn ít nhất 1 cái")
        this.setState({
          message: `Loại của sản phẩm chọn ít nhất 1 cái`,
          type: 'danger',
          isShow: true,
          categoriesOk: false
        });
      } else if (Object.keys(this.state.unitsSelect).length === 0) {
        console.log("Đơn vị của sản phẩm chọn ít nhất 1 cái")
        this.setState({
          message: `Đơn vị của sản phẩm chọn ít nhất 1 cái`,
          type: 'danger',
          isShow: true,
          unitsSelectOk: false
        });
      } else {
        let paramsProduct = {};
        paramsProduct['productName'] = this.state.name;
        paramsProduct['productDescription'] = this.state.descript;
        paramsProduct['isAnimal'] = this.state.checkIsAnimal ? 'true': 'false'
        const date = moment(this.state.date).format('YYYY-MM-DD');

        if (this.state.isAnimal){
          paramsProduct['importDate'] = date;
        }else{
          paramsProduct['expirationDate'] = date;
        }

        if (this.state.id !== 0) {
          this.put(e, paramsProduct)
        } else {
          console.log("post products")
          this.post(paramsProduct)
        }
        await this.setState({
          isShow: !this.setState.isShow,
        })
      }
    }
  }
  async handleFilterByCate(id) {
    console.log("handleFilterByCate: ", id)
    let confix = false
    this.state.categories.map((value, index) => {
      if (value.categoryId === id){
        confix = true
        return
      }
    })
    if (!confix)
    await get(`categories/${id}`)
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              let categories = this.state.categories
              categories.push(res.data)
              this.setState({
                categories: categories,
                categoriesOk: true
              });
            }
          }
        })
  }
  handleCheckIsAnimal(){
    this.setState({
      checkIsAnimal: !this.state.checkIsAnimal
    })
  }
  deleteCate(index) {
    let categories = [...this.state.categories];
    categories.splice(index, 1);
    const categoriesOk = Object.keys(categories).length === 0 ? false : true
    this.setState({
      categories: categories,
      categoriesOk: categoriesOk
    });
  }
  async handleCheckUnit(e, unit, id){
    // console.log("handleCheckUnit: ", id, this.state.unitsSelect)
    let unitsSelect = this.state.unitsSelect
    let unitsSelectId = this.state.unitsSelectId
    let unitDelete = []
    let unitsSelectIdDelete = []
    let confix = false
    unitsSelect.forEach(object => {
      confix = object === unit ? true : confix;
      let a = object !== unit ? unitDelete.push(object) : ''
      let b = object !== unit ? unitsSelectIdDelete.push(object.unitId) : ''
    })

    // console.log("unitsSelectIdDelete: ", unitsSelectId, unitsSelectIdDelete)
    if (confix) {
      this.setState({
        unitsSelect: unitDelete,
        unitsSelectId: unitsSelectIdDelete
      })
      if(unitDelete.length !== 0){
        this.setState({unitsSelectOk: true,})
      }
      else {
        this.setState({unitsSelectOk: false})
      }
    }
    if (!confix) {
      unitsSelect.push(unit)
      unitsSelectId.push(id)
      this.setState({
        unitsSelect: unitsSelect,
        unitsSelectId: unitsSelectId
      })
      if(unitsSelect.length !== 0){
        this.setState({unitsSelectOk: true})
      }
      else {
        this.setState({unitsSelectOk: false})
      }
    }
    if (this.state.id) {
      // console.log("vào if id")
      await get('unitDetail', {"productId": this.state.id, "unitId": id})
          .then(res => {
            if (res !== undefined) {
              if (res.status === 200) {
                let unitDetails = this.state.unitDetails
                unitDetails.push(res.data)
                let dictUnitDetails = this.state.dictUnitDetails
                unitDetails.map((value, index) => {
                  dictUnitDetails[value.unitId] = value
                })

                let oK = {}
                let speedGrowths = {}
                let lengths = {}
                let productPrices = {}
                // let unitUnitPrices = {}
                // let unitDetailAmounts = {}
                res.data.map((value, index) => {
                  oK[value.unitId] = true
                  speedGrowths[value.unitId] = value.speedGrowth
                  lengths[value.unitId] = value.length
                  productPrices[value.unitId] = value.productPrice
                  // unitUnitPrices[value.unitId] = 'vnd'
                  // unitDetailAmounts[value.unitId] = value.unitDetailAmount
                })
                this.setState({
                  unitDetails: unitDetails,
                  dictUnitDetails: dictUnitDetails,

                  speedGrowths: speedGrowths,
                  lengths: lengths,
                  productPrices: productPrices,
                  // unitUnitPrices: unitUnitPrices,
                  // unitDetailAmounts: unitDetailAmounts,

                  speedGrowthsOk: oK,
                  lengthsOk: oK,
                  priceOk: oK,
                  // unitUnitPricesOk: oK,
                  // unitDetailAmountsOk: oK,
                });
                // console.log("this.state.dictUnitDetails: ", id, res.data, this.state.dictUnitDetails, this.state.dictUnitDetails[id])
              }
            }
          })
     }
      // console.log("this.state.dictUnitDetails hết hàm: ", id, this.state.dictUnitDetails, this.state.dictUnitDetails[id])
  }
  handleCheckStatusFish(e, unitId, productId, index){
    let statusFishDetails = this.state.statusFishDetails;
    let statusFishDetailsOk = this.state.statusFishDetailsOk;

    console.log("statusFishDetails: trước ", statusFishDetails, unitId, productId, index, statusFishDetails[[unitId, productId, index]])
    if (statusFishDetails[[unitId, productId, index]] !== undefined &&
        statusFishDetails[[unitId, productId, index]] === true){
      statusFishDetails[[unitId, productId, index]] = false
      statusFishDetailsOk[unitId] = false
    }else {
      statusFishDetails[[unitId, productId, index]] = true
      statusFishDetailsOk[unitId] = true
    }
    this.setState({
      statusFishDetails: statusFishDetails,
      statusFishDetailsOk: statusFishDetailsOk
    })
    console.log("statusFishDetails: sau ", statusFishDetails)
  }
  // amountOnChange(e, unitId){
  //   if (e.target.value >= 0) {
  //     let unitDetailAmounts = this.state.unitDetailAmounts
  //     unitDetailAmounts[unitId] = e.target.value
  //
  //     let unitDetailAmountsOk = this.state.unitDetailAmountsOk
  //     unitDetailAmountsOk[unitId] = true
  //     this.setState({
  //       unitDetailAmounts: unitDetailAmounts,
  //       unitDetailAmountsOk: unitDetailAmountsOk
  //     })
  //   }
  // }
  speedGrowthOnChange(e, unitId){
    console.log(e.target.value, unitId)
    if (e.target.value >= 0) {
      let speedGrowths = this.state.speedGrowths
      speedGrowths[unitId] = e.target.value

      let speedGrowthsOk = this.state.speedGrowthsOk
      speedGrowthsOk[unitId] = true
      console.log("speedGrowths: ", speedGrowths)
      this.setState({
        speedGrowths: speedGrowths,
        speedGrowthsOk: speedGrowthsOk
      })
    }
  }
  lengthOnChange(e, unitId){
    if (e.target.value >= 0) {
      let lengths = this.state.lengths
      lengths[unitId] = e.target.value
      let lengthsOk = this.state.lengthsOk
      lengthsOk[unitId] = true
      console.log("length: ", lengths)
      this.setState({
        lengths: lengths,
        lengthsOk: lengthsOk
      })
    }
  }
  dateOnChange(date) {
    this.setState({
      date: date,
      dateOk: true
    })
    if (date === '') {
      this.setState({
        message: `Ngày hết hạn/ nhập hàng không được trống`,
        type: 'danger',
        isShow: true,
        dateOk: false
      });
    }
  }
  filterByCateType(e){
    e.preventDefault()
  }
  unitPriceOnChange(e) {
  }
  render() {
    return (
        <>
          <div className="block mb-5">
            <div className="block-header"><strong
                className="text-uppercase">{this.state.id ? 'Sửa' : 'Thêm'} Sản phẩm</strong></div>
            <div className="block-body">
              <form>
                <div className="row">
                  {this.props.match.params.id && (<div className="col-sm-4">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="productId">Id</label>
                      <input className="form-control" name="productId" id="productId"
                             value={this.state.id} onChange={(e) => this.idOnChange(e)}
                             type="text" readOnly={true}/>
                    </div>
                  </div>)}
                  <div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="productname">
                        Tên <span style={{color: "red"}}>{(!this.state.canSave && !this.state.nameOk) ? '*' : ''}</span>
                      </label>
                      <input className="form-control" name="productname" id="productname" value={this.state.name}
                             onChange={(e) => this.nameOnChange(e)} type="text"/>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="mb-4">
                      <label className="form-label text-center" htmlFor="checkBoxIsAnimal">Động vật</label>
                      <input className="form-control form-check-input mt-2"
                             id="checkBoxIsAnimal" type="checkbox"
                             checked={this.state.checkIsAnimal} onChange={() => this.handleCheckIsAnimal()}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="productdesc">
                        Chi tiết <span style={{color: "red"}}>{(!this.state.canSave && !this.state.descriptOk) ? '*' : ''}</span>
                      </label>
                      <textarea className="form-control" name="productdesc" value={this.state.descript}
                                onChange={(e) => this.descOnChange(e)} id="productdesc"/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="productdate">
                        Ngày hết hạn/ nhập hàng <span style={{color: "red"}}>{(!this.state.canSave && !this.state.dateOk) ? '*' : ''}</span>
                      </label>
                      <br />
                      <DatePicker
                          className="form-control"
                          name="productdate"
                          selected={this.state.date}
                          onChange={(date) => this.dateOnChange(date)}
                          id="productdate"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="block-header mb-4">
                    <strong className="text-uppercase">
                      Danh mục <span style={{color: "red"}}>{(!this.state.canSave && !this.state.categoriesOk) ? '*' : ''}</span>
                    </strong>
                  </div>
                  <div className="col-sm-5">
                    <div className="mb-4">
                      <CategoryButton canClick = {0} filterByCate={(id) => this.handleFilterByCate(id)}
                                      filterByCateType={(e) => this.filterByCateType(e)}/>
                    </div>
                  </div>
                  <div className="col-sm-7">
                    <div className="mb-4">
                      {Object.keys(this.state.categories).length !== 0 &&
                          <div className="title-small">Chọn loại hàng:<i><br/></i>
                            {this.state.categories.map((value, index) => (
                                <div className="product-list1" key={value.categoryId}>
                                  <span className="category-name" style={{fontSize: "20px", color: "darkred"}}>{value.categoryName}
                                    <i className="" style={{marginLeft: "20px", color: "black"}} key={`'DeleteProduct'${this.state.id}`}
                                       onClick={(e) => this.deleteCate(index)}>
                                      <i className="fas fa-trash"></i>
                                    </i>
                                  </span >
                                </div>
                            ))}
                          </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="block-header mb-4">
                      <strong className="text-uppercase">
                        Ảnh <span style={{color: "red"}}>{(!this.state.canSave && !this.state.imgsOk) ? '*' : ''}</span>
                      </strong>
                    </div>
                    <div className="mb-4">
                      {this.state.imgs.map((value, index) => (
                          <div className="row">
                            <div className="col-sm-2">
                              <div className="mb-1">
                                <img src={value} style={{width: '100px', height: '40px'}} alt="product"/>
                              </div>
                            </div>
                            <div className="col-sm-10">
                              <div className="mb-1">
                                <input className="form-control " name="image" id={index} value={value}
                                       onChange={(e) => this.imgOnChange(e)} type="text"/>
                              </div>
                            </div>
                          </div>
                    ))}
                      {this.state.imageAdd && <div key={(this.state.imgs.length + 1)}>{this.state.imageAdd}</div>}
                      <button className="add-button-product" onClick={(e) => this.imageAdd(e)}>
                        <i className="fas fa-plus-circle"></i> THÊM ẢNH
                      </button>
                    </div>
                  </div>

                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="mb-4">
                      <div className="block-header mb-4">
                        <strong className="text-uppercase">
                          Đơn vị <span style={{color: "red"}}>{(!this.state.canSave && !this.state.unitsSelectOk) ? '*' : ''}</span>
                        </strong>
                      </div>
                      {this.state.units.map((value, index) => (
                          <div className={`background-unit-product${index}`}>
                            <label key={value.unitId} className="checkbox-container">
                              <input id={`checkBoxUnit${value.unitId}`} type="checkbox"
                                  checked={this.state.unitsSelectId.includes(value.unitId)}
                                  onChange={(e) => this.handleCheckUnit(e, value,  value.unitId)}/>
                              {value.unitName}</label>
                            {this.state.unitsSelectId.includes(value.unitId) &&
                              <div style={{marginLeft: "20px"}}>
                                <div className="row">
                                  <div className="col-sm-8">
                                    <div className="mb-3">
                                      <label className="form-label" htmlFor="price">
                                        Giá <span style={{color: "red"}}>
                                        {(!this.state.canSave && !this.state.priceOk[value.unitId]) ? '*' : ''}</span>
                                      </label>
                                      {/*{console.log("giá: ", this.state.dictUnitDetails)}*/}
                                      <input className="form-control" name="price" id="price"
                                             value={(this.state.id !== 0 && this.state.dictUnitDetails[value.unitId]
                                                 && this.state.productPrices[value.unitId] === undefined) ?
                                                 this.state.dictUnitDetails[value.unitId].productPrice:
                                                 this.state.productPrices[value.unitId] ? this.state.productPrices[value.unitId] : ""}
                                             type="number" onChange={(e) => this.priceOnChange(e, value.unitId)} />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="mb-4">
                                      <label className="form-label" htmlFor="unitprice">Đơn vị giá</label>
                                      <select className="form-control" name="unitprice" id="unitprice"
                                              onChange={(e) => this.unitPriceOnChange(e)}>
                                        <option value="vnđ">vnđ</option>
                                      </select>
                                    </div>
                                  </div>
                                {/*  <div className="col-sm-6">*/}
                                {/*    <div className="mb-4">*/}
                                {/*      /!*{console.log("unitDetailAmountsOk: ", this.state.unitDetailAmountsOk, !this.state.canSave && !this.state.unitDetailAmountsOk[value.unitId],*!/*/}
                                {/*      /!*    this.state.canSave, this.state.unitDetailAmountsOk[value.unitId])}*!/*/}
                                {/*      <label className="form-label" htmlFor="amount">*/}
                                {/*        Số lượng <span style={{color: "red"}}>*/}
                                {/*        {(!this.state.canSave && !this.state.unitDetailAmountsOk[value.unitId]) ? '*' : ''}</span>*/}
                                {/*      </label>*/}
                                {/*      <input className="form-control" name="amount" id="amount"*/}
                                {/*             value={(this.state.id !== 0 && this.state.dictUnitDetails[value.unitId] &&*/}
                                {/*                 this.state.dictUnitDetails[value.unitId].unitDetailAmount)*/}
                                {/*                 ? this.state.dictUnitDetails[value.unitId].unitDetailAmount :*/}
                                {/*                 this.state.unitDetailAmounts[value.unitId] ? this.state.unitDetailAmounts[value.unitId]: ''}*/}
                                {/*             onChange={(e) => this.amountOnChange(e, value.unitId)} type="number"/>*/}
                                {/*    </div>*/}
                                {/*  </div>*/}
                                </div>
                                <div className="row">
                                  <label className="form-label">
                                    Trạng thái cá <span style={{color: "red"}}>
                                        {(!this.state.canSave && !this.state.statusFishDetailsOk[value.unitId]) ? '*' : ''}</span>
                                  </label>
                                  {this.statusFishName.map((valueFish, indexFish) => (
                                  <div className="col-sm-4 ">
                                    <div className="mb-1 me-3">
                                      <div className="container1" style={{marginLeft: "20px"}}>
                                        <label key={`labelStatus${valueFish}`} className="checkbox-container">
                                          <input id={`checkBoxStatus${valueFish}`} type="checkbox"
                                                 checked={this.state.statusFishDetails[[value.unitId, this.state.id, indexFish+1]] ?
                                                     this.state.statusFishDetails[[value.unitId, this.state.id, indexFish+1]] : false}
                                                 onChange={(e) =>
                                                     this.handleCheckStatusFish(e, value.unitId, this.state.id, indexFish+1)}/>
                                          {valueFish}
                                        </label>
                                      </div>
                                    </div>
                                  </div>))}
                                </div>
                                <div className="row">
                                  <div className="col-sm-6">
                                    <div className="mb-4">
                                      <label className="form-label" htmlFor="speedGrowth">
                                        Tốc độ phát triển <span style={{color: "red"}}>
                                        {(!this.state.canSave && !this.state.speedGrowthsOk[value.unitId]) ? '*' : ''}</span>
                                      </label>
                                      <input className="form-control" name="speedGrowth" id="speedGrowth"
                                             value={(this.state.id !== 0 && this.state.dictUnitDetails[value.unitId] &&
                                                 this.state.dictUnitDetails[value.unitId].speedGrowth
                                                 && this.state.speedGrowths[value.unitId] === undefined) ?
                                                 this.state.dictUnitDetails[value.unitId].speedGrowth :
                                                 this.state.speedGrowths[value.unitId] ? this.state.speedGrowths[value.unitId] : ''}
                                             onChange={(e) => this.speedGrowthOnChange(e, value.unitId)} type="number"/>
                                    </div>
                                  </div>
                                  <div className="col-sm-6">
                                    <div className="mb-4">
                                      <label className="form-label" htmlFor="length">
                                        Chiều dài <span style={{color: "red"}}>
                                        {(!this.state.canSave && !this.state.lengthsOk[value.unitId]) ? '*' : ''}</span>
                                      </label>
                                      <input className="form-control" name="length" id="length"
                                             value={(this.state.id !== 0 && this.state.dictUnitDetails[value.unitId]
                                                 && this.state.lengths[value.unitId] === undefined) ?
                                                 this.state.dictUnitDetails[value.unitId].length : this.state.lengths[value.unitId]
                                                     ? this.state.lengths[value.unitId] : ''}
                                             onChange={(e) => this.lengthOnChange(e, value.unitId)}
                                             type="number"/>
                                    </div>
                                  </div>
                                </div>

                                <label className="form-label">
                                  Tính năng <span style={{color: "red"}}>
                                        {(!this.state.canSave && !this.state.featureDetailsOk[value.unitId]) ? '*' : ''}</span>
                                </label>
                                {this.state.featureTypes.map((valueft, indexft) => (
                                    <div className="row">
                                      <div className="col-sm-3">
                                        <div className="mb-2" style={{marginLeft: "40px", color: "slategray"}}>
                                          {valueft.featureTypeName}</div>
                                      </div>
                                        {this.state.featureTypesFeature[valueft.featureTypeId].map((valuef, indexf) =>(

                                      <div className="col-sm-3">
                                        <div className="mb-3">
                                          {/*{console.log("this.state.featureDetails: ", this.state.featureDetails,*/}
                                          {/*    this.state.featureDetails[[value.unitId, this.state.id, valuef.featureId]], value.unitId, this.state.id)}*/}
                                          <label key={valuef.specific} className="checkbox-container">
                                            <input id={`checkBoxFeature${index}${value.specific}`} type="checkbox"
                                                         checked={this.state.featureDetails[[value.unitId, this.state.id, valuef.featureId]] ?
                                                             this.state.featureDetails[[value.unitId, this.state.id, valuef.featureId]] : false}
                                                         onChange={(e) => this.handleCheckFeature(e, value.unitId, this.state.id, valuef.featureId)}/>
                                                  {valuef.specific}
                                          </label>
                                        </div>
                                      </div>))}
                                    </div>))}
                              </div>}
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                         key={this.state.message}/>
                <div className="text-center mt-4">
                  <button onClick={(e) => this.doCreate(e)}
                           className="btn btn-outline-dark" type="submit"><i className="far fa-save me-2"></i>Lưu</button>
                </div>
              </form>
            </div>
          </div>
        </>
    )
  }
}

export default withRouter(FormProduct);
