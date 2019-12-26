---
layout: default
title: 'API Reference'
nav_order: 1
---

# API Reference

*Class* **Shhh**

```
const Shhh = require('shhh')

const client = new Shhh(params)
```

*Constructor Parameters*

| Parameter       | Description                                                                                                                           | Default          |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------|------------------|
| region          | The S3 region to request                                                                                                              | us-east-1        |
| accessKeyId     | AWS Access Key (default env.AWS_ACCESS_KEY_ID)                                                                                        |                  |
| secretAccessKey | AWS Secret Key (default env.AWS_SECRET_ACCESS_KEY)                                                                                    |                  |
| endpoint        | host:port for S3 endpoint (default s3.amazonaws.com, alternatives such  as s3-eu-west-1.amazonaws.com or fra1.digitaloceanspaces.com) | s3.amazonaws.com |
| encryptionKey   | 32 byte key to be used for encryption and decryption                                                                                  |                  |

*Methods*

**Shhh**.encrypt(key, value)

```
const Shhh = require('shhh')

const client = new Shhh(params)

const secret = await client.encrypt('key', 'value')
```

**Shhh**.decrypt(key)

```
const Shhh = require('shhh')

const client = new Shhh(params)

const value = await client.decrypt('key')
```
