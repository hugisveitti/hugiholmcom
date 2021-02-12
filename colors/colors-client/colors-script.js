let objects = [];
let numberOfObjects = 5;
let width = 600;
let height = 400;
let pixelD;
let draggingOtherObject = false;
const area = [];

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
    this.vx = 1;
    this.vy = 1.5;
    this.cx = 1;
    this.cy = 1.5;
    this.move = false;
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
  const cvn = createCanvas(width, height);
  cvn.parent("canvascontainer");
  colorMode(RGB, 255);
  for (let i = 0; i < numberOfObjects; i++) {
    let c = new MyObject();
    objects.push(c);
  }

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let index = 4 * (i + j * width);
      area[index] = 0;
      area[index + 1] = 0;
      area[index + 2] = 255;
      area[index + 3] = 255;
    }
  }

  const button = createButton("add");
  button.position(19, 19);
  button.mousePressed(addObject);
}

function draw() {
  for (let i = 0; i < area.length; i++) {
    area[i] = 0;
    if (i % 4 === 3) {
      area[i] = 0;
    }
  }

  for (let i = 0; i < objects.length; i++) {
    objects[i].draw();
    let { objRed, objGreen, objBlue, objAlpha } = objects[i].getColor();
    for (let x = objects[i].x; x < objects[i].r + objects[i].x; x++) {
      for (let y = objects[i].y; y < objects[i].r + objects[i].y; y++) {
        let index = (x + y * width) * 4;

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
  updatePixels();
  //noLoop();
}

function addObject() {
  let c = new MyObject();
  objects.push(c);
}
