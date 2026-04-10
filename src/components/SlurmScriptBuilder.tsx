import { useMemo, useState } from 'react';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className="island-copy" onClick={handleCopy}>
      {copied ? 'Copied' : 'Copy script'}
    </button>
  );
}

export default function SlurmScriptBuilder() {
  const [mode, setMode] = useState<'cpu' | 'gpu'>('cpu');
  const [jobName, setJobName] = useState('my_first_job');
  const [time, setTime] = useState('00:30:00');
  const [cpus, setCpus] = useState('4');
  const [memory, setMemory] = useState('8G');
  const [partition, setPartition] = useState(mode === 'gpu' ? 'gpu' : '');
  const [account, setAccount] = useState('');
  const [gpus, setGpus] = useState('1');
  const [pythonModule, setPythonModule] = useState('Python');
  const [cudaModule, setCudaModule] = useState('CUDA');
  const [envPath, setEnvPath] = useState('/home/username/my_project/.venv/bin/activate');
  const [command, setCommand] = useState('python train.py');

  const script = useMemo(() => {
    const lines = [
      '#!/bin/bash',
      `#SBATCH --job-name=${jobName}`,
      `#SBATCH --time=${time}`,
      '#SBATCH --nodes=1',
      '#SBATCH --ntasks=1',
      `#SBATCH --cpus-per-task=${cpus}`,
      `#SBATCH --mem=${memory}`,
    ];

    if (partition.trim()) {
      lines.push(`#SBATCH --partition=${partition.trim()}`);
    }

    if (account.trim()) {
      lines.push(`#SBATCH --account=${account.trim()}`);
    }

    if (mode === 'gpu') {
      lines.push(`#SBATCH --gpus=${gpus}`);
    }

    lines.push('');
    lines.push(`module load ${pythonModule}`);

    if (mode === 'gpu') {
      lines.push(`module load ${cudaModule}`);
    }

    if (envPath.trim()) {
      lines.push(`source ${envPath.trim()}`);
    }

    lines.push(command.trim() || 'python train.py');

    return lines.join('\n');
  }, [account, command, cpus, cudaModule, envPath, gpus, jobName, memory, mode, partition, pythonModule, time]);

  const estimatedProfile = useMemo(() => {
    return [
      `${mode.toUpperCase()} job`,
      `${cpus} CPU${cpus === '1' ? '' : 's'}`,
      `${memory} RAM`,
      mode === 'gpu' ? `${gpus} GPU${gpus === '1' ? '' : 's'}` : null,
      time,
    ].filter((item): item is string => Boolean(item));
  }, [cpus, gpus, memory, mode, time]);

  return (
    <section className="island-card island-card-slurm" aria-label="Slurm script builder">
      <div className="island-heading">
        <div>
          <div className="island-eyebrow">Interactive Tool</div>
          <h3>Slurm script builder</h3>
        </div>
        <p>Adjust the resources you want and copy a ready-to-edit job script.</p>
      </div>

      <div className="island-toggle-row" role="tablist" aria-label="Job type">
        <button
          type="button"
          className={`island-toggle ${mode === 'cpu' ? 'active' : ''}`}
          onClick={() => {
            setMode('cpu');
            if (partition === 'gpu') setPartition('');
          }}
        >
          CPU job
        </button>
        <button
          type="button"
          className={`island-toggle ${mode === 'gpu' ? 'active' : ''}`}
          onClick={() => {
            setMode('gpu');
            if (!partition) setPartition('gpu');
          }}
        >
          GPU job
        </button>
      </div>

      <div className="island-grid">
        <label className="island-field">
          <span>Job name</span>
          <input value={jobName} onChange={(event) => setJobName(event.target.value)} />
        </label>
        <label className="island-field">
          <span>Time</span>
          <input value={time} onChange={(event) => setTime(event.target.value)} />
        </label>
        <label className="island-field">
          <span>CPUs</span>
          <input value={cpus} onChange={(event) => setCpus(event.target.value)} />
        </label>
        <label className="island-field">
          <span>Memory</span>
          <input value={memory} onChange={(event) => setMemory(event.target.value)} />
        </label>
        <label className="island-field">
          <span>Partition</span>
          <input value={partition} onChange={(event) => setPartition(event.target.value)} placeholder="gpu, short, long..." />
        </label>
        <label className="island-field">
          <span>Account</span>
          <input value={account} onChange={(event) => setAccount(event.target.value)} placeholder="optional" />
        </label>
        {mode === 'gpu' && (
          <label className="island-field">
            <span>GPUs</span>
            <input value={gpus} onChange={(event) => setGpus(event.target.value)} />
          </label>
        )}
        <label className="island-field">
          <span>Python module</span>
          <input value={pythonModule} onChange={(event) => setPythonModule(event.target.value)} />
        </label>
        {mode === 'gpu' && (
          <label className="island-field">
            <span>CUDA module</span>
            <input value={cudaModule} onChange={(event) => setCudaModule(event.target.value)} />
          </label>
        )}
        <label className="island-field island-field-wide">
          <span>Virtual env activate path</span>
          <input value={envPath} onChange={(event) => setEnvPath(event.target.value)} />
        </label>
        <label className="island-field island-field-wide">
          <span>Run command</span>
          <input value={command} onChange={(event) => setCommand(event.target.value)} />
        </label>
      </div>

      <div className="island-meta">
        {estimatedProfile.map((item) => (
          <span className="island-pill" key={item}>
            {item}
          </span>
        ))}
      </div>

      <div className="island-output">
        <div className="island-output-header">
          <strong>Generated job script</strong>
          <CopyButton value={script} />
        </div>
        <pre className="island-shell island-shell-large">{script}</pre>
      </div>
    </section>
  );
}
