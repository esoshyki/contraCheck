import Unit from './Unit';

export default function setAnimation () {

  Unit.prototype.restoreAnimation = function() {
    this.changeAnimation(this.defaultAnimation);
  };
  
  Unit.prototype.changeAnimation = function(animation, callback) {


    if (this.damageGiven && animation !== this.animations.damage) {
      return
    }

    if (callback) { 
      this.callback = callback
    };

    if (this.isJumping && !this.forceJump) {
      return;
    };

    if (animation !== this.animationState.animations) {
      this.animationState = {
        animations: animation,
        animationIdx: 0,
        frameIdx: 0,
        durationIdx: 0,
        isCycle: true
      };
    };
  };

  Unit.prototype.drawFrame = function(frame) {
    const { x, y, w, h, } = frame;
    this.bgx = x; this.bgy = y;
    this.width = w; this.height = h;
  };
  
  Unit.prototype.animate = function(_asset) {
    const { animations, animationIdx, frameIdx, durationIdx } = this.animationState;
    const currentAnimation = animations[animationIdx];
    if (!currentAnimation) {
      return this.restoreAnimation()
    };
    
    const slides = currentAnimation.slides;
    const frame = slides[frameIdx];
  
    if (!frame || !currentAnimation) {
      return this.restoreAnimation();
    };
  
    const { duration } = frame;
    const { isCycle, asset } = currentAnimation;
    this.asset = _asset || asset;
  
    if(durationIdx === 0) {
      this.drawFrame(frame);
    }
  
    this.animationState.durationIdx += 1;
  
    if (this.animationState.durationIdx > duration) {
      this.animationState.durationIdx = 0;
      this.animationState.frameIdx += 1;
  
      if (!slides[this.animationState.frameIdx]) {
        if (isCycle) {
          this.animationState.frameIdx = 0;
        } else {
          this.animationState.animationIdx += 1;
          this.animationState.frameIdx = 0;
          if (!animations[this.animationState.animationIdx]) {
            if (this.callback) {
              this.callback();
              this.callback = null;
            } else {
              this.restoreAnimation()
            }
          };
        };
      };
    };
  };
}

