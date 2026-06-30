// Netlify Function: save and retrieve timesheet data
// Uses jsonblob.com — a free, anonymous JSON storage API. No signup, no API
// keys, no dependency packages required. This avoids the Netlify Blobs
// "MissingBlobsEnvironmentError" issue that some Netlify accounts run into.

const BASE = 'https://jsonblob.com/api/jsonBlob';

exports.handler = async (event) => {
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
      const data = JSON.parse(event.body);

      if (data.id) {
        // Update an existing record
        const putRes = await fetch(`${BASE}/${data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!putRes.ok) throw new Error('Update failed');
        return { statusCode: 200, headers, body: JSON.stringify({ id: data.id }) };
      }

      // Create a new record
      const postRes = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!postRes.ok) throw new Error('Create failed');
      const location = postRes.headers.get('location') || '';
      const id = location.split('/').pop();
      if (!id) throw new Error('No id returned');
      return { statusCode: 200, headers, body: JSON.stringify({ id }) };
    }

    if (event.httpMethod === 'GET') {
      const id = event.queryStringParameters && event.queryStringParameters.id;
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing id' }) };
      }
      const getRes = await fetch(`${BASE}/${id}`);
      if (!getRes.ok) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      }
      const data = await getRes.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
