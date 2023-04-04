# readme-generator

~~~~~ sh
npm install e53e04ac/readme-generator
~~~~~

~~~~~ mjs
import { ReadmeGenerator } from 'readme-generator';
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
    C_0(["e53e04ac/event-emitter\nb07aafda2d8ddb14a40a0fe63ea41de2b8b58ca3"]);
    C_1(["e53e04ac/file-entry-native\nd75a642bb73e256d7304076bb54771d9a807ff33"]);
    C_2(["e53e04ac/hold\n6ce132702778d99c7f80a785e982419974dca8e5"]);
    C_4(["e53e04ac/file-entry\n43d558c1cb0725770c2f06b00bd2d174c543a145"]);
  end;
  subgraph "npmjs";
    C_3(["@types/node\n18.15.11"]);
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
  click C_0 "https://github.com/e53e04ac/event-emitter/tree/b07aafda2d8ddb14a40a0fe63ea41de2b8b58ca3";
  click C_1 "https://github.com/e53e04ac/file-entry-native/tree/d75a642bb73e256d7304076bb54771d9a807ff33";
  click C_2 "https://github.com/e53e04ac/hold/tree/6ce132702778d99c7f80a785e982419974dca8e5";
  click C_3 "https://www.npmjs.com/package/@types/node/v/18.15.11";
  click C_4 "https://github.com/e53e04ac/file-entry/tree/43d558c1cb0725770c2f06b00bd2d174c543a145";
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
