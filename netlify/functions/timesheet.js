// Netlify Function: save and retrieve timesheet data
// Uses Netlify Blobs — built-in storage, no extra signup, free on all plans.
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const store = getStore('timesheets');
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'POST') {
      // Save a timesheet. If an id is included, update that existing record
      // (used when the supervisor finishes and adds the PDF). Otherwise
      // create a brand new record and return a fresh short id.
      const data = JSON.parse(event.body);
      const id = data.id || Math.random().toString(36).substring(2, 10);
      await store.setJSON(id, data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ id })
      };
    }

    if (event.httpMethod === 'GET') {
      const id = event.queryStringParameters && event.queryStringParameters.id;
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing id' }) };
      }
      const data = await store.get(id, { type: 'json' });
      if (!data) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
