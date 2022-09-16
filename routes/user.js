var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let workers = [
    {
      name: "Balan K Nair",
      category: "Coconut Tree Climber",
      place: "Vanimel",
      description: "Experience of 12 years",
      image: "https://drive.google.com/uc?id=10aKvTTwYt_RtT1dPpisKtmLeFYL40pCB"
    },
    {
      name: "Sreedharan CH",
      category: "Mason",
      place: "Vanimel",
      description: "Build over more than 100 houses",
      image: "https://drive.google.com/uc?id=1r8JAQU1LzPovIR4LHgtzmwpbNGW4FKaZ"
    },
    {
      name: "Baburajan",
      category: "Stone Worker",
      place: "Kottakkal",
      description: "Hardworking Worker",
      image: "https://drive.google.com/uc?id=19a2v2nlprZIwa1a5RiCq7SXQ3JKCW0rK"
    },
    {
      name: "Babu",
      category: "Plumber",
      place: "Kakkavayal",
      description: "Solution To Every plumbing Works",
      image: "https://drive.google.com/uc?id=1pMQe3MIgZViRhWXe6ktrQVpwYFlXjY74"
    },

  ];
  res.render('index', {workers,admin:false});
});

module.exports = router;
