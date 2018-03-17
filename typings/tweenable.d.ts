/**
 * Handy shortcut for doing a for-in loop. This is not a "normal" each
 * function, it is optimized for Shifty.  The iterator function only receives
 * the property name, not the value.
 * @param {Object} obj
 * @param {Function(string)} fn
 * @private
 */
export declare const each: (obj: any, fn: any) => void;
/**
 * @param {Object} obj
 * @return {Object}
 * @private
 */
export declare const clone: (obj: any) => any;
/**
 * Calculates the interpolated tween values of an Object for a given
 * timestamp.
 * @param {Number} forPosition The position to compute the state for.
 * @param {Object} currentState Current state properties.
 * @param {Object} originalState: The original state properties the Object is
 * tweening from.
 * @param {Object} targetState: The destination state properties the Object
 * is tweening to.
 * @param {number} duration: The length of the tween in milliseconds.
 * @param {number} timestamp: The UNIX epoch time at which the tween began.
 * @param {Object.<string|function>} easing: This Object's keys must correspond
 * to the keys in targetState.
 * @private
 */
export declare const tweenProps: (forPosition: any, currentState: any, originalState: any, targetState: any, duration: any, timestamp: any, easing: any) => any;
/**
 * Creates a usable easing Object from a string, a function or another easing
 * Object.  If `easing` is an Object, then this function clones it and fills
 * in the missing properties with `"linear"`.
 * @param {Object.<string|Function>} fromTweenParams
 * @param {Object|string|Function} easing
 * @return {Object.<string|Function>}
 * @private
 */
export declare const composeEasingObject: (fromTweenParams: any, easing?: string) => {};
export declare class Tweenable {
    private currentState;
    /**
     * @param {Object} [initialState={}] The values that the initial tween should
     * start at if a `from` value is not provided to {@link
     * shifty.Tweenable#tween} or {@link shifty.Tweenable#setConfig}.
     * @param {shifty.tweenConfig} [config] Configuration object to be passed to
     * {@link shifty.Tweenable#setConfig}.
     * @constructs shifty.Tweenable
     */
    constructor(initialState?: {}, config?: any);
    /**
     * Applies a filter to Tweenable instance.
     * @param {shifty.Tweenable} tweenable The `Tweenable` instance to call the filter
     * upon.
     * @param {string} filterName The name of the filter to apply.
     * @private
     */
    _applyFilter(filterName: any): void;
    /**
     * Handles the update logic for one step of a tween.
     * @param {number} [currentTimeOverride] Needed for accurate timestamp in
     * shifty.Tweenable#seek.
     * @private
     */
    _timeoutHandler(currentTimeOverride: any): void;
    /**
     * Configure and start a tween.
     * @method shifty.Tweenable#tween
     * @param {shifty.tweenConfig} [config] Gets passed to {@link
     * shifty.Tweenable#setConfig}
     * @return {external:Promise}
     */
    tween(config?: any): any;
    /**
     * Configure a tween that will start at some point in the future.
     * @method shifty.Tweenable#setConfig
     * @param {shifty.tweenConfig} [config={}]
     * @return {shifty.Tweenable}
     */
    setConfig(config?: {}): this;
    /**
     * @method shifty.Tweenable#get
     * @return {Object} The current state.
     */
    get(): any;
    /**
     * Set the current state.
     * @method shifty.Tweenable#set
     * @param {Object} state The state to set.
     */
    set(state: any): void;
    /**
     * Pause a tween.  Paused tweens can be resumed from the point at which they
     * were paused.  This is different from {@link shifty.Tweenable#stop}, as
     * that method causes a tween to start over when it is resumed.
     * @method shifty.Tweenable#pause
     * @return {shifty.Tweenable}
     */
    pause(): this;
    /**
     * Resume a paused tween.
     * @method shifty.Tweenable#resume
     * @return {external:Promise}
     */
    resume(): any;
    /**
     * Move the state of the animation to a specific point in the tween's
     * timeline.  If the animation is not running, this will cause {@link
     * shifty.stepFunction} handlers to be called.
     * @method shifty.Tweenable#seek
     * @param {millisecond} millisecond The millisecond of the animation to seek
     * to.  This must not be less than `0`.
     * @return {shifty.Tweenable}
     */
    seek(millisecond: any): this;
    /**
     * Stops and cancels a tween.
     * @param {boolean} [gotoEnd] If `false`, the tween just stops at its current
     * state, and the tween promise is not resolved.  If `true`, the tweened
     * object's values are instantly set to the target values, and the promise is
     * resolved.
     * @method shifty.Tweenable#stop
     * @return {shifty.Tweenable}
     */
    stop(gotoEnd?: boolean): this;
    /**
     * Whether or not a tween is running.
     * @method shifty.Tweenable#isPlaying
     * @return {boolean}
     */
    isPlaying(): boolean;
    /**
     * Set a custom schedule function.
     *
     * By default,
     * [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame)
     * is used if available, otherwise
     * [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout)
     * is used.
     * @method shifty.Tweenable#setScheduleFunction
     * @param {Function(Function,number)} scheduleFunction The function to be
     * used to schedule the next frame to be rendered.
     */
    setScheduleFunction(scheduleFunction: any): void;
    /**
     * `delete` all "own" properties.  Call this when the {@link
     * shifty.Tweenable} instance is no longer needed to free memory.
     * @method shifty.Tweenable#dispose
     */
    dispose(): void;
}
/**
 * @method shifty.tween
 * @param {shifty.tweenConfig} [config={}]
 * @description Standalone convenience method that functions identically to
 * {@link shifty.Tweenable#tween}.  You can use this to create tweens without
 * needing to set up a {@link shifty.Tweenable} instance.
 *
 *     import { tween } from 'shifty';
 *
 *     tween({ from: { x: 0 }, to: { x: 10 } }).then(
 *       () => console.log('All done!')
 *     );
 *
 * @returns {external:Promise}
 */
export declare function tween(config?: {}): any;
