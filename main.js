/*! Event constructor polyfill | Jacob McCollum | MIT License */
(function (window) {
    'use strict';

    var baseArgs = [
            { name: 'type', value: '' },
            { name: 'bubbles', value: false },
            { name: 'cancelable', value: false }
        ],
        keyModifierMapping = {
            altKey: 'Alt',
            ctrlKey: 'Control',
            metaKey: 'Meta',
            shiftKey: 'Shift',
            modifierAltGraph: 'AltGraph',
            modifierCapsLock: 'CapsLock',
            modifierFn: 'Fn',
            modifierFnLock: 'FnLock',
            modifierHyper: 'Hyper',
            modifierNumLock: 'NumLock',
            modifierScrollLock: 'ScrollLock',
            modifierSuper: 'Super',
            modifierSymbol: 'Symbol',
            modifierSymbolLock: 'SymbolLock',
        },
        keyModifiers = (function (m) {
            var r = [],
                g = 0;
            for (var p in m) {
                if (m.hasOwnProperty(p)) {
                    r[g++] = p;
                }
            }
            return r;
        })(keyModifierMapping),
        alternateInitTouchEvent = (function () {
            var e;
            try {
                e = document.createEvent('TouchEvent');
            } catch (e) {
                return false;
            }
            if (typeof e.initTouchEvent !== 'function') {
                return false;
            }
            try {
                e.initTouchEvent(null, null, null, 'test');
            } catch (e) {
                return false;
            }
            return e.type === 'test';
        })(),
        eventInfo = {
            AnimationEvent: {
                args: [
                    { name: 'animationName', defaultValue: '' },
                    { name: 'elapsedTime', defaultValue: 0 },
                ]
            },
            ClipboardEvent: {
                args: [
                    { name: 'dataType', defaultValue: '' },
                    { name: 'data', defaultValue: '' }
                ]
            },
            CloseEvent: {
                args: [
                    { name: 'wasClean', defaultValue: false },
                    { name: 'code', defaultValue: 0 },
                    { name: 'reason', defaultValue: '' }
                ]
            },
            CompositionEvent: {
                args: [
                    { name: 'view', defaultValue: null },
                    { name: 'data', defaultValue: '' },
                    { name: 'locale', defaultValue: '' }
                ]
            },
            CustomEvent: {
                args: [
                    { name: 'detail', defaultValue: null }
                ]
            },
            DeviceMotionEvent: {
                args: [
                    { name: 'acceleration', defaultValue: null },
                    { name: 'accelerationIncludingGravity', defaultValue: null },
                    { name: 'rotationRate', defaultValue: null },
                    { name: 'interval', defaultValue: null }
                ]
            },
            DeviceOrientationEvent: {
                args: [
                    { name: 'alpha', defaultValue: null },
                    { name: 'beta', defaultValue: null },
                    { name: 'gamma', defaultValue: null },
                    { name: 'absolute', defaultValue: false }
                ]
            },
            DragEvent: {
                args: [
                    { name: 'view', defaultValue: null },
                    { name: 'detail', defaultValue: 0 },
                    { name: 'screenX', defaultValue: 0 },
                    { name: 'screenY', defaultValue: 0 },
                    { name: 'clientX', defaultValue: 0 },
                    { name: 'clientY', defaultValue: 0 },
                    { name: 'ctrlKey', defaultValue: false },
                    { name: 'altKey', defaultValue: false },
                    { name: 'shiftKey', defaultValue: false },
                    { name: 'metaKey', defaultValue: false },
                    { name: 'button', defaultValue: 0 },
                    { name: 'relatedTarget', defaultValue: null },
                    { name: 'dataTransfer', defaultValue: null }
                ]
            },
            ErrorEvent: {
                args: [
                    { name: 'message', defaultValue: '' },
                    { name: 'filename', defaultValue: '' },
                    { name: 'lineno', defaultValue: 0 }
                ]
            },
            FocusEvent: {
                args: [
                    { name: 'view', defaultValue: null },
                    { name: 'detail', defaultValue: 0 },
                    { name: 'relatedTarget', defaultValue: null }
                ]
            },
            GamepadEvent: {
                args: [
                    { name: 'gamepad', defaultValue: null }
                ]
            },
            HashChangeEvent: {
                args: [
                    { name: 'oldURL', defaultValue: '' },
                    { name: 'newURL', defaultValue: '' }
                ]
            },
            KeyboardEvent: {
                args: [
                    { name: 'view', defaultValue: null },
                    { name: 'key', defaultValue: '' },
                    { name: 'location', defaultValue: 0 },
                    { name: 'KEY_MODIFIER_LIST', defaultValue: '' },
                    { name: 'repeat', defaultValue: false },
                    { name: 'locale', defaultValue: '' }
                ]
            },
            MediaStreamEvent: {
                args: [
                    { name: 'stream', defaultValue: null }
                ]
            },
            MessageEvent: {
                args: [
                    { name: 'data', defaultValue: null },
                    { name: 'origin', defaultValue: '' },
                    { name: null, defaultValue: '' },
                    { name: 'source', defaultValue: null }
                ]
            },
            MouseEvent: {
                args: [
                    { name: 'view', defaultValue: null },
                    { name: 'detail', defaultValue: 0 },
                    { name: 'screenX', defaultValue: 0 },
                    { name: 'screenY', defaultValue: 0 },
                    { name: 'clientX', defaultValue: 0 },
                    { name: 'clientY', defaultValue: 0 },
                    { name: 'ctrlKey', defaultValue: false },
                    { name: 'altKey', defaultValue: false },
                    { name: 'shiftKey', defaultValue: false },
                    { name: 'metaKey', defaultValue: false },
                    { name: 'button', defaultValue: 0 },
                    { name: 'relatedTarget', defaultValue: null }
                ]
            },
            PageTransitionEvent: {
                args: [
                    { name: 'persisted', defaultValue: false }
                ]
            },
            PointerEvent: {
                args: [
                    { name: 'view', defaultValue: null },
                    { name: 'detail', defaultValue: 0 },
                    { name: 'screenX', defaultValue: 0 },
                    { name: 'screenY', defaultValue: 0 },
                    { name: 'clientX', defaultValue: 0 },
                    { name: 'clientY', defaultValue: 0 },
                    { name: 'ctrlKey', defaultValue: false },
                    { name: 'altKey', defaultValue: false },
                    { name: 'shiftKey', defaultValue: false },
                    { name: 'metaKey', defaultValue: false },
                    { name: 'button', defaultValue: 0 },
                    { name: 'relatedTarget', defaultValue: null },
                    { name: 'offsetX', defaultValue: 0 },
                    { name: 'offsetY', defaultValue: 0 },
                    { name: 'width', defaultValue: 0 },
                    { name: 'height', defaultValue: 0 },
                    { name: 'pressure', defaultValue: 0 },
                    { name: 'rotation', defaultValue: 0 },
                    { name: 'tiltX', defaultValue: 0 },
                    { name: 'tiltY', defaultValue: 0 },
                    { name: 'pointerId', defaultValue: 0 },
                    { name: 'pointerType', defaultValue: 0 },
                    { name: 'hwTimestamp', defaultValue: 0 },
                    { name: 'isPrimary', defaultValue: 0 }
                ],
                alternateNames: ['MSPointerEvent']
            },
            PopStateEvent: {
                args: [
                    { name: 'state', defaultValue: null }
                ]
            },
            ProgressEvent: {
                args: [
                    { name: 'lengthComputable', defaultValue: false },
                    { name: 'loaded', defaultValue: 0 },
                    { name: 'total', defaultValue: 0 }
                ]
            },
            StorageEvent: {
                args: [
                    { name: 'key', defaultValue: null },
                    { name: 'oldValue', defaultValue: null },
                    { name: 'newValue', defaultValue: null },
                    { name: 'url', defaultValue: '' },
                    { name: 'storageArea', defaultValue: null }
                ]
            },
            TouchEvent: {
                args: alternateInitTouchEvent
                    ? [
                        { name: 'touches', defaultValue: null },
                        { name: 'targetTouches', defaultValue: null },
                        { name: 'changedTouches', defaultValue: null },
                        { name: 'type', defaultValue: '' },
                        { name: 'view', defaultValue: null },
                        { name: 'screenX', defaultValue: 0 },
                        { name: 'screenY', defaultValue: 0 },
                        { name: 'clientX', defaultValue: 0 },
                        { name: 'clientY', defaultValue: 0 },
                        { name: 'ctrlKey', defaultValue: false },
                        { name: 'altKey', defaultValue: false },
                        { name: 'shiftKey', defaultValue: false },
                        { name: 'metaKey', defaultValue: false }
                    ]
                    : [
                        { name: 'view', defaultValue: null },
                        { name: 'detail', defaultValue: 0 },
                        { name: 'screenX', defaultValue: 0 },
                        { name: 'screenY', defaultValue: 0 },
                        { name: 'clientX', defaultValue: 0 },
                        { name: 'clientY', defaultValue: 0 },
                        { name: 'ctrlKey', defaultValue: false },
                        { name: 'altKey', defaultValue: false },
                        { name: 'shiftKey', defaultValue: false },
                        { name: 'metaKey', defaultValue: false },
                        { name: 'touches', defaultValue: null },
                        { name: 'targetTouches', defaultValue: null },
                        { name: 'changedTouches', defaultValue: null },
                        { name: 'scale', defaultValue: null },
                        { name: 'rotation', defaultValue: null }
                    ],
                omitBaseArgs: alternateInitTouchEvent
            },
            TransitionEvent: {
                args: [
                    { name: 'animationName', defaultValue: '' },
                    { name: 'elapsedTime', defaultValue: 0 }
                ]
            },
            UIEvent: {
                args: [
                    { name: 'view', defaultValue: null },
                    { name: 'detail', defaultValue: 0 }
                ]
            },
            UserProximityEvent: {
                args: [
                    { name: 'near', defaultValue: false }
                ]
            },
            WebGLContextEvent: {
                args: [
                    { name: 'statusMessage', defaultValue: '' }
                ]
            },
            WheelEvent: {
                args: [
                    { name: 'view', defaultValue: null },
                    { name: 'detail', defaultValue: 0 },
                    { name: 'screenX', defaultValue: 0 },
                    { name: 'screenY', defaultValue: 0 },
                    { name: 'clientX', defaultValue: 0 },
                    { name: 'clientY', defaultValue: 0 },
                    { name: 'button', defaultValue: 0 },
                    { name: 'relatedTarget', defaultValue: null },
                    { name: 'KEY_MODIFIER_LIST', defaultValue: null },
                    { name: 'deltaX', defaultValue: 0 },
                    { name: 'deltaY', defaultValue: 0 },
                    { name: 'deltaZ', defaultValue: 0 },
                    { name: 'deltaMode', defaultValue: 0 }
                ]
            }
        };

    /**
     * @typedef {Object} KeyModifierEventInit
     * @property {Boolean} altKey
     * @property {Boolean} bubbles
     * @property {Boolean} cancelable
     * @property {Boolean} ctrlKey
     * @property {Number} detail
     * @property {Boolean} metaKey
     * @property {Boolean} shiftKey
     * @property {String} type
     * @property {Window} view
     */

    /**
     * @typedef {Object} EventArgInfo
     * @property {String} name
     * @property {Object} defaultValue
     */

    /**
     * @typedef {Object} EventInfo
     * @property {Array.<String>} alternateNames
     * @property {Array.<EventArgInfo>} args
     * @property {String} createEventInterfaceName
     * @property {Function} defaultConstructor
     * @property {Function} initializer
     * @property {String} name
     * @property {Boolean} omitBaseArgs
     * @property {Event} proto
     * @property {Function} polyfilledConstructor
     */

    /**
     * @param {KeyModifierEventInit} props
     * @returns {String}
     */
    function getKeyModifierList(props) {
        var list = [],
            t = 0,
            i = keyModifiers.length,
            prop;
        while (i--) {
            prop = keyModifiers[i];
            if (!!props[prop]) {
                list[t++] = keyModifierMapping[prop];
            }
        }
        return list.join(' ');
    }

    /**
     * @param {Function} eventInterface
     * @returns {Boolean}
     */
    function canConstructEvent(eventInterface) {
        if (typeof eventInterface !== 'function') {
            return false;
        }
        try {
            new eventInterface('');
            return true;
        } catch (ex) {
            return false;
        }
    }

    /**
     * @param {String} eventInterfaceName
     * @returns {Boolean}
     */
    function canCreateEvent(eventInterfaceName) {
        try {
            document.createEvent(eventInterfaceName);
            return true;
        } catch (ex) {
            return false;
        }
    }

    /**
     * @param {EventInfo} info
     * @param {String} type
     * @param {Object} eventInitDict
     * @returns {Array}
     */
    function buildInitArgs(info, type, eventInitDict) {
        var argInfo = info.args,
            args = [],
            i = 0,
            l = argInfo.length,
            arg, name, value;
        for (; i < l; i++) {
            arg = argInfo[i];
            name = arg.name;
            if (name === 'type') {
                value = type;
            } else if (name == null) {
                value = arg.defaultValue;
            } else if (name === 'KEY_MODIFIER_LIST') {
                value = getKeyModifierList(eventInitDict);
            } else if (name in eventInitDict) {
                value = eventInitDict[name];
            } else {
                value = arg.defaultValue;
            }
            args[i] = value;
        }
        return args;
    }

    /**
     * @param {EventInfo} info
     * @param {Event} thisArg
     * @param {Array} args
     * @returns {Event}
     */
    function createEvent(info, thisArg, args) {
        var isProto = false,
            test, type, eventInitDict, initArgs, event;

        // The following check is designed to prevent the use of [EventConstructor].call()
        // and enforce the use of the 'new' operator, in accordance with the event
        // constructor specification.
        if (thisArg === info.proto || !(thisArg instanceof info.defaultConstructor)) {
            throw new TypeError("The '" + info.name + "' constructor requires use of the 'new' operator.");
        }
        // The above check can fail if a pre-existing Event instance is passed as
        // the first parameter ('thisArg') to [EventConstructor].call(), for example:
        // 
        //     MouseEvent.call(new MouseEvent('click'));
        // 
        // When creating a new event using a polyfilled constructor, the 'this' object
        // should be a new, uninitialized instance of the interface prototype object,
        // meaning its properties (i.e. 'target') should throw a TypeError if we try
        // to get their value.
        try {
            test = thisArg.target;
        } catch (e) {
            isProto = true;
        }
        if (!isProto) {
            throw new TypeError("The '" + info.name + "' constructor requires use of the 'new' operator.");
        }
        // Even THAT check can be bypassed, however:
        // 
        //     MouseEvent.call(Object.create(MouseEvent.prototype));
        // 
        // There's nothing we can do to prevent this, because when using a polyfilled
        // constructor, the 'this' object we receive is essentially the result of
        // "Object.create(EventInterface.prototype)". There's no way to tell whether
        // or not it's coming from user code.
        // 
        // Of course, these polyfilled constructors don't manipulate the 'this' object
        // in any way; they always return a new object, regardless of the presence of
        // the 'new' operator.

        if (args.length === 0) {
            throw new TypeError("Failed to construct '" + info.name + "': parameter 1 ('type') is required.");
        }
        if (args.length > 1 && args[1] != null && !(args[1] instanceof Object)) {
            throw new TypeError("Failed to construct '" + info.name + "': parameter 2 ('eventInitDict') is not an object.");
        }
        type = '' + args[0];
        eventInitDict = args[1] || {};
        initArgs = buildInitArgs(info, type, eventInitDict);
        event = window.document.createEvent(info.createEventInterfaceName);
        info.initializer.apply(event, initArgs);
        return event;
    }

    /**
     * @param {EventInfo} info
     * @returns {Function}
     */
    function createEventConstructor(info) {
        var ctor = (function (name) {
            return function (type, eventInit) {
                return createEvent(eventInfo[name], this, arguments);
            }
        })(info.name);
        ctor.prototype = info.defaultConstructor.prototype;
        ctor.prototype.constructor = ctor;
        window[info.name] = ctor;
        return ctor;
    }

    /**
     * @param {EventInfo} info
     * @param {String} interfaceName
     * @returns {Boolean}
     */
    function polyfillEvent(info, interfaceName) {
        var interfaceNames = [interfaceName].concat(info.alternateNames || []),
            canCreate = false,
            i = 0,
            l = interfaceNames.length,
            usedInterfaceName,
            eventInterface,
            initializerName,
            initializer,
            createEventInterfaceName;

        while (!eventInterface && i < l) {
            usedInterfaceName = interfaceNames[i++];
            eventInterface = window[usedInterfaceName];
        }
        if (!eventInterface || (eventInterface.prototype !== Event.prototype && !(eventInterface.prototype instanceof Event)) || canConstructEvent(eventInterface)) {
            return false;
        }

        i = 0;
        while (!initializer && i < l) {
            initializerName = 'init' + interfaceNames[i++];
            initializer = eventInterface.prototype instanceof Object ? eventInterface.prototype[initializerName] : null;
        }
        if (typeof initializer !== 'function') {
            return false;
        }
        
        i = 0;
        while (!canCreate && i < l) {
            createEventInterfaceName = interfaceNames[i++];
            canCreate = canCreateEvent(createEventInterfaceName);
        }
        if (!canCreate) {
            return false;
        }

        info.name = interfaceName;
        info.createEventInterfaceName = createEventInterfaceName;
        info.defaultConstructor = eventInterface;
        if (info.omitBaseArgs !== true) {
            info.args = baseArgs.concat(info.args);
        }
        info.initializer = initializer;
        info.proto = eventInterface.prototype;
        info.polyfilledConstructor = createEventConstructor(info);

        return true;
    }

    for (var interfaceName in eventInfo) {
        if (eventInfo.hasOwnProperty(interfaceName) && !polyfillEvent(eventInfo[interfaceName], interfaceName)) {
            delete eventInfo[interfaceName];
        }
    }

    window.E = eventInfo;
    return eventInfo;

})(window);