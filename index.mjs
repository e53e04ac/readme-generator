/*!
    @e53e04ac/readme-generator/index.mjs
    Copyright (C) @e53e04ac
    MIT License
*/

import { Readable as StreamReadable } from 'node:stream';
import { pipeline as streamPipeline } from 'node:stream/promises';

import { EventEmitter } from 'event-emitter';
import { hold } from 'hold';
import { unwrap } from 'hold';

/** @type {import('.').ReadmeGenerator.Constructor} */
const constructor = ((options) => {

    const _options = ({
        repositoryDirectory: hold(() => {
            return unwrap(options.repositoryDirectory);
        }),
        readmeMdName: hold(() => {
            return unwrap(options.readmeMdName) ?? 'README.md';
        }),
        packageJsonName: hold(() => {
            return unwrap(options.packageJsonName) ?? 'package.json';
        }),
        packageLockJsonName: hold(() => {
            return unwrap(options.packageLockJsonName) ?? 'package-lock.json';
        }),
        mjsFileNames: hold(() => {
            return unwrap(options.mjsFileNames) ?? ['index.mjs'];
        }),
        dtsFileNames: hold(() => {
            return unwrap(options.dtsFileNames) ?? ['index.d.ts'];
        }),
    });

    /** @type {import('.').ReadmeGenerator._Self} */
    const _self = ({
        options: (() => {
            return options;
        }),
        _options: (() => {
            return _options;
        }),
        readmeMdFile: hold(() => {
            return _options.repositoryDirectory().resolve(_options.readmeMdName());
        }),
        packageJsonFile: hold(() => {
            return _options.repositoryDirectory().resolve(_options.packageJsonName());
        }),
        packageLockJsonFile: hold(() => {
            return _options.repositoryDirectory().resolve(_options.packageLockJsonName());
        }),
        packageJson: hold(async () => {
            return await _self.packageJsonFile().readJson();
        }),
        packageName: hold(async () => {
            const { name } = await _self.packageJson();
            return name;
        }),
        packageRepositoryName: hold(async () => {
            const { repository: { url } } = await _self.packageJson();
            const matchArray = url.match(/\/\/github\.com\/((?:[^/]+)\/(?:[^/]+))\.git$/);
            if (matchArray == null) {
                throw new Error();
            }
            return matchArray[1];
        }),
        packageLockJson: hold(async () => {
            return await _self.packageLockJsonFile().readJson();
        }),
        npmjsUrl: ((params) => {
            const { name, version } = params;
            return new URL(`https://www.npmjs.com/package/${name}/v/${version}`);
        }),
        githubUrl: ((params) => {
            const { name, version } = params;
            return new URL(`https://github.com/${name}/tree/${version}`);
        }),
        dependencies: hold(async () => {
            const packageJson = await _self.packageJson();
            const packageLockJson = await _self.packageLockJson();
            return [
                ...Object.entries(packageJson.dependencies).map(([name, versionRange]) => {
                    return { name, versionRange, dev: false };
                }),
                ...Object.entries(packageJson.devDependencies).map(([name, versionRange]) => {
                    return { name, versionRange, dev: true };
                }),
            ].map(({ name, versionRange, dev }, index) => {
                const lockPackage = packageLockJson.packages[`node_modules/${name}`];
                const resolvedUrl = new URL(lockPackage.resolved);
                {
                    const matchArray = versionRange.match(/^github:(.+)$/);
                    if (matchArray != null) {
                        const packageName = matchArray[1];
                        const lockVersion = resolvedUrl.hash.slice(1);
                        const url = _self.githubUrl({ name: packageName, version: lockVersion });
                        return { index, name, versionRange, dev, repositoryType: 'github', packageName, lockVersion, url };
                    }
                }
                {
                    const packageName = name;
                    const lockVersion = lockPackage.version;
                    const url = _self.npmjsUrl({ name: packageName, version: lockVersion });
                    return { index, name, versionRange, dev, repositoryType: 'npmjs', packageName, lockVersion, url };
                }
            });
        }),
        mjsContent: (async (params) => {
            const { main: mainPath } = await _self.packageJson();
            const { file: sourceFile } = params;
            const sourcePath = _options.repositoryDirectory().relative(sourceFile);
            const isMain = (sourcePath === mainPath);
            const lines = await sourceFile.readLines();
            const imports = lines.flatMap((line) => {
                {
                    const matchArray = line.match(/^import { ([^ ]+) as ([^ ]+) } from '([^']+)';$/);
                    if (matchArray != null) {
                        return [{ packageName: matchArray[3], name: matchArray[1] }];
                    }
                }
                {
                    const matchArray = line.match(/^import { ([^ ]+) } from '([^']+)';$/);
                    if (matchArray != null) {
                        return [{ packageName: matchArray[2], name: matchArray[1] }];
                    }
                }
                {
                    const matchArray = line.match(/^import '([^']+)';$/);
                    if (matchArray != null) {
                        return [{ packageName: matchArray[1] }];
                    }
                }
                return [];
            }).map(({ packageName, ...rest }) => {
                const fromLocal = (packageName.startsWith('./') || packageName.startsWith('../'));
                const file = (fromLocal === false ? null : sourceFile.resolve(packageName));
                const path = (file == null ? null : _options.repositoryDirectory().relative(file));
                return { packageName, ...rest, file, path };
            });
            const exports = lines.flatMap((line) => {
                {
                    const matchArray = line.match(/^export { ([^ ]+) as ([^ ]+) };$/);
                    if (matchArray != null) {
                        return [{ name: matchArray[2] }];
                    }
                }
                {
                    const matchArray = line.match(/^export { ([^ ]+) };$/);
                    if (matchArray != null) {
                        return [{ name: matchArray[1] }];
                    }
                }
                return [];
            });
            return { ...params, path: sourcePath, isMain, imports, exports };
        }),
        mjsContents: hold(async () => {
            return await Promise.all(_options.mjsFileNames().map((fileName) => {
                return _self.mjsContent({
                    file: _options.repositoryDirectory().resolve(fileName),
                });
            }));
        }),
        dtsContent: (async (params) => {
            const { types: mainPath } = await _self.packageJson();
            const { file: sourceFile } = params;
            const sourcePath = _options.repositoryDirectory().relative(sourceFile);
            const isMain = (sourcePath === mainPath);
            const lines = await sourceFile.readLines();
            const imports = lines.flatMap((line) => {
                {
                    const matchArray = line.match(/^import { ([^ ]+) as ([^ ]+) } from '([^']+)';$/);
                    if (matchArray != null) {
                        return [{ packageName: matchArray[3], name: matchArray[1] }];
                    }
                }
                {
                    const matchArray = line.match(/^import { ([^ ]+) } from '([^']+)';$/);
                    if (matchArray != null) {
                        return [{ packageName: matchArray[2], name: matchArray[1] }];
                    }
                }
                {
                    const matchArray = line.match(/^import '([^']+)';$/);
                    if (matchArray != null) {
                        return [{ packageName: matchArray[1] }];
                    }
                }
                return [];
            }).map(({ packageName, ...rest }) => {
                const fromLocal = (packageName.startsWith('./') || packageName.startsWith('../'));
                const file = (fromLocal === false ? null : sourceFile.resolve(packageName));
                const path = (file == null ? null : _options.repositoryDirectory().relative(file));
                return { packageName, ...rest, file, path };
            });
            const exports = lines.flatMap((line) => {
                {
                    const matchArray = line.match(/^export declare namespace ([^:]+) {/);
                    if (matchArray != null) {
                        return [{ exportType: 'namespace', name: matchArray[1] }];
                    }
                }
                {
                    const matchArray = line.match(/^export declare type ([^ ]+) =/);
                    if (matchArray != null) {
                        return [{ exportType: 'type', name: matchArray[1] }];
                    }
                }
                {
                    const matchArray = line.match(/^export declare const ([^:]+):/);
                    if (matchArray != null) {
                        return [{ exportType: 'const', name: matchArray[1] }];
                    }
                }
                return [];
            });
            return { ...params, path: sourcePath, isMain, imports, exports };
        }),
        dtsContents: hold(async () => {
            return await Promise.all(_options.dtsFileNames().map((fileName) => {
                return _self.dtsContent({
                    file: _options.repositoryDirectory().resolve(fileName),
                });
            }));
        }),
        readmeMdHeaderLines: (async function* () {
            const packageName = await _self.packageName();
            yield `# ${packageName}`;
        }),
        readmeMdNpmInstallLines: (async function* () {
            const packageRepositoryName = await _self.packageRepositoryName();
            yield '';
            yield '~~~~~ sh';
            yield `npm install ${packageRepositoryName}`;
            yield '~~~~~';
        }),
        readmeMdImportLines: (async function* () {
            const packageRepositoryName = await _self.packageRepositoryName();
            const dtsContents = await _self.dtsContents();
            const indexDtsContent = dtsContents.find((dtsContent) => {
                return dtsContent.isMain;
            });
            if (indexDtsContent != null) {
                const exportConsts = indexDtsContent.exports.filter(({ exportType }) => {
                    return exportType == 'const';
                });
                if (exportConsts.length > 0) {
                    yield '';
                    yield '~~~~~ mjs';
                    for (const { name } of exportConsts) {
                        yield `import { ${name} } from '${packageRepositoryName}';`;
                    }
                    yield '~~~~~';
                }
            }
        }),
        readmeMdPackageJsonGraphLines: (async function* () {
            const dependencies = await _self.dependencies();
            const deps = dependencies.filter(({ dev }) => {
                return dev === false;
            });
            const devDeps = dependencies.filter(({ dev }) => {
                return dev === true;
            });
            const githubDeps = dependencies.filter(({ repositoryType }) => {
                return repositoryType === 'github';
            });
            const npmjsDeps = dependencies.filter(({ repositoryType }) => {
                return repositoryType === 'npmjs';
            });
            yield '';
            yield '~~~~~ mermaid';
            yield 'graph RL;';
            yield `  A["${_options.packageJsonName()}\\n${_options.packageLockJsonName()}"];`;
            yield* (function* () {
                if (deps.length == 0) {
                    return;
                }
                yield '  subgraph "dependencies";';
                for (const { index, name } of deps) {
                    yield `    B_${index}(["${name}"]);`;
                }
                yield '  end;';
            })();
            yield* (function* () {
                if (devDeps.length == 0) {
                    return;
                }
                yield '  subgraph "devDependencies";';
                for (const { index, name } of devDeps) {
                    yield `    B_${index}(["${name}"]);`;
                }
                yield '  end;';
            })();
            yield* (function* () {
                if (githubDeps.length == 0) {
                    return;
                }
                yield '  subgraph "github";';
                for (const { index, packageName, lockVersion } of githubDeps) {
                    yield `    C_${index}(["${packageName}\\n${lockVersion}"]);`;
                }
                yield '  end;';
            })();
            yield* (function* () {
                if (npmjsDeps.length == 0) {
                    return;
                }
                yield '  subgraph "npmjs";';
                for (const { index, packageName, lockVersion } of npmjsDeps) {
                    yield `    C_${index}(["${packageName}\\n${lockVersion}"]);`;
                }
                yield '  end;';
            })();
            for (const { index } of dependencies) {
                yield `  A ----> B_${index};`;
            }
            for (const { index } of dependencies) {
                yield `  B_${index} ----> C_${index};`;
            }
            for (const { index, url: { href } } of dependencies) {
                yield `  click C_${index} "${href}";`;
            }
            yield '~~~~~';
        }),
        readmeMdMjsGraphsLines: (async function* () {
            const packageRepositoryName = await _self.packageRepositoryName();
            const mjsContents = await _self.mjsContents();
            for (const mjsContent of mjsContents) {
                /** @type {Map<string, Map<string, {}>>} */
                const map0 = new Map();
                for (const item of mjsContent.imports) {
                    const packageName = (item.path ?? item.packageName);
                    let map1 = map0.get(packageName);
                    if (map1 == null) {
                        map1 = new Map();
                        map0.set(packageName, map1);
                    }
                    map1.set(item.name ?? ' ', {});
                }
                yield '';
                yield '~~~~~ mermaid';
                yield 'graph RL;';
                if (mjsContent.exports.length > 0) {
                    const name = (mjsContent.isMain ? packageRepositoryName : ' ');
                    yield `  subgraph "${name}";`;
                    for (const { i, name } of mjsContent.exports.map((value, i) => ({ i, ...value }))) {
                        yield `    E_${i}(["${name}"]);`;
                    }
                    yield '  end;';
                }
                yield `  M["${mjsContent.path}"]`;
                for (const { i, packageName, map1 } of [...map0].map(([packageName, map1], i) => ({ i, packageName, map1 }))) {
                    yield `  subgraph "${packageName}";`;
                    for (const { j, name } of [...map1].map(([name], j) => ({ j, name }))) {
                        yield `    I_${i}_${j}(["${name}"]);`;
                    }
                    yield '  end;';
                }
                for (const { i, map1 } of [...map0].map(([_, map1], i) => ({ i, map1 }))) {
                    for (const { j } of [...map1].map((_, j) => ({ j }))) {
                        yield `  M ----> I_${i}_${j};`;
                    }
                }
                for (const { i } of mjsContent.exports.map((_, i) => ({ i }))) {
                    yield `  E_${i} ----> M;`;
                }
                yield '~~~~~';
            }
        }),
        readmeMdDtsGraphsLines: (async function* () {
            const packageRepositoryName = await _self.packageRepositoryName();
            const dtsContents = await _self.dtsContents();
            for (const dtsContent of dtsContents) {
                /** @type {Map<string, Map<string, {}>>} */
                const map0 = new Map();
                for (const item of dtsContent.imports) {
                    const packageName = (item.path ?? item.packageName);
                    let map1 = map0.get(packageName);
                    if (map1 == null) {
                        map1 = new Map();
                        map0.set(packageName, map1);
                    }
                    map1.set(item.name ?? ' ', {});
                }
                yield '';
                yield '~~~~~ mermaid';
                yield 'graph RL;';
                if (dtsContent.exports.length > 0) {
                    const name = (dtsContent.isMain ? packageRepositoryName : ' ');
                    yield `  subgraph "${name}";`;
                    for (const { i, name, exportType } of dtsContent.exports.map((value, i) => ({ i, ...value }))) {
                        yield `    E_${i}(["${exportType} ${name}"]);`;
                    }
                    yield '  end;';
                }
                yield `  M["${dtsContent.path}"]`;
                for (const { i, packageName, map1 } of [...map0].map(([packageName, map1], i) => ({ i, packageName, map1 }))) {
                    yield `  subgraph "${packageName}";`;
                    for (const { j, name } of [...map1].map(([name], j) => ({ j, name }))) {
                        yield `    I_${i}_${j}(["${name}"]);`;
                    }
                    yield '  end;';
                }
                for (const { i, map1 } of [...map0].map(([_, map1], i) => ({ i, map1 }))) {
                    for (const { j } of [...map1].map((_, j) => ({ j }))) {
                        yield `  M ----> I_${i}_${j};`;
                    }
                }
                for (const { i } of dtsContent.exports.map((_, i) => ({ i }))) {
                    yield `  E_${i} ----> M;`;
                }
                yield '~~~~~';
            }
        }),
        readmeMdLines: (async function* () {
            yield* _self.readmeMdHeaderLines();
            yield* _self.readmeMdNpmInstallLines();
            yield* _self.readmeMdImportLines();
            yield* _self.readmeMdPackageJsonGraphLines();
            yield* _self.readmeMdMjsGraphsLines();
            yield* _self.readmeMdDtsGraphsLines();
        }),
        readmeMdLineStream: (() => {
            return StreamReadable.from(_self.readmeMdLines(), {
                objectMode: true,
            });
        }),
    });

    /** @type {import('.').ReadmeGenerator.Self} */
    const self = ({
        ...EventEmitter({}),
        _ReadmeGenerator: (() => {
            return _self;
        }),
        generate: hold(async () => {
            await streamPipeline([
                _self.readmeMdLineStream(),
                await _self.readmeMdFile().createWriteLineStream(),
            ]);
        }),
    });

    return self;

});

/** @type {import('.').ReadmeGenerator.Companion} */
const companion = ({});

/** @type {import('.').ReadmeGenerator.ConstructorWithCompanion} */
const constructorWithCompanion = Object.assign(constructor, companion);

export { constructorWithCompanion as ReadmeGenerator };
