let images = {};
let entities = [];

let PLAYER_X = 0;
let PLAYER_Y = 0;

let BORDER = 0;
let MIN_X = 0;
let MIN_Y = 0;
let MAX_X = 0;
let MAX_Y = 0;


class Entity {
    constructor(x, y, image, size, update_fn) {
        this.x = x;
        this.y = y;
        this.direction = Math.random()*360;
        this.image = image;
        this.size = size;
        this.update = update_fn;
    }
}


function default_walk(self,stepSize=1) {
    let x = self.x;
    let y = self.y;
    let directionAngle = self.direction; 
    // Convert the angle from degrees to radians
    const radians = (directionAngle * Math.PI) / 180;
  
    // Calculate the new coordinates
    const newX = x + stepSize * Math.cos(radians);
    const newY = y + stepSize * Math.sin(radians);
    const newDirection = directionAngle + (2*Math.random())-1;

    self.x = newX;
    self.y = newY;

}

function size_range(n,m){
    return (Math.random()*(m-n))+n
}

const Character = function (pos) {
    return new Entity(0, 0, images['character'], 100, function () {
        this.x = PLAYER_X+windowWidth/2;
        this.y = PLAYER_Y+windowHeight/2;
    });
}


const Fire = function (pos) {
    return new Entity(pos.x, pos.y, images['fire'], 70, function () {

    });
}

const Stone = function (pos) {
    return new Entity(pos.x, pos.y, images['stone'], size_range(60,70), function () {

    });
}

const Grass = function (pos) {
    return new Entity(pos.x, pos.y, images['grass'], size_range(60,70), function () {

    });
}


const Berries = function (pos) {
    return new Entity(pos.x, pos.y, images['berries'], size_range(60,70), function () {

    });
}

const Fence = function (pos) {
    return new Entity(pos.x, pos.y, images['fence'], 125, function () {
        
    });
}

const Tree = function (pos) {
    return new Entity(pos.x, pos.y, images['tree'], size_range(200,300), function () {
        
    });
}

const Grave = function (pos) {
    return new Entity(pos.x, pos.y, images['grave'], 50, function () {
        
    });
}

const Wood = function (pos) {
    return new Entity(pos.x, pos.y, images['wood'], size_range(50,60), function () {
        
    });
}


const Bunny = function (pos) {
    return new Entity(pos.x, pos.y, images['bunny'], size_range(40,60), function () {
        default_walk(this,1);
    });
}

const Bird = function (pos) {
    return new Entity(pos.x, pos.y, images['bunny'], size_range(40,60), function () {
        default_walk(this,1);
    });
}


const Ghost = function (pos) {
    return new Entity(pos.x, pos.y, images['ghost'], size_range(50,70), function () {
        default_walk(this,1);
    });
}

const Eye = function (pos) {
    return new Entity(pos.x, pos.y, images['eye'], size_range(20,40), function () {
        distance =  Math.sqrt((PLAYER_X - this.x+windowWidth/2) ** 2 + (PLAYER_Y - this.y+windowHeight/2) ** 2);


        if(distance>700){
            this.size = 50;
        }if(distance<100){
            this.size = 1;
        }else{
            this.size = distance/10;
        }
        
    });
}


function makeCluster(entities){
    return function(pos){
        out = [];
        for(var i in entities){
            let entity = entities[i][0];
            let offset_pos = entities[i][1];
            
            out.push(entity({
                x:pos.x+offset_pos.x,
                y:pos.y+offset_pos.y
            }))
         
        }
        return out;
    }
        
}

cemeteryCluster = [
    [Grave,{x:0,y:0}],
    [Grave,{x:100,y:0}],
    [Grave,{x:-100,y:0}],
].concat(Array.from({ length: 10 }, (_, k) => [Eye,{x:(Math.random()*200-100),y:Math.random()*100-150}]));

fenceCluster = [
    [Fence,{x:0,y:0}],
    [Fence,{x:100,y:0}],
    [Fence,{x:-100,y:0}],
]

grassCluster = Array.from({ length: 5 }, (_, k) => [Grass,{x:(Math.random()*200-100),y:(Math.random()*200-100)}])

function distance(x1,y1,x2,y2){
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}




