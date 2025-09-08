function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  ellipseMode(CENTER);
}

let lastMinute = -1;

function draw() {
  background(220);
  
  let hr = hour();
  let min = minute();
  let sec = second();
  
  // logging minute value in console
  if (min !== lastMinute) {
    console.log("Minute:", min);
    lastMinute = min;
  }

  // positions for bottles
  let xs = [150, 300, 450];
  let y = 300;
  
  // fill amounts
  let fills = [hr / 24, min / 60, sec / 60];
  let values = [hr, min, sec];

  // draw bottles
  for (let i = 0; i < xs.length; i++) {
    drawBottle(xs[i], y, 100, 250, fills[i], values[i], i);
  }
}

function drawBottle(x, y, w, h, fillAmount, timeValue, bottleType) {
  push();
  translate(x, y);
  
  // bottle shapes
  let capY = -h/2 - 40;     // cap ellipse center Y
  let capW = 40;            // cap ellipse width
  let capH = 20;
  
  let neckH = 32;           // height of neck section
  let bottleTop = -h/2;     // top of bottle body
  let bottleBottom = h/2;   // bottom of bottle
  
  let bodyW = w;            // main body width
  let neckTopW = capW + 7;  // water width just under cap
  let neckBottomW = bodyW - 2; // water width at bottleTop
  
  // bottle outline
  stroke(0);
  strokeWeight(2);
  fill(220);
  
  // cap
  fill(255);
  ellipse(0, capY, capW, capH);
  
  // neck lines (diagonal inwards)
  line(capW/2 - 1, capY, bodyW/2, bottleTop);
  line(-capW/2 + 1, capY, -bodyW/2, bottleTop);
  
   // bottle body
  line(bodyW/2, bottleTop, bodyW/2, bottleTop + h);
  line(-bodyW/2, bottleTop, -bodyW/2, bottleTop + h);
  line(bodyW/2, bottleTop + h, -bodyW/2, bottleTop + h);
  
  // markers
  drawTimeMarkers(bottleType, bodyW, h, neckH, bottleTop, bottleBottom);
  
  // water fill
  noStroke();
  fill(0, 180, 255, 200);

  // max fill height (stop just below cap)
  let maxFillHeight = h + neckH;
  let waterHeight = maxFillHeight * fillAmount;

  if (waterHeight <= h) {
    // water only inside the main body
    let waterY = bottleBottom - waterHeight / 2;
    rect(0, waterY, bodyW, waterHeight);
    
  } else {
    // fill bottle body fully
    rect(0, 0, bodyW - 4, h); 
  
    // water needs to go into neck area
    let neckWaterHeight = waterHeight - h;
   
    // water shrinks at neck, horizontal slicing
    for (let i = 0; i < neckWaterHeight; i += 2) {
      let t = i / neckH; // 0 = bottom of neck, 1 = top of neck
      let currentWidth = lerp(neckBottomW, neckTopW, t);
      let currentY = bottleTop - i;
      rect(0, currentY, currentWidth, 2, 2);
    }
  }
  
  pop();
}


function drawTimeMarkers(bottleType, bodyW, bodyH, neckH, bottleTop, bottleBottom) {

  // fill from bottom of body to top of neck
  let waterFillTop = bottleTop - neckH;
  let waterFillBottom = bottleBottom;
  
  // markers
  let bodyFillTop = bottleTop;
  let bodyFillBottom = bottleBottom;
  
  if (bottleType === 0) {
    // hour markers, 24-period
    for (let h = 0; h < 24; h++) {
      let ratio = h / 24.0;
      let markerY = lerp(waterFillBottom, waterFillTop, ratio);
      
    // line every 3 hours
      if (h % 3 === 0) {
        stroke(0);
        strokeWeight(1.5);
        line(-bodyW/2, markerY, bodyW/2, markerY);
        
        let hour12 = h % 12 === 0 ? 12 : h % 12;
        let period = h < 12 ? "AM" : "PM";
        let label = hour12 + "" + period;
        
        // label
        push();
        noStroke();
        fill(0);
        textSize(12);
        textAlign(RIGHT, CENTER);
        text(label, -bodyW/2 - 5, markerY);
        pop();
        
        }
      }
    } else {
      // minutes and second
      for (let m = 0; m < 60; m++) {
        let ratio = m / 60.0;
        let markerY = lerp(waterFillBottom, waterFillTop, ratio);
        
        // line every 15 units
        if (m % 15 === 0) {
          stroke(0);
          strokeWeight(1.5);
          line(-bodyW/2, markerY, bodyW/2, markerY);
          
          
        // label
        push();
        noStroke();
        fill(0);
        textSize(12);
        textAlign(RIGHT, CENTER);
        text(m, -bodyW/2 - 5, markerY);
        pop();
        }
      }
    }
  }