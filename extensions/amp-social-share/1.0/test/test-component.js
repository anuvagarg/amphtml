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

import {mount} from 'enzyme';

import {dict} from '#core/types/object';

import * as Preact from '#preact';

import {SocialShare} from '../component';

describes.sandboxed('SocialShare 1.0 preact component', {}, () => {
  const originalWarn = console.warn;

  afterEach(() => (console.warn = originalWarn));

  it(
    'warns when the required endpoint is not provided when not using' +
      ' a pre-configured type',
    () => {
      const consoleOutput = [];
      const mockedWarn = (output) => consoleOutput.push(output);
      console.warn = mockedWarn;

      const jsx = <SocialShare {...dict({'type': 'not-configured-type'})} />;
      const wrapper = mount(jsx);

      expect(wrapper.exists('div')).to.equal(false);
      expect(consoleOutput.length).to.equal(1);
      expect(consoleOutput[0]).to.equal(
        'An endpoint is required if not using a pre-configured type. SocialShare'
      );
    }
  );

  it('should include the button class for focus styling', () => {
    const jsx = <SocialShare {...dict({'type': 'email'})} />;
    const wrapper = mount(jsx);

    const button = wrapper.getDOMNode();
    expect(button.className.includes('button')).to.be.true;
  });
});
