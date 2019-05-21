async function post(url, data) {
  return fetch(`/api/${url}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

module.exports = {
  post,
};
