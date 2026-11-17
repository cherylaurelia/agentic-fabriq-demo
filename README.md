# mnemiq's quickstart fails at `uv sync` on a fresh machine (unofficial demo)

Live page: see the repo description. Unofficial demo by Cheryl Aurelia: not affiliated with Agentic Fabriq.

**Problem.** [mnemiq](https://github.com/agenticfabriq/mnemiq)'s `pyproject.toml` says `requires-python = ">=3.12"` and the repo has no `.python-version`. On a machine with no Python 3.12–3.14 for uv to use (a stock Mac, or one on Homebrew's `python3`, now 3.15.2), `uv sync` downloads CPython 3.15 and fails: the lock pins `psycopg-binary 3.3.4` and `pyarrow 25.0.0`, which have no cp315 wheels. CI is green because `unit` installs on the runner's Python 3.12.

**Fix.** Branch [`fix/pin-quickstart-python`](https://github.com/cherylaurelia/mnemiq/compare/main...fix/pin-quickstart-python): `.python-version` = `3.13` (what the Dockerfile ships) and a `quickstart-fresh-python` CI job (`UV_PYTHON_PREFERENCE=only-managed`, `uv sync --locked`, demo seed, `mnemiq --help`). On the fork's CI the job [fails without the pin](https://github.com/cherylaurelia/mnemiq/actions/runs/43997953085/job/133754578373) and [passes with it](https://github.com/cherylaurelia/mnemiq/actions/runs/43997953326/job/133754579462).

**Logs** (`logs/`): `before-clean-uv-sync.txt`, `before-homebrew-python.txt`, `after-clean-uv-sync.txt`, `after-quickstart-local-model.txt` (rest of the README quickstart on 3.13 with a local Qwen3-4B, no key).

Run the page: `npm install && npm run build && npm run start`.
