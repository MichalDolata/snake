/**
 * Created by preb on 10.05.16.
 */
$(document).ready(function () {
    var offsetX = 5;
    var offsetY = 30;
    var sizeOfSegment = 10;
    var Key = Object.freeze({Up: 87, Down: 83, Left: 65, Right: 68});

    var Snake = function() {
        this.segments = [];
        for(var i = 0; i < 4; i++) {
            this.segments.unshift({x: i*sizeOfSegment, y: 0});
        }
        this.direction = 'right';
        this.canTurn = true;
        this.move = function(newSegment) {
            if(!newSegment) {
                this.segments.pop();
            }

            var newHead = {x: this.segments[0].x, y: this.segments[0].y};

            switch(this.direction) {
                case 'left':
                    newHead.x -= sizeOfSegment;
                    break;
                case 'right':
                    newHead.x += sizeOfSegment;
                    break;
                case 'up':
                    newHead.y -= sizeOfSegment;
                    break;
                case 'down':
                    newHead.y += sizeOfSegment;
                    break;
            }

            this.segments.unshift(newHead);
        };
    };

    var Render = function() {
        this.canvas = $("#snake");
        this.context = this.canvas.get(0).getContext("2d");
        this.drawFood = function(food) {
            var context = this.context;

            context.fillStyle = "black";
            context.fillRect(food.x + offsetX, food.y + offsetY, sizeOfSegment, sizeOfSegment);
        };
        this.drawSegment = function(segment) {
            var context = this.context;

            context.strokeStyle = "black";
            context.strokeRect(segment.x + offsetX, segment.y + offsetY, sizeOfSegment, sizeOfSegment);
        };
        this.drawScore = function(score) {
            var context = this.context;

            context.fillStyle = "black";
            context.font = "20px serif";
            context.textBaseline = "top";
            context.fillText("Points: " + score, 5, 5);
        };
        this.drawLost = function() {
            var context = this.context;

            context.fillStyle = "black";
            context.font = "40px serif";
            context.textBaseline = "top";
            context.fillText("GAME OVER!", offsetX+25, offsetY+100);
        }
        this.drawGame = function(game) {
            var context = this.context;
            // drawing border
            context.fillStyle = "white";
            context.fillRect(0, 0, 310, 280);

            context.strokeStyle = "black";
            context.strokeRect(4, 29, 301, 251);

            this.drawScore(game.points);

            var snake = game.snake.segments;
            var food = game.food;
            var i;
            for(i = 0; i < snake.length; i++) {
                this.drawSegment(snake[i]);
            }
            for(i = 0; i < food.length; i++) {
                this.drawFood(food[i]);
            }
        };
    };

    var game = {
        points: 0,
        snake: {},
        render: new Render(),
        food: [],
        gameSpeed: 200,
        interval: 0,
        initGame: function() {
            this.snake = new Snake();
            this.points = 0;
            this.food = [];
            for(var i = 0; i < 4; i++) {
                this.addFood();
            }
            var game = this;
            var snake = this.snake;
            this.interval = setInterval(function() { game.gameLoop()}, this.gameSpeed);

            $(document).keydown(function(event) {
                if(snake.canTurn) {
                    switch (event.keyCode) {
                        case Key.Up:
                            if (snake.direction != 'down') {
                                snake.direction = 'up';
                            }
                            break;
                        case Key.Down:
                            if (snake.direction != 'up') {
                                snake.direction = 'down';
                            }
                            break;
                        case Key.Left:
                            if (snake.direction != 'right') {
                                snake.direction = 'left';
                            }
                            break;
                        case Key.Right:
                            if (snake.direction != 'left') {
                                snake.direction = 'right';
                            }
                            break;
                    }
                    snake.canTurn = false;
                }
            });
        },
        detectCollision: function() {
            var head = this.snake.segments[0];
            var segments = this.snake.segments;

            if(head.x < 0 || head.x > 290 || head.y < 0 || head.y > 240) {
                return true;
            } else {
                for(var i = 1; i < segments.length; i++)
                {
                    if(head.x === segments[i].x && head.y === segments[i].y) {
                        return true;
                    }
                }
            }
            return false;
        },
        detectFoodGrab: function() {
            var head = this.snake.segments[0];
            for(var i = 0; i < this.food.length; i++) {
                if(head.x === this.food[i].x && head.y === this.food[i].y) {
                    this.food.splice(i, 1);
                    return true;
                }
            }
            return false;
        },
        addFood: function() {
            this.food.push({x: Math.floor(Math.random() * 28 + 1)*10, y: Math.floor(Math.random() * 23 + 1)*10});
        },
        gameLoop: function() {
            var newSegment = false;
            var game = this;
            // detect events
            if(this.detectCollision()) {
                this.render.drawLost();
                clearInterval(this.interval);
                return;
            } else if(this.detectFoodGrab()) {
                this.points++;
                if(this.points % 10 == 0) {
                    this.gameSpeed -= 20;
                    clearInterval(this.interval);
                    this.interval = setInterval(function() { game.gameLoop()}, this.gameSpeed);
                }
                newSegment = true;
                this.addFood();
            }
            // make move
            this.snake.move(newSegment);
            this.snake.canTurn = true;
            // render frame of game
            this.render.drawGame(game);
            // detect key pressed
        }
    };


    game.initGame();
});
