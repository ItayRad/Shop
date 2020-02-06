var Product = require("../app/models/product");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/shopDB");
var products = [
   new Product({
  imagePath: "https://upload.wikimedia.org/wikipedia/he/5/5e/Gothiccover.png",
  title: "Gothic Video Game",
  description: "Awesome Game!!!!",
  price: 10

}),
new Product({
imagePath: "https://cdn-cf.gamivo.com/image_cover.jpg?f=122784&n=3419967348094113.jpg&h=6e5fefe09df99b326e9100b2dc529c48",
title: "World of Wacraft",
description: "Awesome Game!!!!",
price: 55

}),
   new Product({
  imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyFmGr_EFVmgPJW41M6aA15nR5vfTCYzcFxl5K-5VJD2FiO1s5Q&s",
  title: "Diablo 3",
  description: "Awesome Game!!!!",
  price: 35

})
];

var done = 0;
for (var i=0; i<products.length; i++)
{
  products[i].save(function(err,result){
    done++;
  if (done === products.length) {
    exit();
  }
  });
}
function exit() {
mongoose.disconnect();
}
