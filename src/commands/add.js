// @flow
import Project from '../Project';
import Package from '../Package';
import * as options from '../utils/options';
import * as logger from '../utils/logger';
import addDependenciesToPackage from '../utils/addDependenciesToPackages';
import type { Dependency, configDependencyType } from '../types';
import { DEPENDENCY_TYPE_FLAGS_MAP } from '../constants';

export type AddOptions = {
  cwd?: string,
  deps: Array<Dependency>,
  type: configDependencyType
};

/**
 * Takes a string in one of the following forms:
 *  "pkgName", "pkgName@version", "@scope/pkgName", "@scope/pkgName@version"
 * and returns an object with the package name and version (if passed)
 */
function asDependency(dependencyString: string): Dependency {
  let [name, version] = dependencyString.split('@').filter(part => part !== '');
  if (name.includes('/')) {
    name = '@' + name;
  }
  return version ? { name, version } : { name };
}

export function toAddOptions(
  args: options.Args,
  flags: options.Flags
): AddOptions {
  const depsArgs = [];
  let type = 'dependencies';

  // args is each of our dependencies we are adding which may have "@version" parts to them
  args.forEach(dep => {
    depsArgs.push(options.toDependency(dep));
  });

  Object.keys(DEPENDENCY_TYPE_FLAGS_MAP).forEach(depTypeFlag => {
    if (flags[depTypeFlag]) {
      type = DEPENDENCY_TYPE_FLAGS_MAP[depTypeFlag];
    }
  });

  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: depsArgs,
    type
  };
}

export async function add(opts: AddOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let pkg = await Package.closest(cwd);

  await addDependenciesToPackage(project, pkg, opts.deps, opts.type);
}
