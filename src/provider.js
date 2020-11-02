'use babel';

import meta from '../package.json';
import { configSchema, getConfig } from './config';
import { EventEmitter } from 'events';
import { join } from 'path';
import { platform } from 'os';
import { satisfyDependencies } from 'atom-satisfy-dependencies';
import { spawnSync } from 'child_process';

const pathToScript = join(__dirname, 'makensis-wine.sh');

export { configSchema as config };

export function provideBuilder() {
  return class MakensisWineProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe(`${meta.name}.customArguments`, () => this.emit('refresh'));
    }

    getNiceName() {
      return 'NSIS (Wine)';
    }

    isEligible() {
      if (getConfig('alwaysEligible') === true) {
        return true;
      }

      if (platform() === 'win32') {
        return false;
      }

      const whichCmd = spawnSync('which', ['wine']);

      return (whichCmd.stdout && whichCmd.stdout.toString().length) ? true : false;
    }

    settings() {
      const errorMatch = [
        '(\\r?\\n)(?<message>.+)(\\r?\\n)Error in script "(?<file>[^"]+)" on line (?<line>\\d+) -- aborting creation process'
      ];
      const warningMatch = [
        '[^!]warning: (?<message>.*) \\((?<file>(\\w{1}:)?[^:]+):(?<line>\\d+)\\)'
      ];
      const comboMatch = errorMatch.concat(warningMatch);

      // User settings
      const customArguments = getConfig('customArguments') || '';

      // Adjust errorMatch and warningMatch
      const customErrorMatch = (customArguments.includes('-WX')) ? comboMatch : errorMatch;
      const customWarningMatch = (customArguments.includes('-WX')) ? null : warningMatch;

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

export async function activate() {
  if (getConfig('manageDependencies') === true) {
    satisfyDependencies('build-makensis-wine');
  }
}
