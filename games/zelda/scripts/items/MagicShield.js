var MagicShield = function (game, price, center) {
    this.id = "magic-shield";
    this.price = price;
    this.game = game;
    this.size = { x: 8, y: 16 };
    this.center = { x: center.x, y: center.y };
};

MagicShield.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);

        screen.font = "8px 'Press Start 2P'";
        screen.fillStyle = "white";
        screen.fillText(this.price, x - 10, y + 20);
    },

    update: function () {
    }
};