/**
 * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
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

import {removeElement} from '#core/dom';
import {applyFillContent, isLayoutSizeDefined} from '#core/dom/layout';

import {Services} from '#service';

import {devAssert, userAssert} from '../../../src/log';
import {setIsMediaComponent} from '../../../src/video-interface';

class AmpHulu extends AMP.BaseElement {
  /** @param {!AmpElement} element */
  constructor(element) {
    super(element);

    /** @private {?Element} */
    this.iframe_ = null;

    /** @private {?string} */
    this.eid_ = null;
  }

  /** @override */
  preconnectCallback() {
    Services.preconnectFor(this.win).preload(
      this.getAmpDoc(),
      this.getVideoIframeSrc_()
    );
  }

  /** @override */
  isLayoutSupported(layout) {
    return isLayoutSizeDefined(layout);
  }

  /** @override */
  layoutCallback() {
    const iframe = document.createElement('iframe');
    const src = this.getVideoIframeSrc_();
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.src = src;
    applyFillContent(iframe);
    this.element.appendChild(iframe);
    this.iframe_ = iframe;

    return this.loadPromise(iframe);
  }

  /** @override */
  unlayoutOnPause() {
    return true;
  }

  /** @override */
  unlayoutCallback() {
    if (this.iframe_) {
      removeElement(this.iframe_);
      this.iframe_ = null;
    }
    return true;
  }

  /** @override */
  buildCallback() {
    setIsMediaComponent(this.element);

    this.eid_ = userAssert(
      this.element.getAttribute('data-eid'),
      'The data-eid attribute is required for <amp-hulu> %s',
      this.element
    );
  }

  /** @return {string} */
  getVideoIframeSrc_() {
    devAssert(this.eid_);
    return `https://player.hulu.com/site/dash/mobile_embed.html?amp=1&eid=${encodeURIComponent(
      this.eid_ || ''
    )}`;
  }
}

AMP.extension('amp-hulu', '0.1', (AMP) => {
  AMP.registerElement('amp-hulu', AmpHulu);
});
