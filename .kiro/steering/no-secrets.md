---
inclusion: always
---

# No Secrets / No Private Keys Rule

**Never commit private keys, seed phrases, or secrets to this repository.**

## Rules (enforced for every code generation)

1. **No `.env` files** — there are no API keys or secrets needed; the DevNet endpoint and merchant wallet are public constants.
2. **No private keys in source code** — not in comments, not in strings, not in test fixtures.
3. **No seed phrases** — 12- or 24-word mnemonics must never appear anywhere in the repo.
4. The merchant wallet address (`5hMaBEB2NdYLHJPLZU88JNAVuroZzJLDSF6QixoiQsBi`) is a **public address** and is safe to hardcode. Only public addresses (Base58, 32–44 chars) are allowed in source code.
5. `.env`, `.env.local`, `*.pem`, `*_keypair.json` are in `.gitignore` and must stay there.
6. If a keypair JSON file is needed for local testing only, add it to `.gitignore` immediately and document this in a comment.

## Why
Leaked private keys on GitHub result in immediate wallet drain. Judges will
inspect the repo — keep it clean.
