import { Obstacle } from './Obstacle.js';

// Fast shots - colorful, small but quickly moving obstacles
export class FastObstacle extends Obstacle {
  
  constructor(x, y) {

    const colors = ['aqua', 'violet'];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];  
    const varMinHeight = 20;
        
    const height = varMinHeight + Math.random() * varMinHeight;
    y = y - height - (Math.random() * 2 * varMinHeight );

    super(x, y, 15, height, randomColor, 4);
  }

  
  update() {
   
    if (this.animationCounter % 1 === 0) {  
      this.y += this.animationDirection * this.speed;
    }
    if (this.animationCounter % 25 === 0) { 
      this.animationDirection *= -1;
    }

    this.animationCounter += this.speed;
  }
    
}

