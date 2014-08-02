// Board properties
var width = 600;
var height = 450;

// Enemy properties
var enemyR = 15; // hero is same size
var numEnemies = 20;
var enemyX;
var enemyY;
var enemyPic = 'shuriken.png';
var enemyPicOffset = enemyR/50; // for pictures that don't go from border to border
var positions = [];

// Hero properties
var heroShape = 'circle';
var heroR = enemyR; // from enemy
var heroX = (width)/2;
var heroY = (height)/2;
var heroColor = 'yellow';

// Time properties in milliseconds
var transitionDuration = 1000;
var updatePositionDuration = 1000;
var updateCollisionDuration = 25;
var updateScoreDuration = 50;

// Score properties
var colTimes = 0;
var score = 0;
var highScore = 0;

// Create board
d3.select('.board').style('height', height + 'px')
                   .style('width', width + 'px');

// Create svg
var svg = d3.select('.board').append('svg').attr('height', height).attr('width', width);
var enemies;

// Create array of random positions
var createPositions = function(){
  for(var i = 0; i < numEnemies; i++) {
    enemyX = Math.random() * (width - enemyR * 2);
    enemyY = Math.random() * (height - enemyR  * 2);
    positions[i] = {x: enemyX, y: enemyY};
  }
};

// Assign positions and radius (size) to all enemies!
var assignPositions = function() {
  enemies.transition().duration(transitionDuration)
         .attr('x', function(d) { return d.x; })
         .attr('y', function(d) { return d.y; })
         .attr('height', enemyR * 2)
         .attr('width', enemyR * 2)
         .attr('xlink:href', enemyPic);
};

// Run the initialize function immediately
var initialize = function() {
  createPositions();
  // Tell the enemies to appear for the first time
  enemies = svg.selectAll('image').data(positions).enter().append('image');
  assignPositions();
}();

// Update the enemies with new positions
var updatePositions = function() {
  createPositions();
  enemies = svg.selectAll('image').data(positions);
  assignPositions();
};

// Add the hero to the board
var hero = svg.append(heroShape)
              .attr('r', heroR)
              .attr('cx', heroX)
              .attr('cy', heroY)
              .attr('fill', heroColor);

// Define drag functionality
var dragMove = function() {
  d3.select(this).attr('cx', Math.max(heroR, Math.min(width - heroR, d3.event.x)))
                 .attr('cy', Math.max(heroR, Math.min(height - heroR, d3.event.y)));
};

var drag = d3.behavior.drag()
             .origin(function() {
                    var t = d3.select(this);
                    return {'x': t.attr('cx'), 'y': t.attr('cy')};
                  })
             .on('drag', dragMove);

// Tell hero to listen for the drag event!
hero.call(drag);

var updateCollisions = function() {
  var heroX = hero.attr('cx');
  var heroY = hero.attr('cy');
  var enemyX;
  var enemyY;
  var squareDiffX;
  var squareDiffY;
  // Check for collisions
  for(var i = 0; i < enemies[0].length; i++) {
    enemyX = enemies[0][i].x.animVal.value;
    console.log(enemyX);
    enemyY = enemies[0][i].y.animVal.value;
    squareDiffX = Math.pow(heroX - heroR - enemyX, 2);
    squareDiffY = Math.pow(heroY - heroR - enemyY, 2);
    if(Math.sqrt(squareDiffX + squareDiffY) <= heroR + enemyR - enemyPicOffset) {
      // Update collision count
      colTimes++;
      d3.select('.collisions').select('span').text(colTimes);
      // Reset score
      score = 0;
      return;
    }
  }
};

var updateScore  = function() {
// Update score
  score++;
  d3.select('.current').select('span').text(score);
  // Update high school if needed
  if(score > highScore) {
    highScore = score;
    d3.select('.high').select('span').text(highScore);
  }
};

// Update the enemies' positions
setInterval(updatePositions, updatePositionDuration);

// Update the collision count
setInterval(updateCollisions, updateCollisionDuration);

// Update the score
setInterval(updateScore, updateScoreDuration);
