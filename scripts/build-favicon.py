"""Package the separately rendered 16, 32 and 48 px PNGs in a Windows ICO."""
from pathlib import Path
import struct

root = Path(__file__).resolve().parents[1]
frames = [(size, (root / f"public/icons/favicon-{size}-v2.png").read_bytes())
          for size in (16, 32, 48)]
offset = 6 + 16 * len(frames)
directory = bytearray(struct.pack("<HHH", 0, 1, len(frames)))
for size, png in frames:
    directory.extend(struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(png), offset))
    offset += len(png)
(root / "public/favicon.ico").write_bytes(directory + b"".join(png for _, png in frames))
