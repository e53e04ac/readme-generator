# readme-generator

~~~~~ sh
npm install e53e04ac/readme-generator
~~~~~

~~~~~ mjs
import { ReadmeGenerator } from 'e53e04ac/readme-generator';
~~~~~

~~~~~ mermaid
graph RL;
  A["package.json\npackage-lock.json"];
  subgraph "dependencies";
    B_0(["event-emitter"]);
    B_1(["file-entry-native"]);
    B_2(["hold"]);
  end;
  subgraph "devDependencies";
    B_3(["@types/node"]);
    B_4(["file-entry"]);
  end;
  subgraph "github";
    C_0(["e53e04ac/event-emitter\naea7d828d486572514f193752191206e0cbeeaa5"]);
    C_1(["e53e04ac/file-entry-native\n28461cf367f875f2a2f6250f4adb4db316354162"]);
    C_2(["e53e04ac/hold\n593585d63bb24dc044f13a88375b53f9fa565229"]);
    C_4(["e53e04ac/file-entry\n3b584f55af253b70ed8fddf4d804848782ef8705"]);
  end;
  subgraph "npmjs";
    C_3(["@types/node\n18.14.1"]);
  end;
  A ----> B_0;
  A ----> B_1;
  A ----> B_2;
  A ----> B_3;
  A ----> B_4;
  B_0 ----> C_0;
  B_1 ----> C_1;
  B_2 ----> C_2;
  B_3 ----> C_3;
  B_4 ----> C_4;
  click C_0 "https://github.com/e53e04ac/event-emitter/tree/aea7d828d486572514f193752191206e0cbeeaa5";
  click C_1 "https://github.com/e53e04ac/file-entry-native/tree/28461cf367f875f2a2f6250f4adb4db316354162";
  click C_2 "https://github.com/e53e04ac/hold/tree/593585d63bb24dc044f13a88375b53f9fa565229";
  click C_3 "https://www.npmjs.com/package/@types/node/v/18.14.1";
  click C_4 "https://github.com/e53e04ac/file-entry/tree/3b584f55af253b70ed8fddf4d804848782ef8705";
~~~~~

~~~~~ mermaid
graph RL;
  subgraph "e53e04ac/readme-generator";
    E_0(["namespace ReadmeGenerator"]);
    E_1(["type ReadmeGenerator"]);
    E_2(["const ReadmeGenerator"]);
  end;
  M["index.d.ts"]
  subgraph "node:stream";
    I_0_0(["Readable"]);
  end;
  subgraph "event-emitter";
    I_1_0(["EventEmitter"]);
  end;
  subgraph "file-entry";
    I_2_0(["FileEntry"]);
  end;
  subgraph "hold";
    I_3_0(["Get"]);
    I_3_1(["ValueOrGet"]);
  end;
  M ----> I_0_0;
  M ----> I_1_0;
  M ----> I_2_0;
  M ----> I_3_0;
  M ----> I_3_1;
  E_0 ----> M;
  E_1 ----> M;
  E_2 ----> M;
~~~~~

~~~~~ mermaid
graph RL;
  subgraph "e53e04ac/readme-generator";
    E_0(["ReadmeGenerator"]);
  end;
  M["index.mjs"]
  subgraph "node:stream";
    I_0_0(["Readable"]);
  end;
  subgraph "node:stream/promises";
    I_1_0(["pipeline"]);
  end;
  subgraph "event-emitter";
    I_2_0(["EventEmitter"]);
  end;
  subgraph "hold";
    I_3_0(["hold"]);
    I_3_1(["unwrap"]);
  end;
  M ----> I_0_0;
  M ----> I_1_0;
  M ----> I_2_0;
  M ----> I_3_0;
  M ----> I_3_1;
  E_0 ----> M;
~~~~~
