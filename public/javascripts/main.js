function togglePasswordFieldClicked() {
var pwID = document.getElementById("passwordField");
if (pwID.type === "password") {
  pwID.type = "text";
} else {
  pwID.type = "password";
}
}

function sidebar_toggle() {
  var x = document.getElementById("mySidebar");

if (x.style.display === "none") {
  x.style.display = "block";
 x.style.zIndex = "1";
} else {
  x.style.display = "none";
x.style.zIndex = "0";
}


}
$(window).resize(function() {
if ($(window).width() < 900)
 {
  document.getElementsByClassName("mySidebar")[0].style.position = "relative";

}
else {
   document.getElementsByClassName("mySidebar")[0].style.position = "absolute";
}
});
