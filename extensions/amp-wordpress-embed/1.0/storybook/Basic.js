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

import {number, text, withKnobs} from '@storybook/addon-knobs';

import * as Preact from '#preact';

import {WordPressEmbed} from '../component';

export default {
  title: 'WordPressEmbed',
  component: WordPressEmbed,
  decorators: [withKnobs],
};

export const _default = () => {
  const url = text(
    'url',
    'https://wordpress.org/news/2021/06/gutenberg-highlights'
  );
  const width = number('width', 500);
  const height = number('height', 200);

  return <WordPressEmbed url={url} style={{width, height}} />;
};
