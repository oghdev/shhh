---
layout: home
title: 'Home'
nav_order: 0
---

# 🙉 shhh

A command line tool for securely storing secrets on S3. **shhh** encrypts plain text passwords/secrets using the [Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard#Security) (aes-256) and a master password/key.

## Installation

**Requirements**

*Node JS (>=10)*

### Package Manager

**shhh** can be installed with your favorite node package manager (npm/yarn/pnpm)

An example with npm:

```bash
npm install -g oghdev/shhh
```

**Version pinning**

If you want to install and pin a specific version of **shhh**, you can do so by referencing a specific [release](https://github.com/oghdev/shhh/releases) tarball.

An example with npm;

```bash
npm install -g https://github.com/oghdev/shhh/archive/0.1.1.tar.gz
```

## Usage

**shhh** has two commands, `shhh encrypt` and `shhh decrypt`. Values encrypted are stored on s3 for access & decryption.

```bash
shhh encrypt <key> [value]
```

```bash
shhh decrypt <key>
```

### Using the CLI

If you install **shhh** with the global flag `npm i -g oghdev/shhh` flag, it will add the shhh executable to your shell path. This will allow you to use it as below:

```bash
shhh encrypt secret-name "foo" \
  --bucket-name bar \
  --access-key-id "..." \
  --secret-access-key "..." \
  --encryption-key "32 byte key"
```

This will encrypt the value "foo" and uploads the encrypted secret to the "secret-name" key in the bucket "bar".

This will make also the plain text secret value visible in the shell history and in a process list (e.g. ps) so we also support piping in the value via *stdin*:

```bash
cat supersecretfile | shhh encrypt secret-name - \
  --bucket-name bar \
  --access-key-id "..." \
  --secret-access-key "..." \
  --encryption-key "32 byte key"
```

To decrypt the above secret, which was stored under the "secret-name" key in the "bar" bucket - we use the following command:

```bash
shhh decrypt secret-name \
  --bucket-name bar \
  --access-key-id "..." \
  --secret-access-key "..." \
  --encryption-key "32 byte key"
```

This will output the plain text value to stdout after decrypting. To avoid this showing up in shell history or on the terminal, its recommended to pipe the output into a file (and set permissions to be readable by only your user) or to save the output directly to a shell variable:

```bash
shhh decrypt secret-name \
  --bucket-name bar \
  --access-key-id "..." \
  --secret-access-key "..." \
  --encryption-key "32 byte key"
```

### Using the Node API

You can also use **shhh** via an exposed api:

```
$ cat encrypt.js

const Shhh = require('shhh')

const key = process.argv[1]
const value = process.argv[2]
const bucketName = "secret-bucket"

const client = new Shhh({ bucketName })

client.encrypt(key, value)
  .then(console.log)

$ node encrypt.js "secret-key" "secret-value"

nE92uIDGTMa7X9vecQeoUeoUrsisRYQjgdUPe2hLJMKNsrZ1JEOVqg3Wr3+XViuatiEWLCkguQ==
```

```
$ cat decrypt.js

const Shhh = require('shhh')

const key = process.argv[1]
const bucketName = "secret-bucket"

const client = new Shhh({ bucketName })

client.decrypt(key).then(console.log)

$ node decrypt.js "secret-key"

secret-value

```

### Environment variables

We support passing in the parameters via environment variables too. This avoids exposing sensitive information on the command line, as well as providing shorter commands!

| Env Variable          | CLI Parameter     | Default          |
|-----------------------|-------------------|------------------|
| AWS_REGION            | region            | us-east-1        |
| AWS_ACCESS_KEY_ID     | access-key-id     |                  |
| AWS_SECRET_ACCESS_KEY | secret-access-key |                  |
| S3_ENDPOINT           | endpoint          | s3.amazonaws.com |
| S3_ENCRYPTION_KEY     | encryption-key    |                  |

Any defined command line parameter will overwrite any set environment variable or default value.

### API Reference

Please see [REFERENCE.md](reference.html)

## FAQ

**Q: Can I use shhh with an S3 compatible service like DigitalOcean Spaces or MinIO**

A: Sure. Just set the `S3_ENDPOINT` to the hostname/ip address of the service and pass in the access key and secret key as normal.

## Versioning

We follow the Semantic Versioning Specification for our releases.

For a given version of **shhh**, we will only increment the:

- MAJOR version when you on an incompatible API change,
- MINOR version when adding functionality in a backwards compatible manner
- PATCH version when you make backwards compatible changes/improvements/bug fixes.

If you are concerned about breaking changes, see the section above regarding version pinning.

Currently **shhh** should be considered beta software.

## Contributing

Please see [CONTRIBUTING.md](contributing.html)
