#!/usr/bin/env python3
"""Build or check the downloadable API keys example from maintained sources."""
import argparse
import io
import json
import os
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--check', action='store_true', help='Fail if the archive differs from source.')
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
source = root / 'examples/api-keys-quick-start'
destination = root / 'public/examples/api-keys-0.4.0.zip'
skip_dirs = {'node_modules', 'generated', 'dist', '.git', 'coverage'}
manifest = json.loads((source / 'package.json').read_text())
lock = json.loads((source / 'package-lock.json').read_text())
assert manifest['dependencies']['@nestarc/api-keys'] == '0.4.0'
assert lock['packages']['node_modules/@nestarc/api-keys']['version'] == '0.4.0'
assert lock['packages']['node_modules/@nestarc/api-keys']['resolved'].startswith('https://registry.npmjs.org/')

files = []
for directory, dirs, names in os.walk(source, followlinks=False):
    dirs[:] = sorted(name for name in dirs if name not in skip_dirs)
    for name in names:
        if name == '.DS_Store' or name.endswith(('.log', '.tsbuildinfo')):
            continue
        if name == '.env' or (name.startswith('.env.') and name != '.env.example'):
            continue
        path = Path(directory) / name
        if path.is_symlink():
            raise ValueError(f'Example must not contain symbolic links: {path}')
        files.append(path)

buffer = io.BytesIO()
with ZipFile(buffer, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(files):
        relative = path.relative_to(source)
        info = ZipInfo(f'api-keys-quick-start/{relative.as_posix()}', date_time=(2026, 11, 15, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, path.read_bytes())
payload = buffer.getvalue()
if args.check:
    assert destination.is_file() and destination.read_bytes() == payload, 'Archive differs; run package.py.'
    print('API keys archive matches source and pins registry api-keys 0.4.0.')
else:
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(payload)
    print(f'{destination.relative_to(root)} ({len(payload):,} bytes)')
