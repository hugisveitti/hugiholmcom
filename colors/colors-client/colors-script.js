let objects = [];
let numberOfObjects = 5;
const width = 400;
const height = 400;
let pixelD;
let draggingOtherObject = false;
let area = [];

let selectedObject;
class MyObject {
  constructor() {
    this.r = 80;
    this.x = Math.floor((Math.random() * width) / 2);
    this.y = Math.floor((Math.random() * width) / 2);
    this.red = Math.floor(random(255));
    this.blue = Math.floor(random(255));
    this.green = Math.floor(random(255));
    this.alpha = 255;
    this.color = color(this.red, this.green, this.blue, this.alpha);
    this.dragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.vx = Math.random() * 2 + 0.5;
    this.vy = Math.random() * 2 + 0.5;
    this.cx = this.vx;
    this.cy = this.vy;
    this.move = true;
    this.sliderCreated = false;
  }

  getColor() {
    return {
      objRed: red(this.color),
      objBlue: blue(this.color),
      objGreen: green(this.color),
      objAlpha: alpha(this.color),
    };
  }
  getIndex() {
    return {
      x0: Math.floor(this.x),
      xN: Math.floor(this.x + this.r),
      y0: Math.floor(this.y),
      yN: Math.floor(this.y + this.r),
    };
  }

  createSlider() {
    const sliders = document.getElementsByClassName("slider");
    while (sliders.length > 0) {
      sliders[0].remove();
    }

    const rSlider = createSlider(0, 255, this.red);
    rSlider.position(450, 10);
    rSlider.style("width", "80px");
    rSlider.attribute("class", "slider");
    rSlider.elt.addEventListener("mousemove", (e) => {
      this.red = Math.floor(e.target.value);
      this.color = color(this.red, this.green, this.blue, this.alpha);
    });
    const gSlider = createSlider(0, 255, this.green);
    gSlider.attribute("class", "slider");
    gSlider.position(450, 40);
    gSlider.style("width", "80px");
    gSlider.elt.addEventListener("mousemove", (e) => {
      this.green = Math.floor(e.target.value);
      this.color = color(this.red, this.green, this.blue, this.alpha);
    });

    const bSlider = createSlider(0, 255, this.blue);
    bSlider.attribute("class", "slider");
    bSlider.position(450, 70);
    bSlider.style("width", "80px");
    bSlider.elt.addEventListener("mousemove", (e) => {
      this.blue = Math.floor(e.target.value);
      this.color = color(this.red, this.green, this.blue, this.alpha);
    });

    const aSlider = createSlider(0, 255, this.alpha);
    aSlider.attribute("class", "slider");
    aSlider.position(450, 100);
    aSlider.style("width", "80px");
    aSlider.elt.addEventListener("mousemove", (e) => {
      this.alpha = Math.floor(e.target.value);
      this.color = color(this.red, this.green, this.blue, this.alpha);
    });
  }

  draw() {
    if (mouseIsPressed) {
      if (
        !draggingOtherObject &&
        !this.dragging &&
        mouseX > this.x &&
        mouseX < this.x + this.r &&
        mouseY > this.y &&
        mouseY < this.y + this.r
      ) {
        draggingOtherObject = true;
        this.dragging = true;
        this.dragOffsetX = mouseX - this.x;
        this.dragOffsetY = mouseY - this.y;
        if (!this.sliderCreated) {
          this.createSlider();
          this.sliderCreated = true;
        }
      }
    } else {
      draggingOtherObject = false;
      this.dragging = false;
      this.sliderCreated = false;
    }

    if (this.dragging) {
      if (mouseX < this.x + this.dragOffsetX) {
        this.vx = -this.cx;
      } else {
        this.vx = this.cx;
      }
      if (mouseY < this.y + this.dragOffsetY) {
        this.vy = -this.cy;
      } else {
        this.vy = this.cy;
      }
      this.x = mouseX - this.dragOffsetX;
      this.y = mouseY - this.dragOffsetY;
    } else if (this.move) {
      if (this.x > width - this.r && this.vx > 0) {
        this.vx = -this.cx;
      } else if (this.x < 0 && this.vx < 0) {
        this.vx = this.cx;
      }

      if (this.y > height - this.r && this.vy > 0) {
        this.vy = -this.cy;
      } else if (this.y < 0 && this.vy < 0) {
        this.vy = this.cy;
      }
      this.x += this.vx;
      this.y += this.vy;
    }
  }
}

function setup() {
  console.log("setup");
  console.log(width, height);
  const cvn = createCanvas(width, height);
  cvn.parent("canvascontainer");
  colorMode(RGB, 255);
  for (let i = 0; i < numberOfObjects; i++) {
    let c = new MyObject();
    objects.push(c);
  }

  loadPixels();
  area = new Array(pixels.length);
  updatePixels();

  const button = createButton("add");
  button.position(19, 19);
  button.mousePressed(addObject);
  const button2 = createButton("move");
  button2.position(19, 49);
  button2.mousePressed(stopAll);
  frameRate(150);
}

function draw() {
  for (let i = 0; i < area.length; i++) {
    area[i] = 0;
    if (i % 4 === 0) area[i] = 255;
    if (i % 4 === 3) {
      area[i] = 250;
    }
  }

  for (let i = 0; i < objects.length; i++) {
    objects[i].draw();
    let { objRed, objGreen, objBlue, objAlpha } = objects[i].getColor();
    let { x0, xN, y0, yN } = objects[i].getIndex();

    console.log("width", width);
    for (let x = x0; x < xN; x++) {
      for (let y = y0; y < yN; y++) {
        let index = (y * width + x) * 4;
        // console.log("index", index);

        area[index] += objRed;
        area[index + 1] += objGreen;
        area[index + 2] += objBlue;
        area[index + 3] += objAlpha;
      }
    }
  }
  loadPixels();
  for (let i = 0; i < area.length; i++) {
    pixels[i] = area[i];
  }
  console.log("al", area.length);
  console.log("p le", pixels.length);
  updatePixels();
  noLoop();
}

function addObject() {
  let c = new MyObject();
  objects.push(c);
}

function stopAll() {
  for (let i = 0; i < objects.length; i++) {
    objects[i].move = !objects[i].move;
  }
}
