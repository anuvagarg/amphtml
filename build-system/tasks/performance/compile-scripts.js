/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

const argv = require('minimist')(process.argv.slice(2));
const {buildRuntime} = require('../../common/utils');
const {EXPERIMENT, urlToCachePath} = require('./helpers');
const {setExtensionsToBuildFromDocuments} = require('../extension-helpers');

/**
 * Compiles and minifies AMP runtime and components required by the urls
 * argument, unless the --nobuild flag is passed.
 * @param {Array<string>} urls
 * @return {Promise<void>}
 */
async function compileScripts(urls) {
  if (!argv.nobuild) {
    const examples = urls.map((url) => urlToCachePath(url, EXPERIMENT));
    setExtensionsToBuildFromDocuments(examples);
    await buildRuntime(/* opt_compiled */ true);
  }
}

module.exports = compileScripts;
