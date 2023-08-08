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