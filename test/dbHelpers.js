import {expect} from 'chai';
import db from '../db/config';
import createTables from  '../db/schemas';

describe('database helpers', () => {
	describe('getRandomUsers', () => {
		before((done) => {

			// this is done to return database to untouched state: http://stackoverflow.com/questions/3327312/drop-all-tables-in-postgresql
			db.query('DROP SCHEMA IF EXISTS public CASCADE;');
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