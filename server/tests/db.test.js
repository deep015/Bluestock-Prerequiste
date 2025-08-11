// File: /backend/src/tests/db.test.js

const { Pool } = require('pg');

// Mock the entire pg module to control the behavior of the database pool.
// The mock is hoisted, so this runs before the 'require' of the db file.
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    on: jest.fn(),
    end: jest.fn(),
  };
  // We return a mock function for the Pool constructor itself
  return { Pool: jest.fn(() => mPool) };
});

// The module we want to test is loaded here, but it's important to
// ensure the mock is correctly applied.
const pool = require('../config/db');

describe('Database Connection', () => {
  beforeEach(() => {
    // Clear all mock call counts before each test.
    jest.clearAllMocks();
  });

  it('should create a new instance of the Pool', () => {
    // The key here is that the 'Pool' in this assertion is the mocked constructor
    // from the 'jest.mock' call. When the '../config/db' file was loaded,
    // its call to 'new Pool()' executed this mock function one time.
    expect(Pool).toHaveBeenCalledTimes(1);
    expect(Pool).toHaveBeenCalledWith({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  });

  it('should export a query function', async () => {
    // Verify that the exported pool object has a query function
    expect(pool.query).toBeDefined();
    expect(typeof pool.query).toBe('function');
  });

  it('should use the mocked pool to execute a query', async () => {
    // Mock a successful query response
    const mockResult = { rows: [{ now: '2023-10-27T10:00:00.000Z' }] };
    pool.query.mockResolvedValue(mockResult);

    const result = await pool.query('SELECT NOW();');

    // Verify that the mocked query function was called
    expect(pool.query).toHaveBeenCalledWith('SELECT NOW();');
    // Verify that the correct mock result was returned
    expect(result).toEqual(mockResult);
  });
});
