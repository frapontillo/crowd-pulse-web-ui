/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  'use strict';

  angular
    .module('webUi')
    .provider('config', configProvider);

  /** @njInject */
  function configProvider() {
    var configPath;
    var listeners = [];
    var config;

    this.useConfigPath = function(value) {
      configPath = value;
    };

    this.addConfigResolvedListener = function(fn) {
      listeners.push(fn);
    };

    this.$get = function configFactory($http, $log, $q) {
      if (!config) {
        config = $q.defer();
        $http.get(configPath).then(function(data) {
          // the old promise is extended with the new data
          var rawConfig = data.data;
          // run every attached listener
          listeners.forEach(function(listener) {
            listener(rawConfig);
          });
          $log.debug('Configuration downloaded and stored.');
          config.resolve(rawConfig);
        });
      }
      // return the temporary promise
      return config.promise;
    };

    return this;
  }

})();
