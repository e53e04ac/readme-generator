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
  click B_0 "https://github.com/e53e04ac/event-emitter/tree/9a08c4203bfae12e94f36c9496c256c69fdd2277";
  click B_1 "https://github.com/e53e04ac/file-entry-native/tree/3c7e8e20a8f04f390eaec31c9e9654c9fe219797";
  click B_2 "https://github.com/e53e04ac/hold/tree/49707680ccdf4c5673f64ff0bab30f408269b328";
  click B_3 "https://www.npmjs.org/package/@types/node/v/18.14.0";
  click B_4 "https://github.com/e53e04ac/file-entry/tree/c2cb299755ce1e1acd4da616865b44ea054e9291";
~~~~~

~~~~~ mermaid
graph RL;
  subgraph "e53e04ac/readme-generator";
    E_0(["ReadmeGenerator"]);
  end;
  M(["index.mjs"])
  subgraph "node:fs";
    I_0_0(["createWriteStream"]);
  end;
  subgraph "node:stream";
    I_1_0(["Readable"]);
    I_1_1(["Transform"]);
  end;
  subgraph "node:stream/promises";
    I_2_0(["pipeline"]);
  end;
  subgraph "event-emitter";
    I_3_0(["EventEmitter"]);
  end;
  subgraph "hold";
    I_4_0(["hold"]);
    I_4_1(["unwrap"]);
  end;
  M ----> I_0_0;
  M ----> I_1_0;
  M ----> I_1_1;
  M ----> I_2_0;
  M ----> I_3_0;
  M ----> I_4_0;
  M ----> I_4_1;
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
  subgraph "event-emitter";
    I_0_0(["EventEmitter"]);
  end;
  subgraph "file-entry";
    I_1_0(["FileEntry"]);
  end;
  subgraph "hold";
    I_2_0(["Get"]);
    I_2_1(["ValueOrGet"]);
  end;
  M ----> I_0_0;
  M ----> I_1_0;
  M ----> I_2_0;
  M ----> I_2_1;
  E_0 ----> M;
  E_1 ----> M;
  E_2 ----> M;
~~~~~
