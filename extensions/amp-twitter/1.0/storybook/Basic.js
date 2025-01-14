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

import * as Preact from '#preact';
import {Twitter} from '../component';
import {boolean, number, select, withKnobs} from '@storybook/addon-knobs';

export default {
  title: 'Twitter',
  component: Twitter,
  decorators: [withKnobs],
};

export const _default = () => {
  const tweetId = select(
    'tweet id',
    ['1356304203044499462', '495719809695621121', '463440424141459456'],
    '1356304203044499462'
  );
  const cards = boolean('show cards', true) ? undefined : 'hidden';
  const conversation = boolean('show conversation', false) ? undefined : 'none';
  return (
    <Twitter
      cards={cards}
      conversation={conversation}
      tweetid={tweetId}
      style={{width: '300px', height: '200px'}}
    />
  );
};

export const moments = () => {
  const limit = number('limit to', 2);
  return (
    <Twitter
      limit={limit}
      momentid="1009149991452135424"
      style={{width: '300px', height: '200px'}}
    />
  );
};

export const timelines = () => {
  const tweetLimit = number('limit to', 5);
  const timelineSourceType = select(
    'source type',
    ['profile', 'likes', 'list', 'source', 'collection', 'url', 'widget'],
    'profile'
  );
  const timelineScreenName = 'amphtml';
  const timelineUserId = '3450662892';
  return (
    <Twitter
      tweetLimit={tweetLimit}
      timelineSourceType={timelineSourceType}
      timelineScreenName={timelineScreenName}
      timelineUserId={timelineUserId}
      style={{width: '300px', height: '200px'}}
    />
  );
};
