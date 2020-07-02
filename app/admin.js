//jshint esversion:6


var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
  storage: storage
});
var flash = require('connect-flash');
const Site = require("./models/settings");
const Message = require("./models/message");
const User = require("./models/user.js");
const Product = require("./models/product.js");
const Order = require("./models/order.js");
const Cart = require("./models/cart");
const Coupon = require("./models/coupon");
var helper = require("./functions.js");
var path = require('path');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});


router.get("/", function(req, res) {
  User.countDocuments({}, function(err, users) {
    Product.countDocuments({}, function(err, products) {
      Message.countDocuments({}, function(err, msgs) {
        Order.countDocuments({}, function(err, purchases) {
          res.render("admin", {
            users: users,
            products: products,
            msgs: msgs,
            purchases: purchases
          });
        });
      });
    });
  });
});

//history of purchases
router.get("/purchases", function(req, res) {
  Order.find({}, function(err, orders) {
    if (err) {
      return res.write("error finding orders");
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();  // ADDS items array in order coupons
      order.coupons = cart.generateCouponArray();        // ADDS coupons array in order coupons
    });

    res.render("purchases", {
      user: req.user,
      orders: orders,
      User: User
    });
  });
});
router.get("/purchases/:user", function(req, res) {
  Order.find({
    name: req.params.user
  }, function(err, orders) {
    if (err) {
      return res.write("error finding orders");
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });

    res.render("purchases", {
      title: "Purchases of",
      user: req.user,
      orders: orders,
      req: req
    });
  });
});

router.get("/sell", function(req, res) {
  res.render("sell");
});

router.post('/sell', function(req, res) {
  var imgPath = req.body.imgPath;
  var itemTitle = req.body.title;
  var itemCategory = req.body.itemCategory;
  var itemQuantity = req.body.itemQuantity;
  var itemDescription = req.body.description;
  var itemPrice = req.body.price;
  var itemStatus = req.body.itemStatus;
  var editProduct = new Product({
    imagePath: imgPath,
    title: itemTitle,
    category: itemCategory,
    quantity: itemQuantity,
    description: itemDescription,
    price: itemPrice,
    status: itemStatus,
  });

  editProduct.save();
  res.redirect("/admin/edit");
});
////////.........edit products.........///////
router.get("/edit", function(req, res) {
  var goodMsg = req.flash("goodMsg")[0];
  var successcart = req.flash("successcart")[0];
  Product.find({}, function(err, found) {
    res.render("productslist", {
      products: found,
      successCart: successcart,
      goodMsg: goodMsg,
      user: 0
    });
  });
});

router.get("/edit/:id", function(req, res) {
  var goodMsg = req.flash("goodMsg")[0];
  var successcart = req.flash("successcart")[0];
  Product.findById({
    _id: req.params.id
  }, function(err, found) {

    res.render("editproduct", {
      product: found,
      successCart: successcart,
      goodMsg: goodMsg,
      user: 0
    });
  });
});



router.post('/edit/:id', function(req, res) {
  var itemid = req.body.uid;
  var imgPath = req.body.imgPath;
  var itemTitle = req.body.title;
  var itemCategory = req.body.itemCategory;
  var itemQuantity = req.body.itemQuantity;
  var itemDescription = req.body.description;
  var itemPrice = req.body.price;
  var itemStatus = req.body.itemStatus;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  today = dd + '/' + mm + '/' + yyyy + " " + time;
  var newinfo = {
    imagePath: imgPath,
    title: itemTitle,
    category: itemCategory,
    quantity: itemQuantity,
    description: itemDescription,
    price: itemPrice,
    status: itemStatus,
    lastUpdated: today,
  };

  Product.findOneAndUpdate({
    _id: itemid
  }, newinfo, function(err) {});


  res.redirect("/admin/edit");
});



////////////.........coupons..........///////

router.get("/coupons/", function(req, res) {

  var goodMsg = req.flash("goodMsg")[0];
  Coupon.find({}, function(err, found) {

    res.render("coupons", {
      coupons: found,
      goodMsg: goodMsg,
    });
  });
});

router.get("/coupons/add", function(req, res) {

  res.render("addcoupon.ejs", {});
});


