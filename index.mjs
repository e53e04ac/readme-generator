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
            return unwrap(options.mjsFileNames);
        }),
        dtsFileNames: hold(() => {
            return unwrap(options.dtsFileNames);
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
            const match = url.match(/\/\/github\.com\/((?:[^/]+)\/(?:[^/]+))\.git$/);
            if (match == null) {
                throw new Error();
            }
            return match[1];
        }),
        packageLockJson: hold(async () => {
            return await _self.packageLockJsonFile().readJson();
        }),
        npmjsUrl: ((params) => {
            return new URL(`https://www.npmjs.com/package/${params.name}/v/${params.version}`);
        }),
        githubUrl: ((params) => {
            return new URL(`https://github.com/${params.name}/tree/${params.version}`);
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
                    const match = versionRange.match(/^github:(.+)$/);
                    if (match != null) {
                        const packageName = match[1];
                        const url = _self.githubUrl({ name: packageName, version: resolvedUrl.hash.slice(1) });
                        return { index, name, versionRange, dev, packageName, url };
                    }
                }
                {
                    const packageName = name;
                    const url = _self.npmjsUrl({ name: packageName, version: lockPackage.version });
                    return { index, name, versionRange, dev, packageName, url };
                }
            });
        }),
        mjsContent: (async (params) => {
            const lines = await params.file.readLines();
            const imports = lines.flatMap((line) => {
                {
                    const match = line.match(/^import { ([^ ]+)(?: as (?:[^ ]+))? } from '([^']+)';$/);
                    if (match != null) {
                        return [{ packageName: match[2], name: match[1] }];
                    }
                }
                {
                    const match = line.match(/^import '([^']+)';$/);
                    if (match != null) {
                        return [{ packageName: match[1] }];
                    }
                }
                return [];
            });
            const exports = lines.flatMap((line) => {
                {
                    const match = line.match(/^export { ([^ ]+)(?: as ([^ ]+))? };$/);
                    if (match != null) {
                        return [{ name: match[2] ?? match[1] }];
                    }
                }
                return [];
            });
            return { ...params, imports, exports };
        }),
        mjsContents: hold(async () => {
            return await Promise.all(_options.mjsFileNames().map((fileName) => {
                return _self.mjsContent({
                    file: _options.repositoryDirectory().resolve(fileName),
                });
            }));
        }),
        dtsContent: (async (params) => {
            const lines = await params.file.readLines();
            const imports = lines.flatMap((line) => {
                {
                    const match = line.match(/^import { ([^ ]+)(?: as (?:[^ ]+))? } from '([^']+)';$/);
                    if (match != null) {
                        return [{ packageName: match[2], name: match[1] }];
                    }
                }
                {
                    const match = line.match(/^import '([^']+)';$/);
                    if (match != null) {
                        return [{ packageName: match[1] }];
                    }
                }
                return [];
            });
            const exports = lines.flatMap((line) => {
                {
                    const match = line.match(/^export declare namespace ([^:]+) {/);
                    if (match != null) {
                        return [{ name: match[1], exportType: 'namespace' }];
                    }
                }
                {
                    const match = line.match(/^export declare type ([^ ]+) =/);
                    if (match != null) {
                        return [{ name: match[1], exportType: 'type' }];
                    }
                }
                {
                    const match = line.match(/^export declare const ([^:]+):/);
                    if (match != null) {
                        return [{ name: match[1], exportType: 'const' }];
                    }
                }
                return [];
            });
            return { ...params, imports, exports };
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
            const dtsContents = await _self.dtsContents();
            const packageRepositoryName = await _self.packageRepositoryName();
            for (const { exports } of dtsContents) {
                const exportConsts = exports.filter(({ exportType }) => {
                    return exportType == 'const';
                });
                if (exportConsts.length == 0) {
                    continue;
                }
                yield '';
                yield '~~~~~ mjs';
                for (const { name } of exportConsts) {
                    yield `import { ${name} } from '${packageRepositoryName}';`;
                }
                yield '~~~~~';
            }
        }),
        readmeMdPackageJsonGraphLines: (async function* () {
            const dependencies = await _self.dependencies();
            yield '';
            yield '~~~~~ mermaid';
            yield 'graph RL;';
            yield '  A(["package.json"]);';
            {
                const items = dependencies.filter(({ dev }) => dev === false);
                if (items.length > 0) {
                    yield '  subgraph "dependencies";';
                    for (const { index, packageName } of items) {
                        yield `    B_${index}(["${packageName}"]);`;
                    }
                    yield '  end;';
                }
            }
            {
                const items = dependencies.filter(({ dev }) => dev === true);
                if (items.length > 0) {
                    yield '  subgraph "devDependencies";';
                    for (const { index, packageName } of items) {
                        yield `    B_${index}(["${packageName}"]);`;
                    }
                    yield '  end;';
                }
            }
            for (const { index } of dependencies) {
                yield `  A ----> B_${index};`;
            }
            for (const { index, url: { href } } of dependencies) {
                yield `  click B_${index} "${href}";`;
            }
            yield '~~~~~';
        }),
        readmeMdMjsGraphsLines: (async function* () {
            const packageRepositoryName = await _self.packageRepositoryName();
            const mjsContents = await _self.mjsContents();
            for (const { file, imports, exports } of mjsContents) {
                /** @type {Map<string, Map<string, {}>>} */
                const map0 = new Map();
                for (const item of imports) {
                    let map1 = map0.get(item.packageName);
                    if (map1 == null) {
                        map1 = new Map();
                        map0.set(item.packageName, map1);
                    }
                    map1.set(item.name ?? ' ', {});
                }
                yield '';
                yield '~~~~~ mermaid';
                yield 'graph RL;';
                if (exports.length > 0) {
                    yield `  subgraph "${packageRepositoryName}";`;
                    for (const { i, name } of exports.map((value, i) => ({ i, ...value }))) {
                        yield `    E_${i}(["${name}"]);`;
                    }
                    yield '  end;';
                }
                yield `  M(["${file.base()}"])`;
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
                for (const { i } of exports.map((_, i) => ({ i }))) {
                    yield `  E_${i} ----> M;`;
                }
                yield '~~~~~';
            }
        }),
        readmeMdDtsGraphsLines: (async function* () {
            const packageRepositoryName = await _self.packageRepositoryName();
            const dtsContents = await _self.dtsContents();
            for (const { file, imports, exports } of dtsContents) {
                /** @type {Map<string, Map<string, {}>>} */
                const map0 = new Map();
                for (const item of imports) {
                    let map1 = map0.get(item.packageName);
                    if (map1 == null) {
                        map1 = new Map();
                        map0.set(item.packageName, map1);
                    }
                    map1.set(item.name ?? ' ', {});
                }
                yield '';
                yield '~~~~~ mermaid';
                yield 'graph RL;';
                if (exports.length > 0) {
                    yield `  subgraph "${packageRepositoryName}";`;
                    for (const { i, name, exportType } of exports.map((value, i) => ({ i, ...value }))) {
                        yield `    E_${i}(["${exportType} ${name}"]);`;
                    }
                    yield '  end;';
                }
                yield `  M(["${file.base()}"])`;
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
                for (const { i } of exports.map((_, i) => ({ i }))) {
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
