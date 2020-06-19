//jshint esversion:6
module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.subTotalPrice = oldCart.subTotalPrice || 0;
  this.totalPrice = oldCart.totalPrice || 0;
  this.coupons = oldCart.coupons || {};


  this.add = function(item, id) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {
        item: item,
        qty: 0,
        price: 0
      };
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.subTotalPrice += storedItem.item.price;
    //checkTotal();
    var storedCoupon;
    if (!isEmpty(this.coupons)) { // Only if there is a coupon in cart
      for (var prop in this.coupons) {
        storedCoupon = this.coupons[prop];
        break;
      }

      this.totalPrice = this.subTotalPrice - (this.subTotalPrice * (storedCoupon.coupon.discount / 100));
    }
    else // without coupons
{
  this.totalPrice = this.subTotalPrice;
}

  };

  this.removeOne = function(item, id) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {
        item: item,
        qty: 0,
        price: 0
      };
    }
    storedItem.qty--;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty--;
    this.subTotalPrice -= storedItem.item.price;

    //checkTotal;
    var storedCoupon;
    if (!isEmpty(this.coupons)) {// Only if there is a coupon in cart
      for (var prop in this.coupons) {
        storedCoupon = this.coupons[prop];
        break;
      }
      this.totalPrice = this.subTotalPrice - (this.subTotalPrice * (storedCoupon.coupon.discount / 100));
    }
    else // without coupons
{
  this.totalPrice = this.subTotalPrice;
}
    return storedItem.qty;
  };

  this.removeItem = function(id) {
    this.totalQty -= this.items[id].qty;
    this.subTotalPrice -= this.items[id].price;
    delete this.items[id];
    var storedCoupon;
    if (!isEmpty(this.coupons)) { // Only if there is a coupon in cart
      for (var prop in this.coupons) {
        storedCoupon = this.coupons[prop];
        break;
      }
      this.totalPrice = this.subTotalPrice - (this.subTotalPrice * (storedCoupon.coupon.discount / 100));
    }
    else // without coupons
{
  this.totalPrice = this.subTotalPrice;
}
  };

  this.removeAll = function() {
    this.totalQty = 0;
    this.totalPrice = 0;
    this.subTotalPrice = 0;
    this.items = null;
    this.coupons = null;
  };


  this.couponAdd = function(coupon, id) {
    var storedCoupon = this.coupons[id];
    if (!storedCoupon) {
      storedCoupon = this.coupons[id] = {
        coupon: coupon,
      };
    }

    this.totalPrice = this.subTotalPrice - (this.subTotalPrice * (storedCoupon.coupon.discount / 100));

  };


  this.couponRemove = function() {
    var storedCoupon;
    for (var prop in this.coupons) {
      storedCoupon = this.coupons[prop];
      break;
    }
    this.totalPrice = this.subTotalPrice;
    this.coupons = null;

  };

  function isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  }



  this.generateArray = function() {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
  this.generateCouponArray = function() {
    var arr = [];
    for (var id in this.coupons) {
      arr.push(this.coupons[id]);
    }
    return arr;
  };
};
