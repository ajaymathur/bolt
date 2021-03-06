// @flow
import Package from '../Package';
import Config from '../Config';
import * as fs from '../utils/fs';
import { mkdtempSync } from 'fs';
import * as path from 'path';
import { getFixturePath } from 'jest-fixtures';

jest.mock('../utils/logger');

describe('Package', () => {
  describe('init()', () => {
    it('should return a valid Package', async () => {
      let filePath = await getFixturePath(
        __dirname,
        'simple-package',
        'package.json'
      );
      let pkg = await Package.init(filePath);

      expect(pkg).toBeInstanceOf(Package);
      expect(pkg.filePath).toBe(filePath);
      expect(pkg.config).toBeInstanceOf(Config);
    });

    it('should error on an invalid package.json file', async () => {
      let filePath = await getFixturePath(
        __dirname,
        'package-with-invalid-json',
        'package.json'
      );
      return expect(Package.init(filePath)).rejects.toBeDefined();
    });
  });

  describe('getDependencyTypes', () => {
    it('should return dependency type of a dependency', async () => {
      let filePath = await getFixturePath(
        __dirname,
        'nested-workspaces',
        'package.json'
      );
      let pkg = await Package.init(filePath);
      const depTypes = pkg.getDependencyTypes('react');
      expect(depTypes).toEqual(['dependencies']);
    });

    it('should return multiple dependency types if they exist', async () => {
      let filePath = await getFixturePath(
        __dirname,
        'simple-project-with-multiple-depTypes',
        'package.json'
      );
      let pkg = await Package.init(filePath);
      const depTypes = pkg.getDependencyTypes('react');
      expect(depTypes).toEqual(['devDependencies', 'peerDependencies']);
    });

    it('should return an empty array if dep does not exist', async () => {
      let filePath = await getFixturePath(
        __dirname,
        'simple-package',
        'package.json'
      );
      let pkg = await Package.init(filePath);
      let depTypes = pkg.getDependencyTypes('non-existent-dep');
      expect(depTypes).toEqual([]);
    });
  });
});
