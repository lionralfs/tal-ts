import { Tweenable } from 'shifty';
import { Device, IAnimOptions } from '../base/device';

// A set of queues of DOM updates to perform. Each animation framerate gets its own queue
// so they are in sync between themselves.
const animQueues = {};

/**
 * Internal function: given a new tween value for an animation, add it to a queue
 * of DOM manipulations to be performed at the next update. If there is no queue yet,
 * create it and start the update cycle after half a frame has elapsed, to give other
 * animation updates a chance to come in.
 */
const addTweenToQueue = (options, tweenValues): void => {
  // A separate queue exists for each framerate. Get or create the appropriate queue.
  const queueKey = 'fps' + options.fps;
  const frameIntervalMs = 1000 / options.fps;
  let queue = animQueues[queueKey];

  // Create a new queue if one doesn't already exist (implemented as an array).
  if (!queue) {
    queue = [];
    animQueues[queueKey] = queue;
  }

  // Start processing the queue periodically if we're not already.
  // Wait half a frame before starting the first cycle - gives other animation updates at
  // the same frame rate a chance to come in.
  if (!queue.isProcessing) {
    queue.isProcessing = true;
    setTimeout(() => {
      startIntervalTimer(queue, frameIntervalMs);
    }, frameIntervalMs / 2);

    // First tween in a cycle should be applied immediately. It contains initial values.
    step(options, tweenValues);
  } else {
    // Queue is already being processed. Add the new entry to the queue.
    queue.push({ options, values: tweenValues });
  }
};

/**
 * Internal function: When we receive a callback to say an animation
 * has completed (either it's been cancelled or it's finished), drain
 * any outstanding steps from the queue. This ensures that in the case
 * of clients cancelling the animation, the element stops being updated
 * immediately.
 */
const drainTweensFromQueue = (options): void => {
  const queue = animQueues['fps' + options.fps];
  if (queue) {
    for (let i = 0; i < queue.length; i++) {
      const q = queue[i];
      if (q.options === options) {
        step(q.options, q.values);
        queue.splice(i, 1);
        i--;
      }
    }
  }
};

/**
 * Internal function. Start a periodic interval timer for a given framerate.
 */
const startIntervalTimer = (queue, period): void => {
  // Store timer ID with the queue to allow it to be stopped later.
  queue.intervalId = setInterval(() => {
    processQueue(queue);
  }, period);
};

/**
 * Internal function. To be called periodically on a queue of operations. Apply each update to the
 * DOM, then clear the queue ready to be refilled. Stop the periodic timer if the queue remains empty.
 */
const processQueue = (queue): void => {
  // Is the queue still empty after it was last cleared? Stop the timer - the animations have
  // probably finished and will not provide any further updates.
  if (queue.length === 0) {
    clearInterval(queue.intervalId);
    queue.isProcessing = false;
    queue.intervalId = null;
  } else {
    // We have some DOM updates to do. Do each one in sequence, then clear the queue ready for the next round.
    try {
      for (const q of queue) {
        step(q.options, q.values);
      }
    } finally {
      // Truncating the array length to zero clears it.
      queue.length = 0;
    }
  }
};

/**
 * Internal function. Perform the DOM updates required for the update.
 */
const step = (options: IAnimOptions, tweenValues): void => {
  for (const p in options.to) {
    if (tweenValues[p] !== null && tweenValues[p] !== undefined) {
      if (/scroll/.test(p)) {
        options.el[p] = tweenValues[p];
      } else {
        options.el.style[p] = tweenValues[p];
      }
    }
  }
};

export const tween = (self: Device, options: IAnimOptions) => {
  const anim = new Tweenable(options);

  const opts = {
    el: options.el,
    initialState: options.from || {},
    from: options.from || {},
    to: options.to || {},
    duration: options.duration || 840,
    easing: options.easing || 'easeFromTo',
    fps: options.fps || 25,
    start: () => {
      if (options.className) {
        self.removeClassFromElement(options.el, 'not' + options.className);
        self.addClassToElement(options.el, options.className);
      }
      self.removeClassFromElement(self.getTopLevelElement(), 'notanimating');
      self.addClassToElement(self.getTopLevelElement(), 'animating');
      if (options.onStart) {
        options.onStart();
      }
    },
    step: () => {
      addTweenToQueue(opts, this);
    },
    callback: () => {
      if (options.className) {
        self.removeClassFromElement(options.el, options.className);
        self.addClassToElement(options.el, 'not' + options.className);
      }
      self.removeClassFromElement(self.getTopLevelElement(), 'animating');
      self.addClassToElement(self.getTopLevelElement(), 'notanimating');
      // Send this animation to its final state immediately.
      drainTweensFromQueue(opts);
      if (this) {
        step(opts, this);
      }
      // Fire client callback if it exists
      if (typeof options.onComplete === 'function') {
        options.onComplete();
      }
    }
  };

  anim.tween(opts);

  return anim;
};
