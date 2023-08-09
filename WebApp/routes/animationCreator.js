const express = require('express');
const router = express.Router();
const animations = require ('../model/animationsHandler.js');

router.use(express.json());

/*-------------------------------------------*/ 
/*                GET REQUESTS               */ 
/*-------------------------------------------*/ 
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

/*-------------------------------------------*/ 
/*                POST REQUESTS              */ 
/*-------------------------------------------*/ 

router.post('/createFrame', async (req, res) => {
  const {but_arr, name, frameNumber, delay } = req.body;
  animations.createFrame(but_arr, name, frameNumber, delay);
});

router.post('/createAnimation', async (req, res) => {
  const {animationName} = req.body;
  animations.createAnimation(animationName);
});

//Here we get the request from the webpage, change the DB with the new information
//Then we consult the DB and return the value to the webpage
router.post('/saveChanges', async (req, res) => {
  const {but_arr, animationName, frameNumber, newDelay } = req.body;
  animations.saveChanges(but_arr, animationName, frameNumber, newDelay);
  try{
    const frameInfo = await animations.getFrames(animationName);
    res.json(frameInfo);
} catch(err){
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});

module.exports = router;
