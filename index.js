const AWS = require('aws-sdk')
const S3 = require('aws-sdk/clients/s3')

const util = require('util')
const crypto = require('@emartech/easy-crypto')()

const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const S3_ENDPOINT = process.env.S3_ENDPOINT || 's3.amazonaws.com'
const S3_ENCRYPTION_KEY = process.env.S3_ENCRYPTION_KEY

class Shhh {

  constructor (config) {

    config = config || {}

    Object.keys(config).forEach(key => config[key] === undefined && delete config[key])

    this.config = Object.assign({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      endpoint: S3_ENDPOINT,
      encryptionKey: S3_ENCRYPTION_KEY
    }, config)

    const endpoint = new AWS.Endpoint(this.config.endpoint)
    const credentials = new AWS.Credentials(this.config.accessKeyId, this.config.secretAccessKey)

    this.client = new S3({
      credentials,
      endpoint
    })

  }

  async encrypt (key, value) {

    const encrypted = await crypto.encrypt(this.config.encryptionKey.toString(), value.toString())

    const params = { Bucket: this.config.bucketName, Key: key, Body: encrypted.toString() }

    await this.client.putObject(params).promise()

    return encrypted

  }

  async decrypt (key) {

    const params = { Bucket: this.config.bucketName, Key: key }

    const res = await this.client.getObject(params).promise()

    const encrypted = res.Body.toString()

    const decrypted = await crypto.decrypt(this.config.encryptionKey.toString(), encrypted.toString())

  	return decrypted.toString()

  }

}

module.exports = Shhh
