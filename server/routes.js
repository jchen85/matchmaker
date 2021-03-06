import { getConnectedPairsAndMessagesForUser, addMessage, updateHeart, closeChat } from '../db/chatHelpers'
import { getRandomUsers, addMatch, getMatchSet, getUser, postUser, getMatchesMade, putUser, putPicture, getAlbum, buyCandidate, postAlbum, postRecommendation} from '../db/dbHelpers';
import path from 'path';
import bodyParser from 'body-parser';
import store from './scoreboard';
import request from 'request';
import { io } from './server';

var genderPreference = function(input) {
  if (Math.floor(Math.random() * 10) === 0) {
	return input;
  }
  if (input === 'male') {
  	return 'female';
  }
  return 'male';
}

module.exports = function (app, express) {
	// test route, use this to get data for redux
	app.get('/api/candidates/:user_id', function(req, res) {
		var user_id = Number(req.params.user_id) > 0 ? Number(req.params.user_id) : 0;				
		res.json(getMatchSet(user_id));
	});

	app.post('/api/pairs', (req, res) => {
		store.dispatch({type: 'UPDATE_LATEST', latestMatch: req.body})
		addMatch(req.body).then((row) => {
			if (row && row[0]) {
			  // return a 200 point bonus because a connection was created
			  res.json({score: 200}); 
			} else {
			  res.json({});
			}
		})
	});


	// This function should eventually get other things such as a score.
	app.get('/api/matchmakerScore/:user_id', (req, res) => {
      	getMatchesMade(req.params.user_id).then((output) => {
        	res.json(output);
    	});
	});

	// change profile picture
	// /api/users/:user_id/pictures/:picture
	app.put('/api/pictures/:user_id', (req, res) => {
      	putPicture(req.params.user_id, req.body.image_url).then((output) => {
      		res.json(output);
      	});
	});

	app.get('/api/album/:user_id', (req, res) => {
      	getAlbum(req.params.user_id).then((output) => {
      		res.json(output);
      	});
	});

	app.post('/api/users/:user_id/recommendation', (req, res) => {
		postRecommendation(req.params.user_id, req.body.gender, req.body.preference).then((output) => {
			res.json(output);
		});
	});

	app.post('/api/users/:user_id/album', (req, res) => {
      	postAlbum(req.params.user_id, req.body.image_url).then((output) => {
      		res.json(output);
      	});
	});

	//api/users:user_id/chats
	app.get('/api/chats/:user_id', (req, res) => {
		getConnectedPairsAndMessagesForUser(req.params.user_id).then((rows) => {
			console.log('chats', rows)
			res.json(rows)
		});
	});

	app.post('/api/chats', (req, res) => {
		addMessage(req.body).then(() => {
			io.to(req.body.pair_id.toString()).emit('refreshChats');
			res.end();
		});
	});

    // This should replace the put request
	app.get('/api/users/:facebook_id', (req, res) => {
		getUser(req.params.facebook_id).then((rows) => {
			if (rows.length === 0) {
			  res.json(null);
			} else {
			  res.json(rows[0]);
			}
		});
	});

	app.post('/api/users', (req, res) => {
		request.get('https://graph.facebook.com/v2.5/me?fields=id,first_name,last_name,gender,birthday,picture.width(200).height(200).type(square)&access_token=' + req.body.access_token, function(err, getResponse, fbResult) {
            if (err) {
                res.send(500);
            }
            try {
                fbResult = JSON.parse(fbResult);
                var gp = genderPreference(fbResult.gender);
                var userData = {
                    facebook_id: fbResult.id,
                    first_name: fbResult.first_name,
                    last_name: fbResult.last_name,
                    gender: fbResult.gender,
                    zipcode: 99999, // DUMMY VALUE
                    status: 'true',
                    age_min: 18,
                    age_max: 100,
                    gender_preference: 'none',
                    description: 'Ready to Mingle',
                    location_preference: 99999,
                    image_url: fbResult.picture.data.url
                }
                postUser(userData).then((rows) => {
                  res.json(rows);
                });
            } catch (e) {
                console.log("generic error");
                res.send(500);
            }
		})
	})


	app.put('/api/users/:userID', (req, res) => {
	  let userID = req.params.userID;
	  let userInfo = req.body;
	  putUser(userID, userInfo)
	    .then((rows)=> {
	      res.json(rows);
	    });
	});

	app.put('/api/chatsheart', (req, res) => {
	  updateHeart(req.body.user_id, req.body.pair_id, req.body.is_user_one)
	    .then((heartInfo) => {
	      res.json(heartInfo);
	    });
	});

	app.put('/api/purchases/candidate', (req, res) => {
	  buyCandidate(req.body)
	    .then((score) => {
	      res.json(score);
	    });
	})

	app.put('/api/pairs/:pair_id/close', (req, res) => {
	  closeChat(req.params.pair_id)
	    .then((pair_id) => {
	      res.json(pair_id);
	    });
	})

	// app.get('/api/matchSet', (req, res) => {
	// 	getMatchSet().then((matchSet) => {
	// 		console.log(matchSet)
	// 		res.json(matchSet)
	// 	})
	// })



}