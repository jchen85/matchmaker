var random_name = require('node-random-name');
var zipcodes = require('zipcodes');
var descriptions = require('./descriptions.js');

// bing image search type:photograph people:just faces search:guy

var generateUser = function() {

  var gender = function() {
    if (Math.floor(Math.random() * 2) === 0) {
      return 'male';
    }
    return 'female';
  };

  var genderPreference = function(input) {
    if (Math.floor(Math.random() * 10) === 0) {
      return input;
    }
    if (input === 'male') return 'female';
    return 'male';
  }

  var zipcode = function() {
    var possibleZipcodes = zipcodes.radius(94114, 60); // SF to San Jose seemed reasonable
    return possibleZipcodes[Math.floor(Math.random()*possibleZipcodes.length)];
  }

  var start = new Date(1973, 0, 1); // selecting between age 21 and 42
  var end = new Date(1994, 0, 1);

  var birthday = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  var calculateAge = function(birthdate) { 
    var difference = Date.now() - birthdate;
    var ageDate = new Date(difference); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  var age = calculateAge(birthday);
  console.log('AGE', age)
  var minAge = Math.ceil(age/2 + 7); // eh, seems fair
  var maxAge = (age-7)*2;

  var gender = gender();

  // var Bing = require('node-bing-api')({ accKey: "yc1qnJqokiEdeGaDnw98TrJ99KwLDz/3SF1Xsk4gGPA" });

  // var cleanBingImages = function(bingResults) {
  //   var resultsArray = bingResults['d']['results'];
  //   return resultsArray.map(function(item) {
  //     return item.MediaUrl
  //   });
  // }

  // TODO async
  // var getImages = function(gender) {
  //   Bing.images('headshot woman', {top: 50}, function(err, response, bingImageResults) {
  //     var femaleImageArray = cleanBingImages(bingImageResults);

  //     Bing.images('headshot man', {top: 50}, function(err, response, bingImageResults) {
  //     var maleImageArray = cleanBingImages(bingImageResults);

  //     });

  //   });
    
  // };

  // var userImage = function(gender) {
  //   if (gender === 'female') {
  //     return femaleImageArray[Math.floor(Math.random()*femaleImageArray.length)];
  //   } else if (gender === 'male') {
  //     return maleImageArray[Math.floor(Math.random()*maleImageArray.length)];
  //   }
  // };


  var fakeUser = {
    facebook_id: 'autogenerated',
    first_name: random_name({ first: true, gender: gender }),
    last_name: random_name({ last: true }),
    gender: gender,
    birthday: birthday, // TODO
    zipcode: zipcode(), // TODO
    status: true, // this can just be a boolean, whether they can be matched
    age_min: minAge, // birthday minus random number between 2 and 5 (floor 21)
    age_max: maxAge, // birthday plus random number between 2 and 10 (floor 21)
    gender_preference: genderPreference(gender), // homosexual ~10% of the time
    location_preference: 5, // just default to 5 mile radius, zipcodes.radius(zipcode, 5) returns a list of all zipcodes in radius
    description: descriptions[Math.floor(Math.random()*descriptions.length)],
    // image_url: userImage(gender) 
  }

  return fakeUser;
  
  
}

console.log(generateUser())



