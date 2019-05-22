async function req(url, options) {
  const res = await fetch(`/api/${url}`, options);
  if (res.ok) {
    return res.json();
  } else {
    throw res;
  }
}

async function post(url, data) {
  return req(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

async function get(url) {
  return req(url);
}

module.exports = {
  post,
  get,
};
