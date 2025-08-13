
const pool = require('../config/db');

exports.create = async (companyData) => {
  const {
    owner_id,
    name,
    address,
    city,
    state,
    country,
    postal_code,
    website,
    industry,
  } = companyData;
  const result = await pool.query(
    `INSERT INTO company_profile (
      owner_id,
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      company_website,
      industry_type
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      owner_id,
      name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      industry,
    ]
  );
  return result.rows[0];
};

exports.findByOwnerId = async (ownerId) => {
  const result = await pool.query(
    'SELECT * FROM company_profile WHERE owner_id = $1',
    [ownerId]
  );
  return result.rows[0];
};

exports.update = async (ownerId, updatedData) => {
  const fields = Object.keys(updatedData);
  const values = Object.values(updatedData);
  const setString = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  const result = await pool.query(
    `UPDATE company_profile SET ${setString} WHERE owner_id = $1 RETURNING *`,
    [ownerId, ...values]
  );
  return result.rows[0];
};

exports.updateLogoUrl = async (ownerId, logoUrl) => {
  const result = await pool.query(
    'UPDATE company_profile SET company_logo_url = $1 WHERE owner_id = $2 RETURNING *',
    [logoUrl, ownerId]
  );
  return result.rows[0];
};

exports.updateBannerUrl = async (ownerId, bannerUrl) => {
  const result = await pool.query(
    'UPDATE company_profile SET company_banner_url = $1 WHERE owner_id = $2 RETURNING *',
    [bannerUrl, ownerId]
  );
  return result.rows[0];
};
