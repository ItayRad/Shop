//jshint esversion:6


var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
  storage: storage
});
const Site = require("./models/settings");
const Message = require("./models/message");
const User = require("./models/user.js");
const Product = require("./models/product.js");
const Order = require("./models/order.js");
const Cart = require("./models/cart");
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
      order.items = cart.generateArray();
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
  var itemDescription = req.body.description;
  var itemPrice = req.body.price;
  var newProduct = new Product({
    imagePath: imgPath,
    title: itemTitle,
    description: itemDescription,
    price: itemPrice,
  });

  newProduct.save();
  res.redirect("/");
});

//admin messages
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
        res.render("allusers", {
          allusers: FoundUsers,
        });
      }
    }
  });

});
// show modify users page with inputs to edit
router.post('/allusers/:user', function(req, res) {
  const moduser = req.body.modifyuser;
  console.log(moduser);
  User.find({
    _id: moduser
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else {

      res.render("modifyusers", {
        allusers: user,
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