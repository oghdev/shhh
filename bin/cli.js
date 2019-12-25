#!/usr/bin/env node

require('dotenv').config()

const Shhh = require('../index')

const yargs = require('yargs')
const getStdin = require('get-stdin')

const encrypt = async (argv) => {

  if (!argv.value || argv.value === '-') {

    argv.value = await getStdin()

  }

  if (!argv.value) {

    throw new Error('Value not specified')

  }

  const bucketName = argv.bucketName
  const encryptionKey = argv.encryptionKey
  const endpoint = argv.endpoint
  const accessKeyId = argv.accessKeyId
  const secretAccessKey = argv.secretAccessKey

  const client = new Shhh({
    endpoint,
    bucketName,
    encryptionKey,
    accessKeyId,
    secretAccessKey
  })

  const key = argv.key.trim()
  const value = argv.value.trim()

  const encrypted = await client.encrypt(key, value)

  console.log(encrypted)

}

const decrypt = async (argv) => {

  const bucketName = argv.bucketName
  const encryptionKey = argv.encryptionKey
  const endpoint = argv.endpoint
  const accessKeyId = argv.accessKeyId
  const secretAccessKey = argv.secretAccessKey

  const client = new Shhh({
    endpoint,
    bucketName,
    encryptionKey,
    accessKeyId,
    secretAccessKey
  })

  const key = argv.key

  const decrypted = await client.decrypt(key)

  console.log(decrypted)

}

yargs
  .scriptName('shhh')
  .command(
    'encrypt <key> [value]',
    'Encrypts input value and stores in s3',
    (yargs) => (
      yargs.option('bucket-name', {
        type: 'string',
        description: 'Bucket name to store the secrets'
      })
      .option('encryption-key', {
        type: 'string',
        description: '32 bit key used to encrypt/decrypt secrets'
      })
      .option('endpoint', {
        type: 'string',
        description: 'host:port for S3 endpoint (default s3.amazonaws.com, alternatives such as s3-eu-west-1.amazonaws.com)'
      })
      .option('access-key-id', {
        type: 'string',
        description: 'AWS Access Key (default AWS_ACCESS_KEY_ID)'
      })
      .option('secret-access-key', {
        type: 'string',
        description: 'AWS Secret Key (default AWS_SECRET_ACCESS_KEY)'
      })
      .positional('key', {
        type: 'string'
      })
      .positional('value', {
        type: 'string'
      })
    ),
    encrypt
  )
  .command(
    'decrypt <key>',
    'Decrypts given secret from s3',
    (yargs) => (
      yargs.option('bucket-name', {
        type: 'string',
        description: 'Bucket name to store the secrets'
      })
      .option('encryption-key', {
        type: 'string',
        description: '32 bit key used to encrypt/decrypt secrets'
      })
      .option('endpoint', {
        type: 'string',
        description: 'host:port for S3 endpoint (default s3.amazonaws.com, alternatives such as s3-eu-west-1.amazonaws.com)'
      })
      .option('access-key-id', {
        type: 'string',
        description: 'AWS Access Key (default AWS_ACCESS_KEY_ID)'
      })
      .option('secret-access-key', {
        type: 'string',
        description: 'AWS Secret Key (default AWS_SECRET_ACCESS_KEY)'
      })
      .positional('key', {
        type: 'string'
      })
    ),
    decrypt
  )
  .group([ 'help', 'version' ], 'Global Options:')
  .strict()
  .help()
  .version()
  .showHelpOnFail(true, 'Specify --help for available options')
  .wrap(yargs.terminalWidth()*0.75)
  .argv
