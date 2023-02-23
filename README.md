# readme-generator

~~~~~ sh
npm install e53e04ac/readme-generator
~~~~~

~~~~~ mjs
import { ReadmeGenerator } from 'e53e04ac/readme-generator';
~~~~~

~~~~~ mermaid
graph RL;
  A(["package.json"]);
  subgraph "dependencies";
    B_0(["e53e04ac/event-emitter"]);
    B_1(["e53e04ac/file-entry-native"]);
    B_2(["e53e04ac/hold"]);
  end;
  subgraph "devDependencies";
    B_3(["@types/node"]);
    B_4(["e53e04ac/file-entry"]);
  end;
  A ----> B_0;
  A ----> B_1;
  A ----> B_2;
  A ----> B_3;
  A ----> B_4;
  click B_0 "https://github.com/e53e04ac/event-emitter/tree/faf256d4d2350ffa0af1fed794236faa4f0740a1";
  click B_1 "https://github.com/e53e04ac/file-entry-native/tree/9f6065504bf14be690aee1bb9beb982b21eef0d2";
  click B_2 "https://github.com/e53e04ac/hold/tree/443c2e801bbe20409c761994a91fa88fb6044602";
  click B_3 "https://www.npmjs.com/package/@types/node/v/18.14.1";
  click B_4 "https://github.com/e53e04ac/file-entry/tree/69045717124e824d6d83b98b6866fcafe8f295ef";
~~~~~

~~~~~ mermaid
graph RL;
  subgraph "e53e04ac/readme-generator";
    E_0(["ReadmeGenerator"]);
  end;
  M(["index.mjs"])
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

~~~~~ mermaid
graph RL;
  subgraph "e53e04ac/readme-generator";
    E_0(["namespace ReadmeGenerator"]);
    E_1(["type ReadmeGenerator"]);
    E_2(["const ReadmeGenerator"]);
  end;
  M(["index.d.ts"])
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
