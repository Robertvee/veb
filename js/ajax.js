//UPDATE line 17,18,19,73,77.

var allowSend = true;
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

function submitFormToPlatform(fn, ln, em, ph, cn, pr) {
  //REMOVE +
  var ph = ph.replace("+", "");
  var pr = pr.replace("+", "");
  console.log("phone sent =>" + pr + "" + ph);

  var digitsCount = pr.length;
  var digits = ph.substring(0, digitsCount);

  if (digits == pr) {
    ph = ph.substring(digitsCount);
  }

  //console.log("Filter phone sent =>" + pr + '' + ph);

  var newLead = {
    affiliateId: "1664",
    campaignId: "1269",
    offerId: "",
    funnelname: "Quantum Prime Profit",
    funnellink: "",
    firstname: fn,
    lastname: ln,
    email: em,
    phonenumber: pr + "" + ph,
    countrycode: cn.toUpperCase(),
    comments:
      "domain: " +
      window.location.hostname +
      " query: " +
      window.location.search.substring(1),
  };
  var affiliateId = getQueryVariable("afid");
  if (affiliateId) {
    newLead.affiliateId = affiliateId;
  }
  var utmTerm = getQueryVariable("utm_term");
  if (utmTerm) {
    newLead.clickId = utmTerm;
  }
  var utm_campaign = getQueryVariable("utm_campaign");
  if (utm_campaign) {
    newLead.pixel = utm_campaign;
  }

  if (!allowSend) {
    console.log("Already sent");
    return true;
  }
  allowSend = false;

  newLead = JSON.stringify(newLead);

  const formData = {
    email: em,
    phone: `${pr}${ph}`,
  };

  if (storeFormData(formData)) {
    const dupliLead = document.getElementById("dupliLead");
    dupliLead.textContent = "Email or Username already registered";
    setTimeout(() => (dupliLead.textContent = ""), 60000);
    return false;
  }

  function storeFormData(formData) {
    const existingData = localStorage.getItem("formData");
    if (existingData) {
      const parsedData = JSON.parse(existingData);
      const duplicate =
        parsedData.email === formData.email ||
        parsedData.phone === formData.phone;
      if (duplicate) {
        return true;
      } else {
        localStorage.removeItem("formData");
        localStorage.setItem("formData", JSON.stringify(formData));
        leadForm.classList.add("hidden");
        document.querySelector(".form-loader").classList.remove("hidden");
      }
    } else {
      localStorage.setItem("formData", JSON.stringify(formData));
      return false;
    }
  }
  console.log(newLead);
  $.ajax({
    url: "https://theorchestra.cleverapps.io/api/leads", // CHANGE URL HERE
    type: "post",

    headers: {},
    data: newLead,
    dataType: "json",
    contentType: "application/json",

    success: function (data) {
      //console.log(data);
      if (data.status == "Success" && typeof data.autologinurl != "undefined") {
        window.location = data.autologinurl;
      } else {
        document.querySelector(".form-loader").classList.add("hidden");
        document.querySelector(".form-success").classList.remove("hidden");
      }
      console.log("e");
    },
    error: function (err) {
      console.log(err);
      document.querySelector(".form-loader").classList.add("hidden");
      document.querySelector(".form-success").classList.remove("hidden");
    },
  });
}
