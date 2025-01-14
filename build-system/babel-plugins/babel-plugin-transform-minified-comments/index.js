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

/**
 * Ensure comments in minified build output is minimal.
 *
 * @interface {babel.PluginPass}
 * @return {babel.PluginObj}
 */
module.exports = function () {
  return {
    visitor: {
      Statement(path) {
        const {node} = path;
        const {trailingComments} = node;
        if (trailingComments?.length) {
          node.trailingComments = trailingComments.map((comment) => ({
            ...comment,
            value: comment.value.replace(/\s+/g, ' '),
          }));

          const next = /** @type {*} */ (path).getNextSibling();
          if (next?.node) {
            next.node.leadingComments = null;
          }
        }
      },
    },
  };
};
