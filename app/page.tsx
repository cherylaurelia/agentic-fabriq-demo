const REPO_URL = "https://github.com/cherylaurelia/agentic-fabriq-demo";
const BRANCH_URL = "https://github.com/cherylaurelia/mnemiq/compare/main...fix/pin-quickstart-python";
const CI_BEFORE = "https://github.com/cherylaurelia/mnemiq/actions/runs/43997953085/job/133754578373";
const CI_AFTER = "https://github.com/cherylaurelia/mnemiq/actions/runs/43997953326/job/133754579462";

const logUrl = (name: string): string => `${REPO_URL}/blob/main/logs/${name}`;

function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-[0.88em]">{children}</code>;
}

function Terminal({ title, tone, lines }: { title: string; tone: "bad" | "good"; lines: string[] }) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-lg border border-line bg-ink text-sm">
      <figcaption
        className={`px-4 py-2 font-mono text-xs ${tone === "bad" ? "bg-peach text-ink" : "bg-sage text-ink"}`}
      >
        {title}
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[0.8rem] leading-relaxed text-gray-100">
        {lines.join("\n")}
      </pre>
    </figure>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <p className="font-mono text-sm text-slate">mnemiq · README quickstart, step 1 · 2026-11-16</p>

      <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        mnemiq&apos;s quickstart fails at <code className="font-mono text-[0.8em] [word-spacing:-0.35em]">uv sync</code> on a fresh machine
      </h1>
      <p className="mt-6 text-lg text-gray-800">
        <strong>Problem:</strong> with no Python of its own, uv downloads the newest, CPython 3.15, and the lock pins{" "}
        <Code>psycopg-binary 3.3.4</Code> and <Code>pyarrow 25.0.0</Code>, which have no 3.15 wheels, so the
        README&apos;s first command fails.
      </p>
      <p className="mt-3 text-lg text-gray-800">
        <strong>Fix:</strong> a one-line <Code>.python-version</Code> naming 3.12, the Python every CI job already
        runs, plus a CI job that runs the quickstart&apos;s install the way a fresh machine does.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <a className="rounded-md bg-ink px-4 py-2 font-medium text-paper hover:bg-gray-800" href={BRANCH_URL}>
          The fix branch (14 lines)
        </a>
        <a className="rounded-md border border-ink px-4 py-2 font-medium hover:bg-white" href={REPO_URL}>
          Logs and this page&apos;s repo
        </a>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Terminal
          title="main 7a7786b · a Mac with uv and no Python"
          tone="bad"
          lines={[
            "$ git clone …/agenticfabriq/mnemiq && cd mnemiq",
            "$ uv sync",
            "Downloaded cpython-3.15.2-macos-aarch64-none",
            "Using CPython 3.15.2",
            "error: Distribution `psycopg-binary==3.3.4` can't",
            "  be installed because it doesn't have a source",
            "  distribution or wheel for the current platform",
            "hint: … only has wheels with the following",
            "  Python ABI tags: `cp312`, `cp313`, `cp314`",
          ]}
        />
        <Terminal
          title="with .python-version = 3.12 · same machine"
          tone="good"
          lines={[
            "$ cat .python-version",
            "3.12",
            "$ uv sync",
            "Downloaded cpython-3.12.16-macos-aarch64-none",
            "Using CPython 3.12.16",
            "Installed 42 packages in 88ms",
            "$ uv run python scripts/seed_demo.py",
            "wrote demo/demo.sqlite — 4 tables, 33 rows",
          ]}
        />
      </section>
      <p className="mt-3 text-sm text-slate">
        Raw output: <a className="underline" href={logUrl("before-clean-uv-sync.txt")}>before</a>,{" "}
        <a className="underline" href={logUrl("after-clean-uv-sync.txt")}>after</a>. The same check on GitHub&apos;s
        Linux runners: <a className="underline" href={CI_BEFORE}>fails without the pin</a> (uv downloads 3.15.2,
        same psycopg error), <a className="underline" href={CI_AFTER}>passes with it</a>.
      </p>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Who hits it</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-800">
          <li>
            Anyone whose machine has no Python 3.12–3.14 for uv to use: <Code>requires-python = &quot;&gt;=3.12&quot;</Code>{" "}
            and no <Code>.python-version</Code>, so uv downloads its newest, 3.15. A stock Mac only has 3.9.
          </li>
          <li>
            Anyone on Homebrew&apos;s <Code>python3</Code>, which is now 3.15.2: <Code>uv sync</Code> fails the same way.{" "}
            <a className="underline" href={logUrl("before-homebrew-python.txt")}>Log</a>.
          </li>
          <li>
            Contributors too: CONTRIBUTING&apos;s <Code>uv sync --extra dev</Code> and the repo&apos;s pre-commit hook
            (it runs uv for ruff) stop at the same psycopg error.
          </li>
        </ul>
        <p className="mt-4 text-gray-800">
          Bumping psycopg alone isn&apos;t enough: the install then fails building <Code>pyarrow 25.0.0</Code> from
          source. <Code>pip install -e .</Code> works on 3.15, because a fresh resolve picks psycopg 3.3.9 and pyarrow
          26.0.1, which have 3.15 wheels. Only the lockfile path, the one the README uses, breaks.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Why CI stayed green</h2>
        <p className="mt-4 text-gray-800">
          <Code>unit</Code> runs <Code>uv sync</Code> on <Code>ubuntu-latest</Code>, and uv uses the runner&apos;s own
          Python 3.12. The Docker image pins <Code>python:3.13.9</Code>. deps-canary resolves on the runner&apos;s
          Python too. No job installs the way a new user&apos;s machine does, so a Python release the lock has no wheels
          for never shows up. The new <Code>quickstart-fresh-python</Code> job sets{" "}
          <Code>UV_PYTHON_PREFERENCE=only-managed</Code> and runs <Code>uv sync --locked</Code>, the demo seed and{" "}
          <Code>mnemiq --help</Code>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Why 3.12, and the other routes</h2>
        <p className="mt-4 text-gray-800">
          3.12 is the floor <Code>requires-python</Code> declares and the Python every CI job already runs, so the pin
          changes nothing CI tests and gives a new machine the Python the suite passed on. (A 3.13 pin would also work,
          but it would quietly move <Code>unit</Code> off 3.12 and leave the floor untested.) Capping{" "}
          <Code>requires-python</Code> at <Code>&lt;3.15</Code> works too, but rewrites about 110 lines of{" "}
          <Code>uv.lock</Code>. Refreshing the lock (psycopg 3.3.9 and pyarrow 26.0.1 have 3.15 wheels) changes runtime
          dependencies for every user, and the full unit suite on 3.15 wasn&apos;t run to the end here (no failures in
          the first 37%). Either can follow the pin.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">The rest of the quickstart works</h2>
        <p className="mt-4 text-gray-800">
          With the pin (3.12), the rest of the README ran against a local llama-server (Qwen3-4B-Instruct for chat and
          embeddings, no key). <Code>enrich</Code> took 23 s. All three README questions ran: the right SQL for the count
          by country and for enterprise customers (through the segment lookup), and last quarter&apos;s revenue refused
          because the schema has no price column. The small model&apos;s sentence for the first question said 9
          customers where the rows add up to 8; the SQL was right.{" "}
          <a className="underline" href={logUrl("after-quickstart-local-model.txt")}>Log</a>.
        </p>
      </section>

      <footer className="mt-16 border-t border-line pt-6 text-sm text-slate">
        Unofficial demo by Cheryl Aurelia: not affiliated with Agentic Fabriq.
      </footer>
    </main>
  );
}
