// REQUIRED PACKAGES
var express = require("express");
var router = express.Router();
var yelpKeys = require("../config.js");
var yelp = require("yelp-fusion");

// YELP FUSION API CALL
router.get("/yelp", (req, res) => {

  res.render("yelpsearch", { isGuest: true });
});

router.post("/api/yelp", (req, res) => {


  // USER SEARCH TERMS
  const searchRequest = {
    term: req.body.term,
    location: req.body.location
  };

  //var client = yelp.client(response.jsonBody.access_token);
  const client = yelp.client(yelpKeys);

  // SEARCH REQUEST
  client.search(searchRequest).then(
    response => {
      const firstResult = response.jsonBody.businesses[0];
      const prettyJson = JSON.stringify(firstResult, null, 4);
      console.log(prettyJson);
      const yelpResponse = response.jsonBody.businesses;
      var results = [];
      for (var i = 0; i < 3; i++) {
        var displayData = {
          name: yelpResponse[i].name,
          location: yelpResponse[i].location.display_address,
          phone: yelpResponse[i].display_phone,
          open: yelpResponse[i].is_closed,
          rating: yelpResponse[i].rating
        };
        results.push(displayData);
        console.log("DISPLAY DATA: ", displayData);
      }

      // Render Yelp Results
      return res.render("yelpsearch", { business: results, isGuest: true });
    } // close client search .then func
  );
});

// EXPORT FUNCTION
module.exports = router;
