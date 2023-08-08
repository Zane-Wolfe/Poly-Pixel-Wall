const express = require('express');
const router = express.Router();
const animations = require ('../model/animationsHandler.js');

//Get request from animations page and ask DB to retrieve all animations names
router.get('/animations_name', async (req, res) => {
    try {
      const names = await animations.getNames();
      res.json(names);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
//Get request from animations page and ask DB to retrieve all frames corresponding to the name of the animation specified
router.get('/getFrameNumber', async (req, res) => {
    try{
        const frameInfo = await animations.getFrames(req.query.animation_name);
        res.json(frameInfo);
    } catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;