/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Whether addEventListener supports options or only takes capture as a boolean
 * @type {boolean|undefined}
 * @visibleForTesting
 */
let optsSupported;

/**
 * Whether addEventListener supports options or only takes passive as a boolean
 * @type {boolean|undefined}
 */
let passiveSupported;

/**
 * Options supported by addEventListener
 * @typedef AddEventListenerOptsDef
 * @property {undefined|boolean} [capture]
 * @property {undefined|boolean} [once]
 * @property {undefined|boolean} [passive]
 * @property {undefined|!AbortSignal} [signal]
 * }}
 */
let AddEventListenerOptsDef;

/**
 * Listens for the specified event on the element.
 *
 * Do not use this directly. This method is implemented as a shared
 * dependency. Use `listen()` in either `event-helper` or
 * `#core/3p-frame-messaging`, depending on your use case.
 *
 * @param {!EventTarget} element
 * @param {string} eventType
 * @param {function(!Event)} listener
 * @param {!AddEventListenerOptsDef=} opt_evtListenerOpts
 * @return {!UnlistenDef}
 */
export function internalListenImplementation(
  element,
  eventType,
  listener,
  opt_evtListenerOpts
) {
  let localElement = element;
  let localListener = listener;
  /** @type {?function(!Event)} */
  let wrapped = (event) => {
    try {
      return localListener(event);
    } catch (e) {
      // __AMP_REPORT_ERROR is installed globally per window in the entry point.
      self.__AMP_REPORT_ERROR?.(e);
      throw e;
    }
  };
  const optsSupported = detectEvtListenerOptsSupport();
  const capture = !!opt_evtListenerOpts?.capture;

  localElement.addEventListener(
    eventType,
    wrapped,
    optsSupported ? opt_evtListenerOpts : capture
  );
  return () => {
    localElement?.removeEventListener(
      eventType,
      wrapped,
      optsSupported ? opt_evtListenerOpts : capture
    );
    // Ensure these are GC'd
    localListener = null;
    localElement = null;
    wrapped = null;
  };
}

/**
 * Tests whether the browser supports options as an argument of addEventListener
 * or not.
 *
 * @return {boolean}
 */
export function detectEvtListenerOptsSupport() {
  // Only run the test once
  if (optsSupported !== undefined) {
    return optsSupported;
  }

  optsSupported = false;
  try {
    // Test whether browser supports EventListenerOptions or not
    const options = {
      get capture() {
        optsSupported = true;
      },
    };
    self.addEventListener('test-options', null, options);
    self.removeEventListener('test-options', null, options);
  } catch (err) {
    // EventListenerOptions are not supported
  }
  return optsSupported;
}

/**
 * Resets the test for whether addEventListener supports options or not.
 */
export function resetEvtListenerOptsSupportForTesting() {
  optsSupported = undefined;
}

/**
 * Return boolean. if listener option is supported, return `true`.
 * if not supported, return `false`
 * @param {!Window} win
 * @return {boolean}
 */
export function supportsPassiveEventListener(win) {
  if (passiveSupported !== undefined) {
    return passiveSupported;
  }

  passiveSupported = false;
  try {
    const options = {
      get passive() {
        // This function will be called when the browser
        // attempts to access the passive property.
        passiveSupported = true;
        return false;
      },
    };

    win.addEventListener('test-options', null, options);
    win.removeEventListener('test-options', null, options);
  } catch (err) {
    // EventListenerOptions are not supported
  }
  return passiveSupported;
}

/**
 * Resets the test for whether addEventListener supports passive options or not.
 */
export function resetPassiveSupportedForTesting() {
  passiveSupported = undefined;
}
