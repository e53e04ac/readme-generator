/*!
    @e53e04ac/readme-generator/index.d.ts
    Copyright (C) @e53e04ac
    MIT License
*/

import { EventEmitter } from 'event-emitter';
import { FileEntry } from 'file-entry';
import { Get } from 'hold';
import { ValueOrGet } from 'hold';

export declare namespace ReadmeGenerator {

    type EventSpecs = Record<never, never>;

    type PackageJson = {
        readonly name: string;
        readonly version: string;
        readonly description: string;
        readonly keywords: string[];
        readonly license: string;
        readonly author: string;
        readonly homepage: string;
        readonly repository: {
            readonly type: string;
            readonly url: string;
        };
        readonly bugs: {
            readonly url: string;
        };
        readonly type: string;
        readonly types: string;
        readonly main: string;
        readonly scripts: Record<string, string>;
        readonly engines: Record<string, string>;
        readonly dependencies: Record<string, string>;
        readonly devDependencies: Record<string, string>;
    };

    type PackageLockJson = {
        readonly name: string;
        readonly version: string;
        readonly lockfileVersion: string;
        readonly requires: boolean;
        readonly packages: Record<string, {
            readonly version: string;
            readonly resolved: string;
            readonly integrity: string;
            readonly dev?: boolean;
            readonly dependencies?: Record<string, string>;
            readonly devDependencies?: Record<string, string>;
        }>;
    };

    type Dependency = {
        readonly index: number;
        readonly name: string;
        readonly versionRange: string;
        readonly dev: boolean;
        readonly packageName: string;
        readonly url: URL;
    };

    type MjsContent = {
        readonly file: FileEntry;
        readonly imports: {
            readonly packageName: string;
            readonly name: string;
        }[];
        readonly exports: {
            readonly name: string;
        }[];
    };

    type DtsContent = {
        readonly file: FileEntry;
        readonly imports: {
            readonly packageName: string;
            readonly name: string;
        }[];
        readonly exports: {
            readonly exportType: string;
            readonly name: string;
        }[];
    };

    type Options = {
        readonly repositoryDirectory: ValueOrGet<FileEntry>;
        readonly readmeMdName?: ValueOrGet<string>;
        readonly packageJsonName?: ValueOrGet<string>;
        readonly packageLockJsonName?: ValueOrGet<string>;
        readonly mjsFileNames: ValueOrGet<string[]>;
        readonly dtsFileNames: ValueOrGet<string[]>;
    };

    type _Self = {
        readonly options: Get<Options>;
        readonly _options: Get<unknown>;
        readonly readmeMdFile: Get<FileEntry>;
        readonly packageJsonFile: Get<FileEntry>;
        readonly packageLockJsonFile: Get<FileEntry>;
        readonly packageJson: Get<Promise<PackageJson>>;
        readonly packageName: Get<Promise<string>>;
        readonly packageRepositoryName: Get<Promise<string>>;
        readonly packageLockJson: Get<Promise<PackageLockJson>>;
        readonly npmjsUrl: {
            (params: {
                readonly name: string;
                readonly version: string;
            }): URL;
        };
        readonly githubUrl: {
            (params: {
                readonly name: string;
                readonly version: string;
            }): URL;
        };
        readonly dependencies: Get<Promise<Dependency[]>>;
        readonly mjsContent: {
            (params: {
                readonly file: FileEntry;
            }): Promise<MjsContent>;
        };
        readonly mjsContents: Get<Promise<MjsContent[]>>;
        readonly dtsContent: {
            (params: {
                readonly file: FileEntry;
            }): Promise<DtsContent>;
        };
        readonly dtsContents: Get<Promise<DtsContent[]>>;
        readonly readmeMdHeaderLines: Get<AsyncGenerator<string, void, void>>;
        readonly readmeMdNpmInstallLines: Get<AsyncGenerator<string, void, void>>;
        readonly readmeMdImportLines: Get<AsyncGenerator<string, void, void>>;
        readonly readmeMdPackageJsonGraphLines: Get<AsyncGenerator<string, void, void>>;
        readonly readmeMdMjsGraphsLines: Get<AsyncGenerator<string, void, void>>;
        readonly readmeMdDtsGraphsLines: Get<AsyncGenerator<string, void, void>>;
        readonly readmeMdLines: Get<AsyncGenerator<string, void, void>>;
    };

    type Self = EventEmitter<EventSpecs> & {
        readonly _ReadmeGenerator: Get<_Self>;
        readonly generate: {
            (): Promise<void>;
        };
    };

    type Constructor = {
        (options: Options): Self;
    };

    type Companion = Record<never, never>;

    type ConstructorWithCompanion = Constructor & Companion;

}

export declare type ReadmeGenerator = ReadmeGenerator.Self;

export declare const ReadmeGenerator: ReadmeGenerator.ConstructorWithCompanion;
