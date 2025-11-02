import ProcessTree from './components/ProcessTree';

export default function Page() {
  return (
    <main className="container">
      <div className="header">
        <div className="title">Process Tree for repeated fork()</div>
        <div className="subtle">Code: void main(argc, argv) {'{'} for (int i = 0; i &lt; 4; i++) {'{'} int ret = fork(); if (ret == 0) printf("child %d\n", i); {'}'} {'}'}</div>
      </div>
      <ProcessTree defaultIterations={4} />
    </main>
  );
}
