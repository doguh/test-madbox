const { Router } = require('express');
const ld = require('../../models/ld');

const router = Router();

router.get('/', async function get(req, res) {
  const level = await ld.get();
  console.log('get:', level);
  res.status(200).json(level);
});

router.post('/', async function post(req, res) {
  console.log('post:', req.body);
  await ld.save(req.body);
  res.status(200).json(null);
});

module.exports = router;
