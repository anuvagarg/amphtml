/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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
'use strict';

/**
 * @fileoverview Script that tests the module AMP runtime during CI.
 */

const argv = require('minimist')(process.argv.slice(2));
const {MINIFIED_TARGETS} = require('../tasks/helpers');
const {runCiJob} = require('./ci-job');
const {skipDependentJobs, timedExecOrDie} = require('./utils');
const {Targets, buildTargetsInclude} = require('./build-targets');

const jobName = 'module-tests.js';

/**
 * Adds a canary or prod config string to all esm and non-esm minified targets.
 */
function prependConfig() {
  const targets = MINIFIED_TARGETS.flatMap((target) => [
    `dist/${target}.js`,
    `dist/${target}.mjs`,
  ]).join(',');
  timedExecOrDie(
    `amp prepend-global --${argv.config} --local_dev --fortesting --derandomize --target=${targets}`
  );
}

/**
 * Steps to run during push builds.
 */
function pushBuildWorkflow() {
  prependConfig();
  timedExecOrDie('amp integration --nobuild --minified --headless --esm');
}

/**
 * Steps to run during PR builds.
 */
function prBuildWorkflow() {
  if (buildTargetsInclude(Targets.RUNTIME, Targets.INTEGRATION_TEST)) {
    prependConfig();
    timedExecOrDie(
      `amp integration --nobuild --minified --headless --esm --config=${argv.config}`
    );
  } else {
    skipDependentJobs(
      jobName,
      'this PR does not affect the runtime or integration tests'
    );
  }
}

runCiJob(jobName, pushBuildWorkflow, prBuildWorkflow);
