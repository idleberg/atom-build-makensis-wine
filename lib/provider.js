'use babel';

import { EventEmitter } from 'events';
import { platform } from 'os';
import { spawnSync } from 'child_process';
import { join } from 'path';

// Package settings
import meta from '../package.json';
const pathToScript = join(__dirname, 'makensis-wine.sh');

this.config = {
  customArguments: {
    title: 'Custom Arguments',
    description: 'Specify your preferred arguments for `makensis`, supports [replacement](https://github.com/noseglid/atom-build#replacement) placeholders',
    type: 'string',
    default: '{FILE_ACTIVE}',
    order: 0
  },
  manageDependencies: {
    title: 'Manage Dependencies',
    description: 'When enabled, third-party dependencies will be installed automatically',
    type: 'boolean',
    default: true,
    order: 1
  },
  ignoreEligibility: {
    title: 'Ignore Eligibility',
    description: 'When enabled, eligibility tests will always return `true`',
    type: 'boolean',
    default: false,
    order: 2
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get('build-makensis-wine.manageDependencies') && !atom.inSpecMode()) {
    this.satisfyDependencies();
  }
}

export function satisfyDependencies() {
  let k;
  let v;

  require('atom-package-deps').install(meta.name);

  const ref = meta['package-deps'];
  const results = [];

  for (k in ref) {
    if (typeof ref !== 'undefined' && ref !== null) {
      v = ref[k];
      if (atom.packages.isPackageDisabled(v)) {
        if (atom.inDevMode()) {
          console.log('Enabling package \'' + v + '\'');
        }
        results.push(atom.packages.enablePackage(v));
      } else {
        results.push(void 0);
      }
    }
  }
  return results;
}

export function provideBuilder() {
  return class MakensisWineProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe('build-makensis-wine.customArguments', () => this.emit('refresh'));
    }

    getNiceName() {
      return 'NSIS (Wine)';
    }

    isEligible() {
      if (atom.config.get(meta.name + '.ignoreEligibility') === true) {
        return true;
      }

      if (platform() === 'win32') {
        return false;
      }

      const which = spawnSync('which', ['wine']);
      if (!which.stdout.toString()) {
        return false;
      }

      return true;
    }

    settings() {
      let customErrorMatch;
      let customWarningMatch;

      const errorMatch = [
        '(\\r?\\n)(?<message>.+)(\\r?\\n)Error in script "(?<file>[^"]+)" on line (?<line>\\d+) -- aborting creation process'
      ];
      const warningMatch = [
        '[^!]warning: (?<message>.*) \\((?<file>(\\w{1}:)?[^:]+):(?<line>\\d+)\\)'
      ];
      const comboMatch = errorMatch.concat(warningMatch);

      // User settings
      const customArguments = atom.config.get('build-makensis-wine.customArguments').trim().split(' ');

      // Adjust errorMatch and warningMatch
      if (customArguments.indexOf('-WX') !== -1) {
        customErrorMatch = comboMatch;
        customWarningMatch = null;
      } else {
        customErrorMatch = errorMatch;
        customWarningMatch = warningMatch;
      }

      return [
        {
          name: 'makensis on Wine',
          exec: pathToScript,
          args: [ '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          keymap: 'cmd-alt-b',
          atomCommandName: 'MakeNSIS-on-wine:compile',
          errorMatch: errorMatch,
          warningMatch: warningMatch
        },
        {
          name: 'makensis on Wine (strict)',
          exec: pathToScript,
          args: [ '-WX', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          keymap: 'ctrl-alt-cmd-b',
          atomCommandName: 'MakeNSIS-on-wine:compile-and-stop-at-warning',
          errorMatch: comboMatch
        },
        {
          name: 'makensis on Wine (user)',
          exec: pathToScript,
          args: customArguments,
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          keymap: 'alt-cmd-u',
          atomCommandName: 'MakeNSIS-on-wine:compile-with-user-settings',
          errorMatch: customErrorMatch,
          warningMatch: customWarningMatch
        }
      ];
    }
  };
}
