const express = require('express');
const router = express.Router();
const db = require('../model/db.js');

router.get('/animations_name', (req, res) => {
    const query = 'SELECT AnimationsName FROM animations';
    db.all(query, [], (err, rows) => {
      if (err) {
        throw err;
      }
      const uniqueAnimationNames = rows.map(row => row.AnimationsName);
      
      res.json(uniqueAnimationNames);
    });
});

router.get('/getFrameNumber', (req, res) => {
    const animationName = req.query.animation_name;

    const selectQuery = `
    SELECT f.FrameNumber, f.FrameLights, f.delay
    FROM frames AS f
    JOIN animations AS a ON f.AnimationID = a.ID
    WHERE a.AnimationsName = ?
    `;

    db.all(selectQuery, [animationName], (err, rows) => {
    if (err) {
        console.error('Error', err.message);
        return;
    }

    if (rows.length === 0) {
        console.log('Animation Not Found');
        return;
    }

    const frameInfo = rows.map(row => ({
        FrameNumber: row.FrameNumber,
        FrameLights: row.FrameLights,
        FrameDelay: row.delay
    }));
    res.json(frameInfo);
    });
});

module.exports = router;