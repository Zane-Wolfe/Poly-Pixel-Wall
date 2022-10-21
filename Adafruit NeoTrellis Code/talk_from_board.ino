/* This example shows basic usage of the
MultiTrellis object controlling an array of
NeoTrellis boards

As is this example shows use of two NeoTrellis boards
connected together with the leftmost board having the
default I2C address of 0x2E, and the rightmost board
having the address of 0x2F (the A0 jumper is soldered)
*/

#include "Adafruit_NeoTrellis.h"
#include <ArduinoJson.h>

StaticJsonDocument<500> doc;

#define Y_DIM 8 //number of rows of key
#define X_DIM 8 //number of columns of keys

//create a matrix of trellis panels
Adafruit_NeoTrellis t_array[4][4] = {
  
  { Adafruit_NeoTrellis(0x2F),
  Adafruit_NeoTrellis(0x2E),
  Adafruit_NeoTrellis(0x32),
  Adafruit_NeoTrellis(0x30) 
  }
  
};

bool clicked[64] = {0};
bool _read = true;
//for(int i=0;i<64;i++)
//  clicked[i]='false';


/*
If you were using a 2x2 array of NeoTrellis boards, the above lines would be:

#define Y_DIM 8 //number of rows of key
#define X_DIM 8 //number of columns of keys

//create a matrix of trellis panels
Adafruit_NeoTrellis t_array[Y_DIM/4][X_DIM/4] = {
  
  { Adafruit_NeoTrellis(0x2E), Adafruit_NeoTrellis(0x2F) },

  { Adafruit_NeoTrellis(LOWER_LEFT_I2C_ADDR), Adafruit_NeoTrellis(LOWER_RIGHT_I2C_ADDR) }
  
};
*/

//pass this matrix to the multitrellis object
Adafruit_MultiTrellis trellis((Adafruit_NeoTrellis *)t_array, Y_DIM/4, X_DIM/4);

// Input a value 0 to 255 to get a color value.
// The colors are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  if(WheelPos < 85) {
   return seesaw_NeoPixel::Color(WheelPos * 3, 255 - WheelPos * 3, 0);
  } else if(WheelPos < 170) {
   WheelPos -= 85;
   return seesaw_NeoPixel::Color(255 - WheelPos * 3, 0, WheelPos * 3);
  } else {
   WheelPos -= 170;
   return seesaw_NeoPixel::Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  return 0;
}
 
//define a callback for key presses
TrellisCallback onoff(keyEvent evt){
  //Serial.println(evt.bit.NUM);
  if(evt.bit.EDGE == SEESAW_KEYPAD_EDGE_RISING && !(clicked[evt.bit.NUM]))
  {
    trellis.setPixelColor(evt.bit.NUM, Wheel(map(evt.bit.NUM, 0, X_DIM*Y_DIM, 0, 255))); //on rising
    clicked[evt.bit.NUM] = true;
    doc["id"] = evt.bit.NUM;
    doc["color"] = Wheel(map(evt.bit.NUM, 0, X_DIM*Y_DIM, 0, 255));
    doc["x"] = evt.bit.NUM % 8;
    doc["y"] =  evt.bit.NUM / 8;
    serializeJson(doc, Serial1);
    serializeJson(doc, Serial);
  }
  else if(evt.bit.EDGE == SEESAW_KEYPAD_EDGE_RISING && (clicked[evt.bit.NUM])/*evt.bit.EDGE == SEESAW_KEYPAD_EDGE_FALLING*/)
  {
    trellis.setPixelColor(evt.bit.NUM, 0); //off falling
    clicked[evt.bit.NUM] = false;
    doc["id"] = evt.bit.NUM;
    doc["color"] = Wheel(map(evt.bit.NUM, 0, X_DIM*Y_DIM, 0, 255));
    doc["x"] = evt.bit.NUM % 8;
    doc["y"] =  evt.bit.NUM / 8;
    serializeJson(doc, Serial1);
    serializeJson(doc, Serial);
  }
  
  trellis.show();
  return 0;
}

TrellisCallback wave(keyEvent evt){
  if(evt.bit.EDGE == SEESAW_KEYPAD_EDGE_RISING)
  {
    //_read = false;
    int stepStart[15] = {0, 1, 2, 3, 4, 5, 6, 7, 15, 23, 31, 39, 47, 55, 63};
    int RowLen[15] =    {1, 2, 3, 4, 5, 6, 7, 8,  7,  6,  5,  4,  3,  2, 1};
    
    for (int st = 0; st < 15; st++)
    {
      for (int light = 0; light < RowLen[st] ; light++)
      {
        trellis.setPixelColor(stepStart[st] + ((light) * 7), Wheel(map(stepStart[st] + ((light) * 7), 0, X_DIM*Y_DIM, 0, 255)));
      }
      trellis.show();
      delay(50);
    }
    
    for (int st = 0; st < 15; st++)
    {
    
      for (int light = 0; light < RowLen[st] ; light++)
      {
        trellis.setPixelColor(stepStart[st] + ((light) * 7), 0);
      }

      trellis.show();
      delay(50);
    }
    //_read = true;
  }
}

void setup() {
  Serial.begin(9600);
  //while(!Serial) delay(1);

  if(!trellis.begin()){
    Serial.println("failed to begin trellis");
    while(1) delay(1);
  }

  // 0xblue red green
  /* the array can be addressed as x,y or with the key number */
  for(int i=0; i<Y_DIM*X_DIM; i++){

      trellis.setPixelColor(i, Wheel(map(i, 0, X_DIM*Y_DIM, 0, 255))); //addressed with keynum
      trellis.show();
      delay(10);
  }
  
  for(int y=0; y<Y_DIM; y++){
    for(int x=0; x<X_DIM; x++){
      //activate rising and falling edges on all keys
      trellis.activateKey(x, y, SEESAW_KEYPAD_EDGE_RISING, true);
      trellis.activateKey(x, y, SEESAW_KEYPAD_EDGE_FALLING, true);
      trellis.registerCallback(x, y, onoff);
      trellis.registerCallback(0, 0, wave);
      trellis.setPixelColor(x, y, 0x000000); //addressed with x,y
      trellis.show(); //show all LEDs
      delay(10);
    }
  }

}

void loop() {
  Serial1.begin(9600);
  trellis.read();
  delay(20);
}
