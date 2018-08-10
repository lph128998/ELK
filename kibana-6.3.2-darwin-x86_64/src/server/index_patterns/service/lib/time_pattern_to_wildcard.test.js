'use strict';

var _time_pattern_to_wildcard = require('./time_pattern_to_wildcard');

describe('server/index_patterns/service/lib/time_pattern_to_wildcard', () => {
  const tests = [['[logstash-]YYYY.MM.DD', 'logstash-*'], ['YYYY[-department-].w', '*-department-*'], ['YYYY.MM[.department].w', '*.department*'], ['YYYY.MM.[department].w[-old]', '*department*-old']];

  tests.forEach(([input, expected]) => {
    it(`parses ${input}`, () => {
      const output = (0, _time_pattern_to_wildcard.timePatternToWildcard)(input);
      if (output !== expected) {
        throw new Error(`expected ${input} to parse to ${expected} but got ${output}`);
      }
    });
  });
});