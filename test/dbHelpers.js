import {expect} from 'chai';
import db from '../db/config';
import createTables from  '../db/schemas';
import generateUser from '../server/userGenerator/taglines';

describe('database helpers', () => {
	describe('getRandomUsers', () => {
		before((done) => {

			// this is done to return database to untouched state: http://stackoverflow.com/questions/3327312/drop-all-tables-in-postgresql
			db.query('DROP SCHEMA IF EXISTS public CASCADE;')
      .then(() => {
				return db.query('CREATE SCHEMA public;');
			})
			.then(() => {
				return db.query('GRANT ALL ON SCHEMA public TO postgres;');
			})
			.then(() => {
				return db.query('GRANT ALL ON SCHEMA public TO public;');
			})
			.then(() => {
				return db.query("COMMENT ON SCHEMA public IS 'standard public schema'");
			})
			.then(() => {
				return createTables();
			})
			.then(() => {
				for (var i = 0; i < 50; i++) {
					var fakeUser = generateUser();
					db.query(`INSERT INTO users(facebook_id,first_name,last_name,gender,birthday,zipcode,status,age_min,age_max,gender_preference,\
						location_preference,description) VALUES ('12345','${fakeUser.first_name}','${fakeUser.last_name}','${fakeUser.gender}',\
						'${fakeUser.birthdayStr}','${fakeUser.zipcode}',${fakeUser.status},${fakeUser.age_min},${fakeUser.age_max},\
						'${fakeUser.gender_preference}',${fakeUser.location_preference},'Placeholder description');`);
				}
				
				console.log('tables dropped and recreated')
				done();
			})
			.catch((error) => {
				throw new Error(error);
			});
		});

		it('should return 3 random, different users', () => {

		});

	});
});