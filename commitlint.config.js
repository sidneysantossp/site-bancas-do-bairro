module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow any subject case; teams often prefer sentence case
    'subject-case': [0, 'always'],
    // Restrict to our mapped types to alinhar com .versionrc.json
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'chore',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci'
      ]
    ]
  }
};