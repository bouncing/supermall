import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-type'

export default {
  addCart (context, payload) {
    return new Promise(((resolve, reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      if (oldProduct) {
        context.commit(ADD_COUNTER, oldProduct)
        resolve('+1')
      } else {
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve('add')
      }
    }))
  }
}
