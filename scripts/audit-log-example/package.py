#!/usr/bin/env python3
"""Build or check the downloadable quick start from maintained sources."""
import argparse
import io
import json
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--check', action='store_true', help='Fail if the archive differs from source.')
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
source = root / 'examples/audit-log-quick-start'
destination = root / 'public/examples/audit-log-0.7.0.zip'
skip_dirs = {'node_modules', 'generated', 'dist', 'dist-verification', '.git'}
skip_files = {'.env', '.DS_Store'}
manifest = json.loads((source / 'package.json').read_text())
lock = json.loads((source / 'package-lock.json').read_text())
assert manifest['dependencies']['@nestarc/audit-log'] == '0.7.0'
assert lock['packages']['node_modules/@nestarc/audit-log']['version'] == '0.7.0'
assert lock['packages']['node_modules/@nestarc/audit-log']['resolved'].startswith('https://registry.npmjs.org/')
buffer = io.BytesIO()
with ZipFile(buffer, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(source.rglob('*')):
        relative = path.relative_to(source)
        if not path.is_file() or any(part in skip_dirs for part in relative.parts) or path.name in skip_files:
            continue
        info = ZipInfo(f'audit-log-quick-start/{relative.as_posix()}', date_time=(2026, 9, 29, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, path.read_bytes())
payload = buffer.getvalue()
if args.check:
    assert destination.is_file() and destination.read_bytes() == payload, 'Archive differs; run package.py.'
    print('Quick Start archive matches source and pins registry audit-log 0.7.0.')
else:
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(payload)
    print(f'{destination.relative_to(root)} ({len(payload):,} bytes)')
