import { Obstacle } from './Obstacle.js';

// Slow osbatle - big, with a limited movement but harder to jump over because of widht
// The beer obsatcle
export class SlowObstacle extends Obstacle {

    constructor(x, y) {
        
        const varMinHeight = 80;
        const height = varMinHeight;

        y = y - height - (Math.random() * varMinHeight );
        super(x, y, 30, height, 'gold', 1);
    }

    
    update() {
    
        if (this.animationCounter % 1 === 0) {  
            this.y += this.animationDirection * this.speed;
        }

        if (this.animationCounter % 100 === 0) {
            this.animationDirection *= -1;
        }
        
        this.animationCounter += this.speed;
    }

    draw(ctx) {
        const foamVar = 18;
        ctx.fillStyle = 'ivory';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y + foamVar , this.width, this.height - foamVar);
    }
    
}

