# `event-constructor-polyfill`

## Table of Contents

- [Introduction](#introduction)
- [Usage](#usage)
- [Affected browsers](#affected-browsers)
- [Notes](#notes)
  - [Argument validation](#argument-validation)
  - [`MouseEvent` key modifiers](#mouseevent-key-modifiers)
  - [Bypassing the check for the `new` keyword](#bypassing-the-check-for-the-new-keyword)
- [List of polyfilled constructors](#list-of-polyfilled-constructors)
- [List of omitted constructors](#list-of-omitted-constructors)
- [License](#license)

## Introduction

The original method of dynamically creating events in JavaScript used an API inspired by Java:

```javascript
var event = document.createEvent('MouseEvent');
event.initMouseEvent('click', false, false, window, null, null, null, 100, 0);
```

Many event interfaces have their own initializer methods with wildly differing argument lists. For example, `initMouseEvent()` takes more arguments than `initKeyboardEvent()`.

The new method of creating events (part of the [DOM Living Standard](https://dom.spec.whatwg.org/#interface-event)) is to use a simple constructor function.

```javascript
var event = new MouseEvent('click', {
    clientX: 100,
    clientY: 0
});
```

The constructor functions work the same way across all event interfaces, each taking only two arguments:

1. A string describing the type of the event, and
2. an optional plain object which provides the values of the event's properties.

This polyfill enables the use of this constructor syntax in browsers that don't natively support it.

## Usage

Include the script:

```html
<script src="main.min.js"></script>
```

Then, use the [polyfilled constructor functions](#polyfilled-constructors) as documented:

```javascript
var simpleEvent = new CustomEvent('foo');
var detailedEvent = new CustomEvent('bar', { /* ... */ });
```

## Affected browsers

The main goal of this polyfill is to allow the use of event constructors in Chrome 15 and above, Firefox 11 and above, Safari 6 and above, and Internet Explorer 9 and above. It has no effect in IE8 or below.

## Notes

### Argument validation

In accordance with the spec, the constructor functions created by this polyfill will throw a `TypeError` under the following scenarios:
- No arguments are provided
- The second argument is not an `Object` (and is not `null` or `undefined`)
- The `new` keyword is not used

### `MouseEvent` key modifiers

When creating a `MouseEvent`, `KeyboardEvent`, or `WheelEvent`, there are extra key modifiers that can be provided (in addition to `altKey`, `ctrlKey`, `metaKey`, and `shiftKey`). These are defined in the [`EventModifierInit` dictionary](https://www.w3.org/TR/uievents/#dictdef-eventmodifierinit). For example:
```javascript
var k = new KeyboardEvent('keydown', { modifierCapsLock: true });
k.getModifierState('CapsLock');
// => true
```
These extra modifiers work as expected for the polyfilled `KeyboardEvent` and `WheelEvent` constructors, but are **ignored** in the polyfilled `MouseEvent` constructor. This is because `initKeyboardEvent()` and `initWheelEvent()` accept these extra modifiers, but `initMouseEvent()` only accepts `altKey`, `ctrlKey`, `metaKey`, and `shiftKey`.

### Bypassing the check for the `new` keyword

As mentioned above, there are checks in place to ensure that the polyfilled constructors can't be invoked without the `new` keyword:
```javascript
var g = GamepadEvent('gamepadconnected'); // TypeError
var k = KeyboardEvent.call(new KeyboardEvent('keydown'), 'keyup'); // TypeError
var c = CustomEvent.call(CustomEvent.prototype, 'foo') // TypeError
```
The test for usage of the `new` keyword can be fooled, but only by statements that are specifically crafted to do so, such as the following:
```javascript
var dummy = Object.create(MouseEvent.prototype);
MouseEvent.call(dummy, 'click'); // No TypeError is thrown.
```
However, the constructor functions always return a new object; they never interact with the `this` object on which they are called. In the example above, trying to access `dummy.type` will throw a `TypeError`, because `dummy` was not initialized by the constructor; it's just a copy of `MouseEvent.prototype`.

## List of polyfilled constructors

Event interface | Initializer method | Notes
---|---|---
[`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent)                 | `initAnimationEvent()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/initAnimationEvent))
[`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)                 | `initClipboardEvent()` ([W3C](https://www.w3.org/TR/2011/WD-clipboard-apis-20110412/#widl-ClipboardEvent-initClipboardEvent)) | In Chrome (tested in 52 & 53), the native constructor throws a `TypeError` ("illegal constructor").
[`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent)                         | `initCloseEvent()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/initCloseEvent))
[`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent)             | `initCompositionEvent()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent#initCompositionEvent))
[`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)                       | `initCustomEvent()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/initCustomEvent))
[`DeviceMotionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)           | `initDeviceMotionEvent()` ([MSDN](https://msdn.microsoft.com/en-us/library/dn342900.aspx))
[`DeviceOrientationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent) | `initDeviceOrientationEvent()` ([MSDN](https://msdn.microsoft.com/en-us/library/dn322040.aspx))
[`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent)                           | `initDragEvent()` ([MSDN](https://msdn.microsoft.com/en-us/library/ff975298.aspx))
[`ErrorEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent)                         | `initErrorEvent()` ([MSDN](https://msdn.microsoft.com/en-us/library/hh771868.aspx))
[`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent)                         | `initFocusEvent()` ([MSDN](https://msdn.microsoft.com/en-us/library/ff975458.aspx))
[`GamepadEvent`](https://developer.mozilla.org/en-US/docs/Web/API/GamepadEvent)                     | `initGamepadEvent()`
[`HashChangeEvent`](https://developer.mozilla.org/en-US/docs/Web/API/HashChangeEvent)               | `initHashChangeEvent()`
[`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)                   | `initKeyboardEvent()` ([MSDN](https://msdn.microsoft.com/en-us/library/ff975297.aspx)) | `initKeyboardEvent()` is always used; never `initKeyEvent()`.
[`MediaStreamEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamEvent)             | `initMediaStreamEvent()`
[`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent)                     | `initMessageEvent()` ([MSDN](https://msdn.microsoft.com/en-us/library/ff975295.aspx))
[`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)                         | `initMouseEvent()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent))
[`PageTransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PageTransitionEvent)       | `initPageTransitionEvent()`
[`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)                     | `initPointerEvent()` ([MSDN](https://msdn.microsoft.com/en-us/library/windows/apps/hh441246.aspx))
[`PopStateEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PopStateEvent)                   | `initPopStateEvent()` ([MSDN](https://msdn.microsoft.com/en-us/library/hh772350.aspx))
[`ProgressEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent)                   | `initProgressEvent()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent/initProgressEvent))
[`StorageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent)                     | `initStorageEvent()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent#Methods))
[`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent)                         | `initTouchEvent()` ([Apple](https://developer.apple.com/reference/webkitjs/touchevent/1631943-inittouchevent)) | Accounts for the fact that Chrome does not follow the W3C spec and expects a [different argument list](http://stackoverflow.com/a/31097458/2038227).
[`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent)               | `initTransitionEvent()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/initTransitionEvent))
[`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)                               | `initUIEvent()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/initUIEvent))
[`UserProximityEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UserProximityEvent)         | `initUserProximityEvent()`
[`WebGLContextEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLContextEvent)           | `initWebGLContextEvent()`
[`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent)                         | `initWheelEvent()` ([MSDN](https://msdn.microsoft.com/en-us/library/ff975254.aspx))

## List of omitted constructors

The following event constructors are not polyfilled by this script. If an event interface is not polyfilled by this script, but is not listed in the table below, then it does not have a documented `initEvent` method associated with it.

Event interface | Reason for omission
---|---
[`GestureEvent`](https://developer.mozilla.org/en-US/docs/Web/API/GestureEvent) | Non-standard.
[`MouseScrollEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseScrollEvent) | Non-standard. `WheelEvent` is the standards-based interface for mouse wheel scrolling events, and `initWheelEvent()` is supported in IE9+.
[`MouseWheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseWheelEvent) | Non-standard. `WheelEvent` is the standards-based interface for mouse wheel scrolling events, and `initWheelEvent()` is supported in IE9+.
[`MutationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MutationEvent) | Deprecated; inconsistent implementation across different browsers. Use [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) instead.

## License

`event-constructor-polyfill` uses the [MIT License](https://opensource.org/licenses/MIT).