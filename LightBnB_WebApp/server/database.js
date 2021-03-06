const db = require('../db');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return db
    .query('SELECT * FROM users WHERE email = $1', [email])
    .then((result) => result.rows[0])
    .catch(err => err.message);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return db
    .query('SELECT * FROM users WHERE id = $1', [id])
    .then((response) => response.rows[0])
    .catch((err) => err.message);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function({name, email, password}) {
  return db
    .query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    )
    .then((response) => response)
    .catch((err) => err.message);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guestId, limit = 10) {
  const values = [guestId, limit];
  const queryString = `
  SELECT reservations.*, properties.*, AVG(rating) AS average_ratings
  FROM reservations
  JOIN  properties ON property_id = properties.id
  JOIN property_reviews ON reservations.id = reservation_id
  WHERE reservations.guest_id = $1 AND end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY start_date
  LIMIT $2;
  `;
  return db
    .query(queryString, values)
    .then(result => result.rows)
    .catch(err => err.message);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  
  let whereAdded = false;
  
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` WHERE city LIKE $${queryParams.length}`;
    whereAdded = true;
  }
  
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    if (whereAdded) {
      queryString += ' AND ';
    } else {
      queryString += ' WHERE ';
      whereAdded = true;
    }
    queryString += `owner_id = $${queryParams.length}`;
  }
  
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    if (whereAdded) {
      queryString += ' AND ';
    } else {
      queryString += ' WHERE ';
      whereAdded = true;
    }
    queryString += `cost_per_night >= $${queryParams.length}`;
  }
  
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    if (whereAdded) {
      queryString += ' AND ';
    } else {
      queryString += ' WHERE ';
      whereAdded = true;
    }
    queryString += `cost_per_night <= $${queryParams.length}`;
  }
  
  queryString += ` GROUP BY properties.id`;
  
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
  }
  
  queryParams.push(limit);
  queryString += ` ORDER BY cost_per_night LIMIT $${queryParams.length};`;
  
  return db
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => err.message);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;
  
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];
  
  return db.query(queryString, queryParams)
    .then(result => result.rows)
    .catch(err => err.message);
};
exports.addProperty = addProperty;
