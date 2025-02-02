/**
 * Copyright 2021 The AMP HTML Authors. All Rights Reserved.
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
 * @fileoverview Script that runs the experiment A/B/C integration tests during CI.
 */

const {
  skipDependentJobs,
  timedExecOrDie,
  timedExecOrThrow,
} = require('./utils');
const {experiment} = require('minimist')(process.argv.slice(2));
const {getExperimentConfig} = require('../common/utils');
const {isPushBuild} = require('../common/ci');
const {runCiJob} = require('./ci-job');
const {Targets, buildTargetsInclude} = require('./build-targets');

const jobName = `${experiment}-integration-tests.js`;

/**
 * Runs tests for the given configuration and reports results.
 * @param {!Object} config
 */
function runExperimentTests(config) {
  try {
    const defineFlag = `--define_experiment_constant ${config.define_experiment_constant}`;
    const experimentFlag = `--experiment ${experiment}`;
    const reportFlag = isPushBuild() ? '--report' : '';
    timedExecOrThrow(
      `amp integration --nobuild --minified --headless ${experimentFlag} ${defineFlag} ${reportFlag}`
    );
  } catch (e) {
    if (e.status) {
      process.exitCode = e.status;
    }
  } finally {
    if (isPushBuild()) {
      timedExecOrDie('amp test-report-upload');
    }
  }
}

/**
 * Steps to run during push builds.
 */
function pushBuildWorkflow() {
  // Note that if config is invalid, this build would have been skipped by CircleCI.
  const config = getExperimentConfig(experiment);
  runExperimentTests(config);
}

/**
 * Steps to run during PR builds.
 */
function prBuildWorkflow() {
  if (buildTargetsInclude(Targets.RUNTIME, Targets.INTEGRATION_TEST)) {
    pushBuildWorkflow();
  } else {
    skipDependentJobs(
      jobName,
      'this PR does not affect the runtime or integration tests'
    );
  }
}

runCiJob(jobName, pushBuildWorkflow, prBuildWorkflow);
