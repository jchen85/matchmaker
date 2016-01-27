import {getRandomUsers} from '../db/dbHelpers';
import path from 'path';

export default function (app, express) {
	// test route, use this to get data for redux
	app.get('/test', function(req, res) {
		getRandomUsers().then(function(rows) {
			res.json(rows);
		})
	});

	app.get('/match', function(req, res) {
		res.sendFile(path.join(__dirname, '..', '/client/testview.html'));
	})
}