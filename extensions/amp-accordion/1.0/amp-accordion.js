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

import {ActionTrust} from '#core/constants/action-constants';
import {toWin} from '#core/window';

import {isExperimentOn} from '#experiments';

import {Services} from '#service';

import {BaseElement} from './base-element';

import {CSS} from '../../../build/amp-accordion-1.0.css';
import {createCustomEvent} from '../../../src/event-helper';
import {userAssert} from '../../../src/log';

/** @const {string} */
const TAG = 'amp-accordion';

/** @extends {PreactBaseElement<AccordionDef.AccordionApi>} */
class AmpAccordion extends BaseElement {
  /** @override */
  init() {
    this.registerApiAction('toggle', (api, invocation) =>
      api./*OK*/ toggle(invocation.args && invocation.args['section'])
    );
    this.registerApiAction('expand', (api, invocation) =>
      api./*OK*/ expand(invocation.args && invocation.args['section'])
    );
    this.registerApiAction('collapse', (api, invocation) =>
      api./*OK*/ collapse(invocation.args && invocation.args['section'])
    );

    return super.init();
  }

  /** @override */
  triggerEvent(section, eventName, detail) {
    const event = createCustomEvent(
      toWin(section.ownerDocument.defaultView),
      `accordionSection.${eventName}`,
      detail
    );
    Services.actionServiceForDoc(section).trigger(
      section,
      eventName,
      event,
      ActionTrust.HIGH
    );

    super.triggerEvent(section, eventName, detail);
  }

  /** @override */
  isLayoutSupported(unusedLayout) {
    userAssert(
      isExperimentOn(this.win, 'bento') ||
        isExperimentOn(this.win, 'bento-accordion'),
      'expected global "bento" or specific "bento-accordion" experiment to be enabled'
    );
    return true;
  }
}

AMP.extension(TAG, '1.0', (AMP) => {
  AMP.registerElement(TAG, AmpAccordion, CSS);
});