function preload() {
    BORDER = 500;
    MIN_X = 0 + BORDER;
    MIN_Y = 0 + BORDER;

    MAX_X = windowWidth*10 - BORDER;
    MAX_Y = windowHeight*10 + BORDER;

    PLAYER_X = MAX_X/2;
    PLAYER_Y = MAX_Y/2;
    function getRandomSpawn() {
        return { x: Math.random() * (MAX_X-2*BORDER) + BORDER, y: Math.random() * (MAX_Y-2*BORDER) + BORDER};
    }


    function generateDisjointClusters(n,min_dist = 100){
    
        var clusters = [];
        while(clusters.length < n){
            let pos = getRandomSpawn();
            for(var i=0;i<clusters.length;i++){
                if(distance(pos.x,pos.y,clusters[i].x,clusters[i].y)<min_dist){
                    break;
                }
            }
            if(i>=clusters.length){
                clusters.push(pos);
            }
        }
        return clusters;
    }

    function duplicate(entity, num, args = null) {
        var out = [];
        for (var i = 0; i < num; i++) {
            if (args == null) {
                temp_args = getRandomSpawn();
            }
            out.push(entity(args || temp_args));
        }
        return out;
    }

    //Load Images
    images['background'] = loadImage('./assets/output.png');
    images['background_filter'] = loadImage('./assets/background_filter.png');

    images['character'] = loadImage('./assets/character.png');

    images['fire'] = loadImage('./assets/fire.png');
    images['stone'] = loadImage('./assets/stone.png');
    images['berries'] = loadImage('./assets/berries.png');
    images['grass'] = loadImage('./assets/grass.png');
    images['wood'] = loadImage('./assets/woodstump.png');
    images['tree'] = loadImage('./assets/trees.png');
    images['fence'] = loadImage('./assets/fence.png');
    images['grave'] = loadImage('./assets/grave.png');

    images['bunny'] = loadImage('./assets/bunny.png');
    images['bird'] = loadImage('./assets/bird.png');

    images['ghost'] = loadImage('./assets/ghost.png');
    images['eye'] = loadImage('./assets/eye.png');

    clusters = generateDisjointClusters(100);

    //Load Entities
    // entities = [
    //     Bunny(getRandomSpawn()),
    //     Fire(getRandomSpawn()),
    //     Stone(getRandomSpawn()),
    //     Grass(getRandomSpawn()),
    //     Berries(getRandomSpawn()),
    //     Wood(getRandomSpawn()),
    //     Ghost(getRandomSpawn()),
    //     Eye(getRandomSpawn())
    // ]
    entities =
        [   
            duplicate(makeCluster(cemeteryCluster), 100).flat(1),
            duplicate(makeCluster(fenceCluster), 100).flat(1),
            duplicate(makeCluster(grassCluster), 100).flat(1),
            
            // [Character()],
            // duplicate(makeCluster(cemeteryCluster),100).flat(1)
            duplicate(Bunny, 100),
            duplicate(Fire, 100),
            duplicate(Stone, 100),
            duplicate(Grass, 100),
            duplicate(Berries, 100),
            duplicate(Wood, 100),
            duplicate(Ghost, 100),
            duplicate(Eye, 100),

            duplicate(Fence, 100),
            duplicate(Tree, 100),
            duplicate(Bird, 100),
        ].flat(1);

    setInterval(function () {
        for (i in entities) {
            const entity = entities[i];
            entity.update();
        }
    }, 1);

}

function setup() {

    createCanvas(windowWidth, windowHeight);
 
    
}

function draw() {
    background(0); // Set the background to black.
    // Determine the image's position and size on the canvas.
    const imageWidth = 200;
    const imageHeight = 150;
    const padding = 50;
    let x = padding;
    let y = padding;

    //Draw background images
    image(images["background"], 0-PLAYER_X, 0-PLAYER_Y, windowWidth*10, windowHeight*10);
    drawImageWithAspectRatio(images["character"], 100, windowWidth / 2, windowHeight / 2);

    entities = entities.sort((a, b) => (a.y - b.y));
    
    for (i in entities) {
        const entity = entities[i];
        drawImageWithAspectRatio(entity.image, entity.size, entity.x-PLAYER_X, entity.y-PLAYER_Y)
    }
    tint(255, 255);
    image(images["background_filter"], 0, 0, windowWidth, windowHeight);
    noTint();
    
    updatePlayerPosition();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function drawImageWithAspectRatio(img, targetWidth, x, y) {
    const aspectRatio = img.width / img.height;
    const targetHeight = targetWidth / aspectRatio;
    image(img, x - targetWidth / 2, y - targetHeight / 2, targetWidth, targetHeight);
}



// Flags to track arrow key states
let leftArrowPressed = false;
let upArrowPressed = false;
let rightArrowPressed = false;
let downArrowPressed = false;

// Function to update player position based on arrow key input
function updatePlayerPosition() {
  const stepSize = 5; // Adjust the step size according to your preference

  if (leftArrowPressed) {
    PLAYER_X -= stepSize;
  }
  if (upArrowPressed) {
    PLAYER_Y -= stepSize;
  }
  if (rightArrowPressed) {
    PLAYER_X += stepSize;
  }
  if (downArrowPressed) {
    PLAYER_Y += stepSize;
  }

}

// Event listener for keydown event to set arrow key flags
document.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 37: // Left arrow key
      leftArrowPressed = true;
      break;
    case 38: // Up arrow key
      upArrowPressed = true;
      break;
    case 39: // Right arrow key
      rightArrowPressed = true;
      break;
    case 40: // Down arrow key
      downArrowPressed = true;
      break;
  }
});

// Event listener for keyup event to reset arrow key flags
document.addEventListener('keyup', (event) => {
  switch (event.keyCode) {
    case 37: // Left arrow key
      leftArrowPressed = false;
      break;
    case 38: // Up arrow key
      upArrowPressed = false;
      break;
    case 39: // Right arrow key
      rightArrowPressed = false;
      break;
    case 40: // Down arrow key
      downArrowPressed = false;
      break;
  }
});