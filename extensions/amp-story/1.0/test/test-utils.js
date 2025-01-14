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

import {StateProperty} from '../amp-story-store-service';
import {
  getRGBFromCssColorValue,
  getTextColorForRGB,
  shouldShowStoryUrlInfo,
  timeStrToMillis,
} from '../utils';

describes.fakeWin('amp-story utils', {}, (env) => {
  describe('timeStrToMillis', () => {
    it('should return millis for a milliseconds string', () => {
      const millis = timeStrToMillis('100ms');

      expect(millis).to.equal(100);
    });

    it('should return millis for a seconds string', () => {
      const millisForSeconds = timeStrToMillis('1s');

      expect(millisForSeconds).to.equal(1000);
    });

    it('should return millis for a decimal seconds string', () => {
      const millisForSeconds = timeStrToMillis('1.64s');

      expect(millisForSeconds).to.equal(1640);
    });

    it('should return millis for a uppercase string', () => {
      const millisForSeconds = timeStrToMillis('2.5S');

      expect(millisForSeconds).to.equal(2500);
    });

    it('should return NaN for invalid types', () => {
      const convertedMillis = timeStrToMillis('10kg');
      expect(convertedMillis).to.be.NaN;
    });

    it('should return fallback value for invalid types', () => {
      const fallback = 312;
      const convertedMillis = timeStrToMillis('10kg', fallback);
      expect(convertedMillis).to.equal(fallback);
    });
  });

  describe('getRGBFromCssColorValue', () => {
    it('should accept rgb parameters', () => {
      expect(getRGBFromCssColorValue('rgb(0, 10, 100)')).to.deep.equal({
        r: 0,
        g: 10,
        b: 100,
      });
    });

    it('should accept rgba parameters', () => {
      expect(getRGBFromCssColorValue('rgba(0, 10, 100, 0.1)')).to.deep.equal({
        r: 0,
        g: 10,
        b: 100,
      });
    });

    it('should throw an error if wrong parameters', () => {
      allowConsoleError(() => {
        getRGBFromCssColorValue('who dis');
      });
    });

    it('should return a default value if wrong parameters', () => {
      allowConsoleError(() => {
        expect(getRGBFromCssColorValue('who dis')).to.deep.equal({
          r: 0,
          g: 0,
          b: 0,
        });
      });
    });
  });

  describe('getTextColorForRGB', () => {
    it('should return white for a dark background', () => {
      expect(getTextColorForRGB({r: 10, g: 10, b: 10})).to.equal('#FFF');
    });

    it('should return white for a light background', () => {
      expect(getTextColorForRGB({r: 200, g: 200, b: 200})).to.equal('#000');
    });
  });

  describe('shouldShowStoryUrlInfo', () => {
    it('should be true when isEmbedded', () => {
      const fakeViewer = {
        getParam: () => null,
        isEmbedded: () => true,
      };
      const fakeStoreService = {get: () => true};
      expect(shouldShowStoryUrlInfo(fakeViewer, fakeStoreService)).to.be.true;
    });

    it('should be forced to false when isEmbedded', () => {
      const fakeViewer = {
        getParam: () => '0',
        isEmbedded: () => true,
      };
      const fakeStoreService = {get: () => true};
      expect(shouldShowStoryUrlInfo(fakeViewer, fakeStoreService)).to.be.false;
    });

    it('should be false when !isEmbedded', () => {
      const fakeViewer = {
        getParam: () => null,
        isEmbedded: () => false,
      };
      const fakeStoreService = {get: () => true};
      expect(shouldShowStoryUrlInfo(fakeViewer, fakeStoreService)).to.be.false;
    });

    it('should be forced to true when !isEmbedded', () => {
      const fakeViewer = {
        getParam: () => '1',
        isEmbedded: () => false,
      };
      const fakeStoreService = {get: () => true};
      expect(shouldShowStoryUrlInfo(fakeViewer, fakeStoreService)).to.be.true;
    });

    it('should be false when CAN_SHOW_STORY_URL_INFO is false', () => {
      const fakeViewer = {
        getParam: () => null,
        isEmbedded: () => true,
      };
      const fakeStoreService = {get: () => {}};
      const getStub = env.sandbox.stub(fakeStoreService, 'get').returns(false);
      expect(shouldShowStoryUrlInfo(fakeViewer, fakeStoreService)).to.be.false;
      expect(getStub).to.be.calledOnceWithExactly(
        StateProperty.CAN_SHOW_STORY_URL_INFO
      );
    });

    it('should be true when CAN_SHOW_STORY_URL_INFO is true', () => {
      const fakeViewer = {
        getParam: () => null,
        isEmbedded: () => true,
      };
      const fakeStoreService = {get: () => {}};
      const getStub = env.sandbox.stub(fakeStoreService, 'get').returns(true);
      expect(shouldShowStoryUrlInfo(fakeViewer, fakeStoreService)).to.be.true;
      expect(getStub).to.be.calledOnceWithExactly(
        StateProperty.CAN_SHOW_STORY_URL_INFO
      );
    });
  });
});
