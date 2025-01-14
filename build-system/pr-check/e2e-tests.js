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
'use strict';

/**
 * @fileoverview Script that runs the end-to-end tests during CI.
 */

const {
  TEST_FILES_LIST_FILE_NAME,
  generateCircleCiShardTestFileList,
  skipDependentJobs,
  timedExecOrDie,
  timedExecOrThrow,
} = require('./utils');
const {e2eTestPaths} = require('../test-configs/config');
const {runCiJob} = require('./ci-job');
const {Targets, buildTargetsInclude} = require('./build-targets');

const jobName = 'e2e-tests.js';

/**
 * Steps to run during push builds.
 */
function pushBuildWorkflow() {
  try {
    generateCircleCiShardTestFileList(e2eTestPaths);
    timedExecOrThrow(
      `amp e2e --nobuild --headless --minified --report --filelist ${TEST_FILES_LIST_FILE_NAME}`,
      'End-to-end tests failed!'
    );
  } catch (e) {
    if (e.status) {
      process.exitCode = e.status;
    }
  } finally {
    timedExecOrDie('amp test-report-upload');
  }
}

/**
 * Steps to run during PR builds.
 */
function prBuildWorkflow() {
  if (buildTargetsInclude(Targets.RUNTIME, Targets.E2E_TEST)) {
    generateCircleCiShardTestFileList(e2eTestPaths);
    timedExecOrDie(
      `amp e2e --nobuild --headless --minified --filelist ${TEST_FILES_LIST_FILE_NAME}`
    );
  } else {
    skipDependentJobs(
      jobName,
      'this PR does not affect the runtime or end-to-end tests'
    );
  }
}
runCiJob(jobName, pushBuildWorkflow, prBuildWorkflow);
