import {get, post} from "../api/callAPI";
import AuthService from "./AuthService";
import {ko} from "faker/lib/locales";
import {remove} from "react-modal/lib/helpers/classList";

class CartService {
  add(id, amount) {
    const userId = AuthService.getCurrentUser().userId;
    console.log("userId , id, amount: ", userId, id, amount, this.getCurrentCart());
    let userCart = this.getCurrentCart();
    if (!userCart) {
      userCart = {};
    }
    if (!userCart.hasOwnProperty(userId)) {
      userCart[userId] = {};
    }
    let listItems = userCart[userId];
    if (listItems.hasOwnProperty(id)) {
      let oldAmount = listItems[id];
      listItems[id] = oldAmount + Number(amount);;
    } else {
      listItems[id] = Number(amount);
    }
    userCart[userId] = listItems
    localStorage.setItem('cart', JSON.stringify(userCart));
    this.getTotalCart()
  }
  removeShoppingSelected(){
    const userId = AuthService.getCurrentUser().userId;
    console.log("trước remove: ", localStorage.getItem('shoppingSelect'))
    let shoppingSelect = JSON.parse(localStorage.getItem('shoppingSelect'));
    let shoppingSelectNew = {}
    Object.keys(shoppingSelect).map((key, index) => {
      console.log("key, index, Object.values(shoppingSelect)[index]: ", key, index, Object.values(shoppingSelect)[index])
      if (Number(key) !== userId)
        shoppingSelectNew[key] = Object.values(shoppingSelect)[index]
    })
    setTimeout(() => localStorage.setItem('shoppingSelect', JSON.stringify(shoppingSelectNew)), 500)
    setTimeout(() => console.log("sau remove: ", shoppingSelectNew, localStorage.getItem('shoppingSelect')), 1000)
  }
  shoppingSelect(ids, amounts){
    let userCart = this.getCurrentCart();
    const userId = AuthService.getCurrentUser().userId;
    let listItems = {}

    if (localStorage.getItem('shoppingSelect') &&
        localStorage.getItem('shoppingSelect')[userId] &&
        localStorage.getItem('shoppingSelect')[userId].length !== 0)
      this.removeShoppingSelected()

    setTimeout(() => {
      console.log("idAmounts: ", ids, amounts)
      ids.map((id, index) => {
        let amount = amounts[index]

        if (!userCart) userCart = {}
        if (!listItems) listItems = {}
        if (!userCart.hasOwnProperty(userId)) userCart[userId] = {}

        listItems[id] = Number(amount)
        console.log("indexx, id, amount, listItems: ", index, id, amount, listItems)
      })
      setTimeout(() =>  {
        userCart[userId] = listItems
        console.log("userCart: ", userCart)
        localStorage.setItem('shoppingSelect', JSON.stringify(userCart));
      }, 500)
      setTimeout(() => console.log('add xong shoppingSelect', localStorage.getItem('shoppingSelect')), 1000)
    }, 1000)
  }
  addFirstRemove(id, amount) {
    const userId = AuthService.getCurrentUser().userId;
    console.log("userId , id, amount: ", userId, id, amount, this.getCurrentCart());
    let userCart = this.getCurrentCart();
    if (!userCart) {
      userCart = {};
    }
    if (!userCart.hasOwnProperty(userId)) {
      userCart[userId] = {};
    }
    let listItems = userCart[userId];
    listItems[id] = Number(amount);

    userCart[userId] = listItems
    localStorage.setItem('cart', JSON.stringify(userCart));

    this.getTotalCart()
  }
  isEmpty() {
    const userId = AuthService.getCurrentUser().userId;
    let userCart = []
    if (this.getCurrentCart() != null && userId)
      userCart = this.getCurrentCart()[userId];
    // console.log("this.getCurrentCart(): ", this.getCurrentCart())
    if (userCart!== undefined && Object.keys(userCart).length !== 0) {
      // console.log("isEmpty: false", userCart)
      return false;
    }
    // console.log("isEmpty: true")
    return true;
  }
  remove(id) {
    const userId = AuthService.getCurrentUser().userId;
    const userCart = this.getCurrentCart();
    if (!userCart) return;
    if (!userCart.hasOwnProperty(userId)) return;
    let listItems = userCart[userId];

    listItems[id] = 0;
    let listNew = {}
    Object.values(listItems).map((value, index) => {
      console.log("Object.values(listItems), value, index: ", Object.values(listItems), value, index)
      console.log("Object.keys(listItems)[index] !== id: ", Object.keys(listItems)[index], id, Object.keys(listItems)[index] !== id)
      if (Number(Object.keys(listItems)[index]) !== id)
        listNew[Object.keys(listItems)[index]] = value
    })
    setTimeout(() => {
      console.log("listNew: ", listNew)
      userCart[userId] = listNew
      localStorage.setItem('cart', JSON.stringify(userCart));
    }, 500)
  }
  removeUser() {
    const userId = AuthService.getCurrentUser().userId;
    const userCart = this.getCurrentCart();
    let shoppingSelect = this.getShoppingSelected()
    if (!userCart|| !shoppingSelect) return;
    if (!userCart.hasOwnProperty(userId) || !shoppingSelect.hasOwnProperty(userId)) return;
    let conLai = {}

    // console.log("removeUser: userCart, shoppingSelect 1: ", userCart, shoppingSelect)
    Object.keys(userCart[userId]).map((key, index) => {
      // console.log("userCart[userId], key, index, Object.values(userCart)[index]: ",
      //     userCart[userId], key, index, Object.values(userCart)[index])
      console.log("Object.keys(shoppingSelect[userId]): ", Object.keys(shoppingSelect[userId]),
          Object.keys(shoppingSelect[userId]).includes(key))
      if (!Object.keys(shoppingSelect[userId]).includes(key))
        conLai[key] = Object.values(userCart[userId])[index]
    })
    let cart = this.getCurrentCart();
    cart[userId] = conLai
    localStorage.setItem('cart', JSON.stringify(cart));
    // console.log("removeUser: conLai 2: ", cart, this.getCurrentCart())
  }
  getCurrentCart() {
    return JSON.parse(localStorage.getItem('cart'));
  }
  getShoppingSelected() {
    return JSON.parse(localStorage.getItem('shoppingSelect'));
  }
  getTotal() {
    let unitId = AuthService.getCurrentUser().userId;
    return JSON.parse(localStorage.getItem('total'))[unitId]
  }
  setTotal(num) {
    // console.log("1: JSON.parse(localStorage.getItem('total')):: ", JSON.parse(localStorage.getItem('total')))
    let number = JSON.parse(localStorage.getItem('total'))
    const userId = AuthService.getCurrentUser().userId;
    if (!number) {
      number = {};
    }
    number[userId] = num
    localStorage.setItem('total', JSON.stringify(number));

    // console.log("2: JSON.parse(localStorage.getItem('total')):: ", JSON.parse(localStorage.getItem('total')))
  }
  removeTotal(){
    let number = JSON.parse(localStorage.getItem('total'))
    let numberNew = {}
    Object.keys(number).map((key, index) => {
      if (key !== AuthService.getCurrentUser().userId)
        numberNew[key] = Object.values(number)[index]
    })
    localStorage.setItem('total', JSON.stringify(numberNew));
  }
  getTotalCart(){
    return (this.getCurrentCart() !== null && this.getCurrentCart()[AuthService.getCurrentUser().userId] !== undefined) ?
        Object.keys(this.getCurrentCart()[AuthService.getCurrentUser().userId]).length : 0
  }
}

export default new CartService();