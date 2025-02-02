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

import {buildUrl} from '#ads/google/a4a/shared/url-builder';

import {dict} from '#core/types/object';
import {tryParseJson} from '#core/types/object/json';

import {Services} from '#service';

import {parseUrlDeprecated} from '../../../src/url';

/**
 * @implements {./ad-network-config.AdNetworkConfigDef}
 */
export class DoubleclickNetworkConfig {
  /**
   * @param {!Element} autoAmpAdsElement
   */
  constructor(autoAmpAdsElement) {
    this.autoAmpAdsElement_ = autoAmpAdsElement;
  }

  /**
   * @param {!Window} unused
   */
  isEnabled(unused) {
    return true;
  }

  /**
   * True if responsive is enabled for auto-ads
   */
  isResponsiveEnabled() {
    return false;
  }

  /** @override */
  getConfigUrl() {
    const docInfo = Services.documentInfoForDoc(this.autoAmpAdsElement_);
    const canonicalHostname = parseUrlDeprecated(docInfo.canonicalUrl).hostname;
    return buildUrl(
      '//pagead2.googlesyndication.com/getconfig/ama',
      {
        'client': this.autoAmpAdsElement_.getAttribute('data-ad-legacy-client'),
        'plah': canonicalHostname,
        'ama_t': 'amp',
        'url': docInfo.canonicalUrl,
      },
      4096
    );
  }

  /** @override */
  getAttributes() {
    const attributes = dict({
      'type': 'doubleclick',
      'data-slot': this.autoAmpAdsElement_.getAttribute('data-slot'),
      'json': this.autoAmpAdsElement_.getAttribute('data-json'),
    });
    return attributes;
  }

  /** @override */
  getDefaultAdConstraints() {
    const viewportHeight = Services.viewportForDoc(
      this.autoAmpAdsElement_
    ).getSize().height;
    return {
      initialMinSpacing: viewportHeight,
      subsequentMinSpacing: [
        {adCount: 3, spacing: viewportHeight * 2},
        {adCount: 6, spacing: viewportHeight * 3},
      ],
      maxAdCount: 8,
    };
  }

  /** @override */
  getSizing() {
    const experimentJson = tryParseJson(
      this.autoAmpAdsElement_.getAttribute('data-experiment')
    );
    if (experimentJson) {
      return {
        height: experimentJson['height']
          ? Number(experimentJson['height'])
          : 250,
        width: experimentJson['width']
          ? Number(experimentJson['width'])
          : undefined,
      };
    }
    return {};
  }
}
