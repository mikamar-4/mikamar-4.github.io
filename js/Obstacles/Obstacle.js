// The mama class - the parent obstacle that all other obstacles inherit from.
export class Obstacle {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.animationCounter = 0;
        this.animationDirection = 1;
        this.speed = speed;
    }
    
    update() {
        if (this.animationCounter % 2 === 0) {
            this.y += this.animationDirection * this.speed;
        }

        if (this.animationCounter % 50 === 0) {
            this.animationDirection *= -1;
        }

        this.animationCounter++;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