router.post('/coupons/add', function(req, res, next) {
  var goodMsg = req.flash("goodMsg")[0];
  const name = req.body.cname;
  const discount = req.body.discount;
  const validatetill = req.body.date;
  const status = true;
  const createdAt = helper.currentTime();


  const newCoupon = new Coupon({
    name: name,
    discount: discount,
    validatetill: validatetill,
    status: status,
    createdAt: createdAt
  });


  Coupon.findOne({
    name: name
  }, function(err, found) {

if (!found)
{
    newCoupon.save();
    req.flash('goodMsg', 'Coupon Saved!');

}
else{
      req.flash('goodMsg', 'Coupon with that name already exists');
}
  });



  res.redirect("/admin/coupons/");
});

router.get('/coupons/toggle/:id', function(req, res, next) {
  var couponID = req.params.id;
  Coupon.findOne({
    _id: couponID
  }, function(err, found) {


      if (found.status) {
        found.status = false;
        found.save();
      } else {
        found.status = true;
        found.save();
      }

  });
  res.redirect("/admin/coupons/");
});

////////.........delete products.........///////
router.get("/removeProduct/:id", function(req, res) {
  var productId = req.params.id;
  var product = new Product(req.session.cart ? req.session.cart : {});

  Product.findOneAndRemove({
    _id: productId
  }, function(err, product) {
    res.redirect("/admin/edit");
  });
});


/////............admin messages.........////////
router.get("/messages", function(req, res) {
  var succesMsg = "";
  Message.find({}, null, {
    sort: {
      'date': -1
    }
  }, function(err, foundMsgs) {
    res.render("messages", {
      foundMsgs: foundMsgs,
      succesMsg: succesMsg
    });
  });

});

router.post("/messages", function(req, res) {
  var succesMsg = "Succesfully Sent mail";
  /// send email to %t with the answer
  answer = req.body.replyAnswer;
  answerid = req.body.answerid;
  //transporter.sendMail(answer);


  // mark _id as "taken care of" // 1 is taken care of
  Message.findOne({
    _id: answerid
  }, function(err, found) {
    found.status = 1; // 1 is taken care of
    found.answer = answer;
    found.closedBy = req.user.username;
    found.save();
  });
  res.redirect("/admin/messages");
});


router.get("/msg-del/:id", function(req, res) {
  var succesMsg = "Succesfully Deleted ";
  Message.findOneAndDelete({
    _id: req.params.id
  }, function(err) {
    Message.find({}, function(err, foundMsgs) {
      res.render("messages", {
        foundMsgs: foundMsgs,
        succesMsg: succesMsg
      });
    });
  });

});

// site settings
router.get("/site-settings", function(req, res) {
  var errorMsg = "";

  res.render("./site-settings", {
    errorMsg: errorMsg
  });
});



//admin all users page
router.get('/allusers', function(req, res) {
  User.find({}, function(err, FoundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (FoundUsers) {
        res.render("userslist", {
          allusers: FoundUsers,
        });
      }
    }
  });

});
// show modify users page with inputs to edit
router.get('/allusers/:id', function(req, res) {
  const moduser = req.params.id;

  User.findOne({
    _id: moduser
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else {

      res.render("modifyusers", {
        user: user,
      });
    }
  });

});
//update button to modify users
router.post('/update', function(req, res) {
  const oldName = req.body.oldName;
  const name = req.body.newName;
  //const newName = name.charAt(0).toUpperCase() + name.slice(1); // in register it saves only NOT capitalized
  // const newName = name.toLowerCase();
  //const newPassword = req.body.newPassword;
  const newPermission = req.body.newPermission;
  // if (req.body.newPassword == "")
  // {
  User.findOneAndUpdate({
    username: oldName
  }, {
    //username: newName,
    //  password: newPassword, need to find way to modify password and encrypt it
    admin: newPermission
  }, function(err) {
    if (err) {
      res.render("failed.ejs", {
        error: "Username is Taken, Please choose Another Name"
      });
    } else {
      res.redirect("/");
    }
  });
  // }
  // // else{
  //   User.findOneAndUpdate({
  //     username: oldName
  //   }, {
  //     username: newName,
  //     //  password: newPassword, need to find way to modify password and encrypt it
  //     admin:newPermission
  //   }, function(err) {
  //     if (err) {
  //       res.render("failed.ejs", {
  //         error: "Username is Taken, Please choose Another Name"
  //       });
  //     } else {
  //       res.redirect("/");
  //     }
  //   });
  // // }
});

// delete users button
router.post("/deluser", function(req, res, next) {
  const deluser = req.body.deluser;
  User.deleteOne({
    _id: deluser
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/allusers");
    }

  });
});




module.exports = router;
