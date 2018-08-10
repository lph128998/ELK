'use strict';

var _error_if_x_pack = require('./error_if_x_pack');

describe('error_if_xpack', () => {
  it('should error on install if x-pack by name', () => {
    expect(() => (0, _error_if_x_pack.errorIfXPackInstall)({ plugin: 'x-pack' })).toThrow();
  });

  it('should error on install if x-pack by url', () => {
    expect(() => (0, _error_if_x_pack.errorIfXPackInstall)({
      plugin: 'http://localhost/x-pack/x-pack-7.0.0-alpha1-SNAPSHOT.zip'
    })).toThrow();
  });

  it('should not error on install if not x-pack', () => {
    expect(() => (0, _error_if_x_pack.errorIfXPackInstall)({
      plugin: 'foo'
    })).not.toThrow();
  });

  it('should error on remove if x-pack', () => {
    expect(() => (0, _error_if_x_pack.errorIfXPackRemove)({ plugin: 'x-pack' })).toThrow();
  });

  it('should not error on remove if not x-pack', () => {
    expect(() => (0, _error_if_x_pack.errorIfXPackRemove)({ plugin: 'bar' })).not.toThrow();
  });
}); /*
     * Licensed to Elasticsearch B.V. under one or more contributor
     * license agreements. See the NOTICE file distributed with
     * this work for additional information regarding copyright
     * ownership. Elasticsearch B.V. licenses this file to you under
     * the Apache License, Version 2.0 (the "License"); you may
     * not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *    http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing,
     * software distributed under the License is distributed on an
     * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     * KIND, either express or implied.  See the License for the
     * specific language governing permissions and limitations
     * under the License.
     */