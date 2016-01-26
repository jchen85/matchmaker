import db from './config'

///////////////// DB helpers /////////////////////

// get three random users, based on: http://stackoverflow.com/questions/8674718/best-way-to-select-random-rows-postgresql
export function getRandomUsers (err, callback) {
	// get table size variables for the real query
	return db.query("SELECT count(*) AS ct, min(user_id)  AS min_id, max(user_id)  AS max_id, max(user_id) - min(user_id) AS id_span FROM users;")
				 .then((rows) => {
				 	// this is the actual query which pulls 3 random distinct rows from the users table
				 		return db.query(`SELECT * \
										FROM  (\
										    SELECT DISTINCT 1 + trunc(random() * ${rows[0].id_span})::integer AS user_id \
										    FROM   generate_series(1, ${rows[0].max_id * 1.1}) g \
										    ) r \
										JOIN   users USING (user_id) \
										LIMIT  3;`)
				 });
}
// get all users

// get user by id

// get user by Facebook id

// get random user

// get user's connected pairs

// get set of potential matches filtered by an input users preferences