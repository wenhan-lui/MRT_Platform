$(document).ready(function () {
  console.log("ready!");
});

// To set the active navpill whenever the correct one is activated.
var currentURL = $(location).attr("href");
if (currentURL.includes("NSL")) {
  $(".nav-link.text-white").removeClass("active");
  $("#NSL-Tab").addClass("active");
} else if (currentURL.includes("CCL")) {
  $(".nav-link.text-white").removeClass("active");
  $("#CCL-Tab").addClass("active");
} else if (currentURL.includes("CEL")) {
  $(".nav-link.text-white").removeClass("active");
  $("#CEL-Tab").addClass("active");
} else if (currentURL.includes("DTL")) {
  $(".nav-link.text-white").removeClass("active");
  $("#DTL-Tab").addClass("active");
} else if (currentURL.includes("NEL")) {
  $(".nav-link.text-white").removeClass("active");
  $("#NEL-Tab").addClass("active");
} else if (currentURL.includes("TEL")) {
  $(".nav-link.text-white").removeClass("active");
  $("#TEL-Tab").addClass("active");
} else {
  $(".nav-link.text-white").removeClass("active");
  $("#EWL-Tab").addClass("active");
}

// To listen for station name clicks.

$(".stationName")
  .parent()
  .on("click", function () {
    classNameOfElement = this.classList[0];
    nameOfElement = this.getAttribute("name");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    const body = JSON.stringify({
      nameOfElement: classNameOfElement,
    });
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        location.reload();
      }
    };
    xhr.send(body);
    console.log("POST SENT");
  });
