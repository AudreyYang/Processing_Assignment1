var particleSystem = [];//to create a new array
var attractors = [];

function setup(){
    var canvas = createCanvas(windowWidth,                                                       windowHeight);
    frameRate(300);
    
    for(var i=0; i<2; i++){
        
        var pos = createVector(width/2,
                               height/2);
        
        var vel = createVector(200,400);
        vel.rotate(random(0.5*TWO_PI, TWO_PI));
        vel.mult(random(5,10));
        
        var newBorn = new Particle(pos, vel);
        particleSystem.push(newBorn);
    }
    colorMode(HSB, 360, 100, 100, 100);

    var at = new Attractor(createVector(width/2, height/2), 5);
    attractors.push(at);
    background(0); 
}


function draw(){
//    background(255); 
    blendMode(MULTIPLY); 
    fill(255, 100);
    rect(0, 0, width, height);
    noStroke();
    
    for(var i=particleSystem.length-1; i>=0; i--){
        var p = particleSystem[i];
        if(p.areYouDeadYet()){
            //removes the particle from the array
            particleSystem.splice(i, 1);
        }else{
            //updates and renders the particle
            p.update();
            p.draw();
        }
    }
    
   if(mouseIsPressed){
       createMightyParticles();
   } 
    
    attractors.forEach(function(at){
        at.draw();
    });
    
  
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    
}

var Particle = function(position, velocity,hue){
    var position = position.copy(); //position is a vector
    var velocity = velocity.copy();
    var acceleration = createVector(0, 0.5);
    this.size = random(16, 20);
    
    var initiallifeSpan = random(150, 300);
    this.lifeSpan = initiallifeSpan;
    
     this.hue = random(hue-15, hue+15);
    
    this.update = function(){
        attractors.forEach(function(A){
            var att = p5.Vector.sub(A.getPos(), position);
            var distanceSq = att.magSq();
            if(distanceSq > 1){
                 att.div(distanceSq);
                 att.mult(100*A.getStrength());
                 acceleration.add(att);}
        })
        velocity.add(acceleration);
        position.add(velocity); 
        acceleration.mult(0);
        velocity.limit(1000);
        
        
        this.lifeSpan--;  // this.lifeSpan =                                                      this.lifeSpan -1
    }

    
    this.draw = function(){
        
        //map is linking the lifespan to transparency
        var transparency = map(this.lifeSpan, 0, initiallifeSpan, 0, 100);
        stroke(this.hue, 100, 100, transparency);
        line(position.x, position.y, 
             position.x-1*velocity.x, position.y-1*velocity.y)
        noStroke();
        fill(this.hue, 100, 100, transparency);
        ellipse(position.x,
                position.y,
                this.size,
                this.size);//x,y,centor,rx,ry?
    
    }
    this.areYouDeadYet = function(){
        
        return this.lifeSpan <= 0;
    }
    
    this.getPos = function(){
        
        return position.copy();
        
    }
}

function createMightyParticles(initialPos){

    var pos;
    if(!initialPos){pos = createVector(mouseX, mouseY);}
    else{pos = initialPos.copy();}
   
    var hue = random(0, 360);
    var saturation = random(0, 20);
    
    for(var i=0; i<5; i++){
        var vel = createVector(0,1);
        vel.rotate(random(0, TWO_PI));
        vel.mult(random(0.1,1));
        
        var newBorn = new Particle(pos, vel, hue);
         particleSystem.push(newBorn)
        }
}

//function mouseClicked(){
// createMightyParticles();
//}

var Attractor = function(pos, s){
    var pos = pos.copy();
    var strength = s;
    this.draw = function(){
        noStroke();
        fill(0, 100, 100);
        ellipse(pos.x, pos.y,
                strength, strength);
    }
    
    this.getStrength = function(){
        return strength;
    }
    this.getPos = function(){
        return pos.copy();
    }
}
