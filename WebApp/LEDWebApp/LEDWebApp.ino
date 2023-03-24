#include <FastLED.h>
#define NUM_LEDS 16
#define LED_PIN 2
CRGB leds[NUM_LEDS];

class Panel{

public:
  int leds_status[NUM_LEDS];
  int i;
  Panel(){
    for(i=0;i<NUM_LEDS;i++){
      leds_status[i] = 0;
    }
  }
void button(char Px, char Py){
    int intX, intY;
    intX = Px - 48;
    intY = Py - 48;

    for(int i=0; i<8;i++){
      if(intY==i && intX<8){
        leds[intX+(8*i)] = CRGB:: Red;
      }
    }
    FastLED.show();
  }
 void show_led(){
    int i;
      for(i=0;i<NUM_LEDS;i++){

        if(leds_status[i] == 1){
          leds[i] = CRGB:: Red;

          }else if(leds_status[i] == 0){
            leds[i] = CRGB:: Black;

          }
    }
    FastLED.show();
   }
};

void setup() {

  Serial.begin(9600);
  FastLED.addLeds<WS2812B, LED_PIN, GRB>(leds, NUM_LEDS);
  delay(1000);
  FastLED.setBrightness(127);

    
  for(int i = 0; i<NUM_LEDS;i++){
      leds[i] = CRGB:: Blue;
    }
  FastLED.show();
    
}

void loop() {

    
 Panel panel;
 unsigned char xLoc, yLoc;
 String buttonInfo;
  //Send JSON To Node.js
  //DynamicJsonDocument doc(1024);

  //doc["id"] = buttonInfo;
  //doc["color"] = "black";

  //serializeJson(doc, Serial);
  
   yLoc = buttonInfo[4];
   xLoc = buttonInfo[6];
   panel.button(xLoc,yLoc);
   if ((xLoc == '9') && (yLoc == '9')){
    for(int i = 0; i<NUM_LEDS;i++){
      leds[i] = CRGB:: Black;
    }
    FastLED.show();
   }
}

