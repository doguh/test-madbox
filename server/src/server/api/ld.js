const { Router } = require('express');

const router = Router();

router.get('/', async function get(req, res) {
  res.status(200).json(null);
});

router.post('/', async function post(req, res) {
  console.log('post:', req.body);
  res.status(200).json(null);
});

module.exports = router;
