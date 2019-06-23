'use babel';

import { EventEmitter } from 'events';
import { install } from 'atom-package-deps';
import { join } from 'path';
import { platform } from 'os';
import { spawn } from 'child_process';

// Package settings
import meta from '../package.json';
const pathToScript = join(__dirname, 'makensis-wine.sh');

export const config = {
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
  alwaysEligible: {
    title: 'Always Eligible',
    description: 'The build provider will be available in your project, even when not eligible',
    type: 'boolean',
    default: false,
    order: 2
  }
};

export function satisfyDependencies() {
  install(meta.name);

  const packageDeps = meta['package-deps'];

  packageDeps.forEach( packageDep => {
    if (packageDep) {
      if (atom.packages.isPackageDisabled(packageDep)) {
        if (atom.inDevMode()) console.log(`Enabling package '${packageDep}\'`);
        atom.packages.enablePackage(packageDep);
      }
    }
  });
}

function spawnPromise(cmd, args, opts) {
  return new Promise(function (resolve, reject) {
    Object.assign(opts, {});

    const child = spawn(cmd, args, opts);
    let stdOut;
    let stdErr;

    child.stdout.on('data', function (line) {
      stdOut += line.toString().trim();
    });

    child.stderr.on('data', function (line) {
      stdErr += line.toString().trim();
    });

    child.on('close', function (code) {
      if (code === 0) {
        resolve(stdOut);
      }

      reject(stdErr);
    });
  });
}

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

    async isEligible() {
      if (atom.config.get(`${meta.name}.alwaysEligible`) === true) {
        return true;
      }

      if (platform() === 'win32') {
        return false;
      }

      const which = await spawnPromise('which', ['wine']);

      return (!which.stdout.toString()) ? false : true;
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
      const customArguments = atom.config.get(`${meta.name}.customArguments`).trim().split(' ');

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

export function activate() {
  if (atom.config.get(`${meta.name}.manageDependencies`) === true) {
    satisfyDependencies();
  }
}
