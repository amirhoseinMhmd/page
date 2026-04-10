import { useMemo, useState } from 'react';

const defaultValues = {
  username: 'username',
  host: 'hpc.university.edu',
  projectPath: '~/my_project',
  fileName: 'myscript.py',
  folderName: 'my_project',
};

function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
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
      {copied ? 'Copied' : label}
    </button>
  );
}

export default function SshCommandBuilder() {
  const [username, setUsername] = useState(defaultValues.username);
  const [host, setHost] = useState(defaultValues.host);
  const [projectPath, setProjectPath] = useState(defaultValues.projectPath);
  const [fileName, setFileName] = useState(defaultValues.fileName);
  const [folderName, setFolderName] = useState(defaultValues.folderName);

  const commands = useMemo(() => {
    const ssh = `ssh ${username}@${host}`;
    const scpFile = `scp ${fileName} ${username}@${host}:${projectPath}/`;
    const scpFolder = `scp -r ${folderName}/ ${username}@${host}:${projectPath}/`;
    return { ssh, scpFile, scpFolder };
  }, [fileName, folderName, host, projectPath, username]);

  return (
    <section className="island-card island-card-ssh" aria-label="SSH command builder">
      <div className="island-heading">
        <div>
          <div className="island-eyebrow">Interactive Tool</div>
          <h3>SSH &amp; SCP command builder</h3>
        </div>
        <p>Fill in your cluster details once, then copy the exact commands you need.</p>
      </div>

      <div className="island-grid">
        <label className="island-field">
          <span>Username</span>
          <input value={username} onChange={(event) => setUsername(event.target.value || defaultValues.username)} />
        </label>
        <label className="island-field">
          <span>Host</span>
          <input value={host} onChange={(event) => setHost(event.target.value || defaultValues.host)} />
        </label>
        <label className="island-field">
          <span>Remote project path</span>
          <input value={projectPath} onChange={(event) => setProjectPath(event.target.value || defaultValues.projectPath)} />
        </label>
        <label className="island-field">
          <span>Single file</span>
          <input value={fileName} onChange={(event) => setFileName(event.target.value || defaultValues.fileName)} />
        </label>
        <label className="island-field island-field-wide">
          <span>Folder name</span>
          <input value={folderName} onChange={(event) => setFolderName(event.target.value || defaultValues.folderName)} />
        </label>
      </div>

      <div className="island-output-list">
        <div className="island-output">
          <div className="island-output-header">
            <strong>Connect</strong>
            <CopyButton value={commands.ssh} />
          </div>
          <pre className="island-shell">{commands.ssh}</pre>
        </div>

        <div className="island-output">
          <div className="island-output-header">
            <strong>Upload one file</strong>
            <CopyButton value={commands.scpFile} />
          </div>
          <pre className="island-shell">{commands.scpFile}</pre>
        </div>

        <div className="island-output">
          <div className="island-output-header">
            <strong>Upload a folder</strong>
            <CopyButton value={commands.scpFolder} />
          </div>
          <pre className="island-shell">{commands.scpFolder}</pre>
        </div>
      </div>
    </section>
  );
}
