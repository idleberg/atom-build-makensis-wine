'use babel';

import { install } from 'atom-package-deps';
import { execSync } from 'child_process';
import { EventEmitter } from 'events';
import globby from 'globby';
import os from 'os';
import path from 'path';

// Package settings
import meta from '../package.json';
const pathToScript = path.join(__dirname, 'makensis-wine.sh');

this.config = {
  customArguments: {
    title: 'Custom Arguments',
    description: 'Specify your preferred arguments for `makensis`, supports [replacement](https://github.com/noseglid/atom-build#replacement) placeholders',
    type: 'string',
    default: '{FILE_ACTIVE}',
    order: 0
  },
  projectEligibility: {
    title: 'Project Eligibility',
    description: 'Only activate targets when project contains files eligible for this build provider. Note that this can slow down startup time significantly!',
    type: 'boolean',
    default: false,
    order: 1
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (!atom.inSpecMode()) {
    install(meta.name);
  }
}

export function provideBuilder() {
  return class MakensisWineProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe('build-makensis-wine.customArguments', () => this.emit('refresh'));
      atom.config.observe('build-makensis-wine.projectEligibility', () => this.emit('refresh'));
    }

    getNiceName() {
      return 'NSIS (Wine)';
    }

    isEligible() {
      if (os.platform() !== 'win32') {
        // Darwin, FreeBSD, Linux, or SunOS (Solaris) platform
        try {
          execSync('wine --version');
        } catch (error) {
          console.error(meta.name, error);
          return false;
        }

        if (atom.config.get('build-makensis.projectEligibility') === true) {
          return this.isProjectEligible(['nsi', 'nsh']);
        }

        return true;
      }

      // Win32 platform
      return false;
    }

    isProjectEligible(fileTypes) {
      if (typeof fileTypes === 'string') {
        fileTypes = [fileTypes];
      }

      const projectDirs = atom.project.getPaths();
      const globPattern = [];

      for (let i = 0; i < projectDirs.length; i++) {
        fileTypes.forEach(function (fileType) {
          globPattern.push(path.join(projectDirs[i], '**/*.' + fileType));
        });
      }

      const options = {
        'cache': true
      };

      const paths = globby.sync(globPattern, options);

      if (paths.length > 0) {
        return true;
      }

      return false;
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
          atomCommandName: 'MakeNSIS-on-wine:compile-and-stop-at-warning',
          errorMatch: customErrorMatch,
          warningMatch: customWarningMatch
        }
      ];
    }
  };
}
