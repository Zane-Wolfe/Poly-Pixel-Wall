const db = require('../model/db.js');

exports.getNames = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT AnimationsName FROM animations';

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const animationNames = rows.map(row => row.AnimationsName);
        
        resolve(animationNames);
      });
    });
}

exports.getFrames = (newAnimationName) => {
    return new Promise((resolve, reject) => {
        const animationName = newAnimationName;

        const selectQuery = `
        SELECT f.FrameNumber, f.FrameLights, f.delay
        FROM frames AS f
        JOIN animations AS a ON f.AnimationID = a.ID
        WHERE a.AnimationsName = ?
        `;
    
        db.all(selectQuery, [animationName], (err, rows) => {
        if (err) {
            reject(err);
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

        resolve(frameInfo);
        });
    });
  }

exports.createFrame = (but_arr, text, frameNumber, delay) => {
  let but_arr_string = JSON.stringify(but_arr);

  const query = `INSERT INTO frames (AnimationID, FrameNumber, FrameLights, Delay)
  SELECT animations.ID, ?, ?, ?
  FROM animations
  WHERE animations.AnimationsName = ?`;

  const values = [frameNumber, but_arr_string, delay, text];

  db.run(query, values, function(err) {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Success, ID:', this.lastID);
    }

  });
  
}

exports.createAnimation = (animationName) => {
  const dateToday = new Date().toLocaleDateString();
  const query = `INSERT INTO animations (animationsName, CreationDate) VALUES (?,?)`;
  const values = [animationName, dateToday];

  db.run(query, values, function(err) {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Success, ID:', this.lastID);
    }

  });

}
 
exports.saveChanges = (but_arr_obj, animationName, frameNumber, delay) => {
  let but_arr_string = JSON.stringify(but_arr_obj);

  const query = `UPDATE frames
  SET FrameLights = ?,
      delay = ?
  WHERE FrameNumber = ? AND AnimationID = (
    SELECT ID FROM animations WHERE AnimationsName = ?
  );
`;

  db.run(query, [but_arr_string, delay, frameNumber, animationName], (err) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Update Sucessful');
    }
  });
}
