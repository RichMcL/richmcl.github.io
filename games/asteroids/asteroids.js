var fingerDown = false;
var fingerX = 0;
var fingerY = 0;

var rotateDirection = '';
var rotateAngle = 0;

var SHOT_TTL = 200;
var SHOT_RECHARGE = 100;
var MAX_SHOTS = 3;
var SHOT_MAX_VELOCITY = 2.5;

(function () {
    class Game {
        canvas = document.getElementById('asteroids');
        screen = this.canvas.getContext('2d');
        gameSize = { x: this.canvas.width, y: this.canvas.height };

        lives = 3;
        score = 0;

        // Create the bodies array to hold the player and balls.
        bodies = [];

        // this.bodies = this.bodies.concat(createAsteroids(this));

        // Add the player to the bodies array.
        player = new Player(this, this.gameSize);

        ball = null;

        shotRecharge = 0;

        bodies = this.bodies.concat(this.player);

        constructor() {
            this.tick();
        }

        // Main game tick function.  Loops forever, running 60ish times a second.
        tick() {
            // Update game state.
            this.update();

            // Draw game bodies.
            this.draw(this.screen, this.gameSize);

            this.stats(self.player);

            // Queue up the next call to tick with the browser.
            requestAnimationFrame(this.tick.bind(this));
        }

        stats() {
            document.getElementById('stats-x-pos').innerText = Number(this.player.center.x).toFixed(
                2
            );
            document.getElementById('stats-y-pos').innerText = Number(this.player.center.y).toFixed(
                2
            );
            document.getElementById('stats-x-vel').innerText = Number(
                this.player.velocity.x
            ).toFixed(2);
            document.getElementById('stats-y-vel').innerText = Number(
                this.player.velocity.y
            ).toFixed(2);
            document.getElementById('stats-angle').innerText = Number(rotateAngle).toFixed(2);
            document.getElementById('stats-shots').innerText = this.getBallCount();
            document.getElementById(
                'stats-recharge'
            ).innerText = `${this.shotRecharge}/${SHOT_RECHARGE}`;
            document.getElementById('stats-shot-ttl').innerText = SHOT_TTL;
            document.getElementById('stats-shot-vel').innerText = SHOT_MAX_VELOCITY;
            document.getElementById('stats-touch-x').innerText = Number(fingerX).toFixed(2);
            document.getElementById('stats-touch-y').innerText = Number(fingerY).toFixed(2);
        }

        // **update()** runs the main game logic.
        update() {
            this.bodies = this.bodies.filter(function (b1) {
                return !(b1 instanceof Ball && b1.framesRemaining === 0);
            });

            for (var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].update();
            }

            if (this.shotRecharge > 0) {
                this.shotRecharge--;
            }

            var hitAsteroids = [];

            // // `notCollidingWithAnything` returns true if passed body
            // // is not colliding with anything.
            // var notCollidingWithAnything = function (b1) {
            //     return self.bodies.filter(function (b2) {
            //         if ((b1 instanceof Ball && b2 instanceof Player) ||(b2 instanceof Ball && b1 instanceof Player)) {
            //             return false;
            //         }
            //         if (b1 instanceof Asteroid && b2 instanceof Asteroid) {
            //             return false;
            //         }
            //         var isColliding = colliding(b1, b2);

            //         if (isColliding) {
            //             var hasAsteroid = false;
            //             for (var i = 0; i < hitAsteroids.length; i ++) {
            //                 if (hitAsteroids[i] == b1 || hitAsteroids[i] == b2) {
            //                     hasAsteroid = true;
            //                 }
            //             }

            //             if (!hasAsteroid) {
            //                 console.log("asteroid hit");

            //                 if (b1 instanceof Asteroid) {
            //                     hitAsteroids.push(b1);
            //                 }

            //                 if (b2 instanceof Asteroid) {
            //                     hitAsteroids.push(b2);
            //                 }
            //             }
            //         }

            //         return isColliding;
            //     }).length === 0;
            // };

            // Throw away bodies that are colliding with something. They
            // will never be updated or draw again.
            // this.bodies = this.bodies.filter(notCollidingWithAnything);

            // if (hitAsteroids.length) {
            //     for (var i = 0; i < hitAsteroids.length; i++) {
            //         if (hitAsteroids[i].size.x === 32) {
            //             console.log("new Asteroids built");
            //             self.bodies.push(new Asteroid(self, 16, { x: hitAsteroids[i].center.x, y: hitAsteroids[i].center.y}, { x: -hitAsteroids[i].velocity.x * 2, y: -hitAsteroids[i].velocity.y * 2}));
            //             self.bodies.push(new Asteroid(self, 16, { x: hitAsteroids[i].center.x, y: hitAsteroids[i].center.y}, { x: hitAsteroids[i].velocity.x * 2, y: hitAsteroids[i].velocity.y * 2}));
            //         }
            //     }
            // }
        }

        // **draw()** draws the game.
        draw(screen, gameSize) {
            // Clear away the drawing from the previous tick.
            screen.clearRect(0, 0, gameSize.x, gameSize.y);

            // Draw each body as a rectangle.
            for (var i = 0; i < this.bodies.length; i++) {
                if (this.bodies[i].center.y < 0) {
                    delete this.bodies[i];
                    continue;
                }

                if (this.bodies[i].color) {
                    screen.fillStyle = this.bodies[i].color;
                } else {
                    screen.fillStyle = '#FFFFFF';
                }

                this.bodies[i].draw(screen);
            }
        }

        // **addBody()** adds a body to the bodies array.
        addBody(body) {
            this.bodies.push(body);
        }

        getBallCount() {
            var ballCount = 0;

            for (var i = 0; i < this.bodies.length; i++) {
                if (this.bodies[i] instanceof Ball) {
                    ballCount++;
                }
            }

            return ballCount;
        }

        canShoot() {
            return this.shotRecharge === 0;
        }

        resetShotRecharge() {
            this.shotRecharge = SHOT_RECHARGE;
        }
    }

    class Player {
        size = { x: 5, y: 5 };
        color = 'white';
        center;
        velocity = { x: 0, y: 0 };
        id = 'ship';

        // Create a keyboard object to track button presses.
        keyboarder = new Keyboarder();

        constructor(game, gameSize) {
            this.game = game;
            this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };
        }

        draw(screen) {
            var x = this.center.x - this.size.x / 2;
            var y = this.center.y - this.size.y / 2;

            var img = document.getElementById(this.id);

            if (rotateDirection === 'left') {
                rotateAngle -= 5;
                if (rotateAngle < 0) {
                    rotateAngle += 360;
                }
                screen.save();
                screen.translate(x, y);
                screen.rotate((rotateAngle * Math.PI) / 180);
            } else if (rotateDirection === 'right') {
                rotateAngle += 5;
                if (rotateAngle > 360) {
                    rotateAngle -= 360;
                }

                screen.save();
                screen.translate(x, y);
                screen.rotate((rotateAngle * Math.PI) / 180);
            } else {
                screen.save();
                screen.translate(x, y);
                screen.rotate((rotateAngle * Math.PI) / 180);
            }

            screen.drawImage(img, -img.width / 2, -img.height / 2);

            screen.restore();

            screen.fill();
        }

        update() {
            var MAX_VELOCITY = 2.0;
            var BASE_VELOCITY_DELTA = 0.05;
            var delta = 0;

            // If left cursor key is down...
            if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                rotateDirection = 'left';
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                rotateDirection = 'right';
            } else if (!!fingerX && fingerY > 100 && fingerY < 500) {
                if (fingerX > 300) {
                    rotateDirection = 'right';
                } else {
                    rotateDirection = 'left';
                }
            } else {
                rotateDirection = '';
            }

            if (
                this.keyboarder.isDown(this.keyboarder.KEYS.UP) ||
                (fingerX > 100 &&
                    fingerX < 500 &&
                    (fingerY > 500 || (fingerY > 0 && fingerY < 100)))
            ) {
                if (rotateAngle === 0 || rotateAngle === 360) {
                    this.velocity.x += 0;
                } else if (rotateAngle > 0 && rotateAngle < 90) {
                    delta = parseFloat((rotateAngle / 90) * BASE_VELOCITY_DELTA);
                    this.velocity.x += delta;
                } else if (rotateAngle === 90) {
                    this.velocity.x += BASE_VELOCITY_DELTA;
                } else if (rotateAngle > 90 && rotateAngle < 180) {
                    delta = parseFloat(((90 - (rotateAngle - 90)) / 90) * BASE_VELOCITY_DELTA);
                    this.velocity.x += delta;
                } else if (rotateAngle === 180) {
                    this.velocity.x += 0;
                } else if (rotateAngle > 180 && rotateAngle < 270) {
                    delta = parseFloat(((rotateAngle - 180) / 90) * BASE_VELOCITY_DELTA);
                    this.velocity.x -= delta;
                } else if (rotateAngle === 270) {
                    this.velocity.x -= BASE_VELOCITY_DELTA;
                } else {
                    delta = parseFloat(((180 - (rotateAngle - 180)) / 90) * BASE_VELOCITY_DELTA);
                    this.velocity.x -= delta;
                }

                if (rotateAngle === 0 || rotateAngle === 360) {
                    this.velocity.y -= BASE_VELOCITY_DELTA;
                } else if (rotateAngle > 0 && rotateAngle < 90) {
                    delta = parseFloat(((90 - rotateAngle) / 90) * BASE_VELOCITY_DELTA);
                    this.velocity.y -= delta;
                } else if (rotateAngle === 90) {
                    this.velocity.y -= 0;
                } else if (rotateAngle > 90 && rotateAngle < 180) {
                    delta = parseFloat(((rotateAngle - 90) / 90) * BASE_VELOCITY_DELTA);
                    this.velocity.y += delta;
                } else if (rotateAngle === 180) {
                    this.velocity.y += BASE_VELOCITY_DELTA;
                } else if (rotateAngle > 180 && rotateAngle < 270) {
                    delta = parseFloat(((90 - (rotateAngle - 180)) / 90) * BASE_VELOCITY_DELTA);
                    this.velocity.y += delta;
                } else if (rotateAngle === 270) {
                    this.velocity.y -= 0;
                } else {
                    delta = parseFloat(((rotateAngle - 270) / 90) * BASE_VELOCITY_DELTA);
                    this.velocity.y -= delta;
                }

                if (this.velocity.x > MAX_VELOCITY) {
                    this.velocity.x = MAX_VELOCITY;
                } else if (this.velocity.x < -MAX_VELOCITY) {
                    this.velocity.x = -MAX_VELOCITY;
                }

                if (this.velocity.y > MAX_VELOCITY) {
                    this.velocity.y = MAX_VELOCITY;
                } else if (this.velocity.y < -MAX_VELOCITY) {
                    this.velocity.y = -MAX_VELOCITY;
                }

                this.id = 'ship-move';
            } else {
                this.id = 'ship';
            }

            this.center.x += this.velocity.x;

            if (this.center.x > 600) {
                this.center.x = 1;
            } else if (this.center.x < 0) {
                this.center.x = 599;
            }

            this.center.y += this.velocity.y;

            if (this.center.y > 600) {
                this.center.y = 1;
            } else if (this.center.y < 0) {
                this.center.y = 599;
            }

            // If Space key is down...
            // if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) || fingerDown) {
            if (this.game.canShoot() && this.game.getBallCount() < MAX_SHOTS) {
                var ball = new Ball(this);

                this.game.ball = ball;
                this.game.addBody(ball);
                this.game.resetShotRecharge();
            }
        }
    }

    // Asteroids
    // --------

    // **new Asteroid()** creates an brick.
    var Asteroid = function (game, size, center, velocity) {
        this.game = game;
        this.center = center;
        this.id = 'asteroid-' + size;
        this.size = { x: size, y: size };
        this.velocity = velocity;
    };

    Asteroid.prototype = {
        draw: function (screen) {
            var x = this.center.x - this.size.x / 2;
            var y = this.center.y - this.size.y / 2;

            var img = document.getElementById(this.id);

            screen.drawImage(img, x, y);
        },

        // **update()** updates the state of the brick for a single tick.
        update: function () {
            this.center.x += this.velocity.x;

            if (this.center.x >= 598) {
                this.center.x = 2;
            } else if (this.center.x <= 2) {
                this.center.x = 598;
            }

            this.center.y += this.velocity.y;

            if (this.center.y >= 598) {
                this.center.y = 2;
            } else if (this.center.y <= 2) {
                this.center.y = 598;
            }
        }
    };

    var createAsteroids = function (game) {
        var asteroids = [];

        asteroids.push(new Asteroid(game, 32, { x: 50, y: 200 }, { x: 0.2, y: 0.2 }));
        asteroids.push(new Asteroid(game, 32, { x: 300, y: 50 }, { x: -0.2, y: 0.2 }));
        asteroids.push(new Asteroid(game, 32, { x: 50, y: 550 }, { x: 0.2, y: -0.2 }));
        asteroids.push(new Asteroid(game, 32, { x: 400, y: 400 }, { x: 0.2, y: -0.2 }));

        return asteroids;
    };

    // Ball
    // ------

    // **new Ball()** creates a new ball.
    class Ball {
        ship;

        constructor(ship) {
            this.ship = ship;

            this.center = {
                x: ship.center.x - ship.size.x / 2,
                y: ship.center.y - ship.size.y / 2
            };
            this.size = { x: 2, y: 2 };
            this.framesRemaining = SHOT_TTL;
            this.velocity = { x: 0, y: 0 };

            this.init();
        }

        init() {
            var MAX_VELOCITY = SHOT_MAX_VELOCITY;
            var delta = 0;

            if (rotateAngle === 0 || rotateAngle === 360) {
                this.velocity.x += 0;
            } else if (rotateAngle > 0 && rotateAngle < 90) {
                delta = parseFloat((rotateAngle / 90) * MAX_VELOCITY);
                this.velocity.x += delta;
            } else if (rotateAngle === 90) {
                this.velocity.x += MAX_VELOCITY;
            } else if (rotateAngle > 90 && rotateAngle < 180) {
                delta = parseFloat(((90 - (rotateAngle - 90)) / 90) * MAX_VELOCITY);
                this.velocity.x += delta;
            } else if (rotateAngle === 180) {
                this.velocity.x += 0;
            } else if (rotateAngle > 180 && rotateAngle < 270) {
                delta = parseFloat(((rotateAngle - 180) / 90) * MAX_VELOCITY);
                this.velocity.x -= delta;
            } else if (rotateAngle === 270) {
                this.velocity.x -= MAX_VELOCITY;
            } else {
                delta = parseFloat(((180 - (rotateAngle - 180)) / 90) * MAX_VELOCITY);
                this.velocity.x -= delta;
            }

            if (rotateAngle === 0 || rotateAngle === 360) {
                this.velocity.y -= MAX_VELOCITY;
            } else if (rotateAngle > 0 && rotateAngle < 90) {
                delta = parseFloat(((90 - rotateAngle) / 90) * MAX_VELOCITY);
                this.velocity.y -= delta;
            } else if (rotateAngle === 90) {
                this.velocity.y -= 0;
            } else if (rotateAngle > 90 && rotateAngle < 180) {
                delta = parseFloat(((rotateAngle - 90) / 90) * MAX_VELOCITY);
                this.velocity.y += delta;
            } else if (rotateAngle === 180) {
                this.velocity.y += MAX_VELOCITY;
            } else if (rotateAngle > 180 && rotateAngle < 270) {
                delta = parseFloat(((90 - (rotateAngle - 180)) / 90) * MAX_VELOCITY);
                this.velocity.y += delta;
            } else if (rotateAngle === 270) {
                this.velocity.y -= 0;
            } else {
                delta = parseFloat(((rotateAngle - 270) / 90) * MAX_VELOCITY);
                this.velocity.y -= delta;
            }
        }

        draw(screen) {
            screen.fillRect(
                this.center.x - this.size.x / 2,
                this.center.y - this.size.y / 2,
                this.size.x,
                this.size.y
            );
        }

        update() {
            // Add velocity to center to move ball.
            this.center.x += this.velocity.x;

            if (this.center.x >= 598) {
                this.center.x = 2;
            } else if (this.center.x <= 2) {
                this.center.x = 598;
            }

            this.center.y += this.velocity.y;

            if (this.center.y >= 598) {
                this.center.y = 2;
            } else if (this.center.y <= 2) {
                this.center.y = 598;
            }

            this.framesRemaining--;
        }

        flipX() {
            var oldVelocity = this.velocity;
            this.velocity = { x: -1 * oldVelocity.x, y: oldVelocity.y };
        }

        flipY() {
            var oldVelocity = this.velocity;
            this.velocity = { x: oldVelocity.x, y: -1 * oldVelocity.y };
        }
    }

    // Keyboard input tracking
    // -----------------------

    // **new Keyboarder()** creates a new keyboard input tracking object.
    class Keyboarder {
        // Records up/down state of each key that has ever been pressed.
        keyState = {};

        // Handy constants that give keyCodes human-readable names.
        KEYS = { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, SPACE: 32 };

        constructor() {
            this.init();
        }

        init() {
            // When key goes down, record that it is down.
            window.addEventListener('keydown', e => {
                this.keyState[e.keyCode] = true;
            });

            // When key goes up, record that it is up.
            window.addEventListener('keyup', e => {
                this.keyState[e.keyCode] = false;
            });
        }

        // Returns true if passed key is currently down.  `keyCode` is a
        // unique number that represents a particular key on the keyboard.
        isDown(keyCode) {
            return this.keyState[keyCode] === true;
        }
    }

    // Other functions
    // ---------------

    // **colliding()** returns true if two passed bodies are colliding.
    // The approach is to test for five situations.  If any are true,
    // the bodies are definitely not colliding.  If none of them
    // are true, the bodies are colliding.
    // 1. b1 is the same body as b2.
    // 2. Right of `b1` is to the left of the left of `b2`.
    // 3. Bottom of `b1` is above the top of `b2`.
    // 4. Left of `b1` is to the right of the right of `b2`.
    // 5. Top of `b1` is below the bottom of `b2`.
    var colliding = function (b1, b2) {
        var isColliding = !(
            b1 === b2 ||
            b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
            b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
            b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
            b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
        );

        return isColliding;
    };

    // Start game
    // ----------

    // When the DOM is ready, create (and start) the game.
    window.addEventListener('load', function () {
        new Game();

        $(document).on('vmousedown', function (e) {
            fingerX = e.clientX;
            fingerY = e.clientY;
            fingerDown = true;
        });

        $(document).on('vmouseup', function (e) {
            fingerDown = false;
            fingerX = 0;
            fingerY = 0;
        });
    });
})();
