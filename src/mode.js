/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
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

import * as coreMode from '#core/mode';
import {getHashParams} from '#core/types/string/url';

/**
 * @typedef {{
 *   localDev: boolean,
 *   development: boolean,
 *   test: boolean,
 *   rtvVersion: string,
 *   runtime: (null|string|undefined),
 *   a4aId: (null|string|undefined),
 *   esm: (boolean|undefined),
 * }}
 */
export let ModeDef;

/**
 * `rtvVersion` is the prefixed version we serve off of the cdn.
 * The prefix denotes canary(00) or prod(01) or an experiment version ( > 01).
 * @type {string}
 */
let rtvVersion = '';

/**
 * Provides info about the current app.
 * @param {?Window=} opt_win
 * @return {!ModeDef}
 */
export function getMode(opt_win) {
  const win = opt_win || self;
  if (win.__AMP_MODE) {
    return win.__AMP_MODE;
  }
  return (win.__AMP_MODE = getMode_(win));
}

/**
 * Provides info about the current app.
 * @param {!Window} win
 * @return {!ModeDef}
 */
function getMode_(win) {
  const hashParams = getHashParams(win);

  // The `minified`, `test` and `localDev` properties are replaced
  // as boolean literals when we run `amp dist` without the `--fortesting`
  // flags. This improved DCE on the production file we deploy as the code
  // paths for localhost/testing/development are eliminated.
  return {
    localDev: coreMode.isLocalDev(win),
    development: isModeDevelopment(win, hashParams),
    esm: IS_ESM,
    test: coreMode.isTest(win),
    rtvVersion: getRtvVersion(win),
  };
}

/**
 * Retrieve the `rtvVersion` which will have a numeric prefix
 * denoting canary/prod/experiment (unless `isLocalDev` is true).
 *
 * @param {!Window} win
 * @return {string}
 */
function getRtvVersion(win) {
  // Ignore memoized copy during testing to allow override.
  if (!rtvVersion || coreMode.isTest(win)) {
    // Currently `internalRuntimeVersion` and thus `mode.version` contain only
    // major version. The full version however must also carry the minor version.
    // We will default to production default `01` minor version for now.
    // TODO(erwinmombay): decide whether internalRuntimeVersion should contain
    // minor version.
    rtvVersion = win.AMP_CONFIG?.v || `01${coreMode.version()}`;
  }
  return rtvVersion;
}

/**
 * Triggers validation or enable pub level logging. Validation can be
 * bypassed via #validate=0.
 * Note that AMP_DEV_MODE flag is used for testing purposes.
 * @param {!Window} win
 * @param {!JsonObject=} opt_hashParams
 * @return {boolean}
 */
export function isModeDevelopment(win, opt_hashParams) {
  const devModes = ['1', 'actions', 'amp', 'amp4ads', 'amp4email'];
  const devParam = opt_hashParams || getHashParams(win);
  return devModes.includes(devParam['development']) || !!win.AMP_DEV_MODE;
}

/**
 * @param {!Window} win
 * @return {string}
 * @visibleForTesting
 */
export function getRtvVersionForTesting(win) {
  return getRtvVersion(win);
}

/** @visibleForTesting */
export function resetRtvVersionForTesting() {
  rtvVersion = '';
}
