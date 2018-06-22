'use strict'
const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(require('bluebird'))
AWS.config.update({
  region: 'ap-southeast-2'
})
AWS.config.setPromisesDependency(require('bluebird'))
const clouddirectory = new AWS.CloudDirectory()
const schemaArn = ''
const directory_arn = ''

module.exports.createGroupObject = (event, context, callback) => {
  //createGroup('/APP', 'WAY2HOME', 'WAY2HOME', 'Group', 'Name')
  //createGroup('/APP', 'MYHEALTH', 'MYHEALTH', 'Group', 'Name')
  createGroup('/', 'WAY2HOME', 'WAY2HOME-POLICY', 'AccessRole', 'AccessLevel')
    .then(data => {
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*' // Required for CORS support to work
        },
        body: JSON.stringify({
          message: 'Your function executed successfully!',
          input: event
        })
      }
      callback(null, response)
    })
    .catch(err => {
      callback(err)
    })
}

module.exports.listApps = (event, context, callback) => {
  listObjectChildren('/APP/')
    .then(data => {
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Your function executed successfully!',
          input: event
        })
      }
      console.log(data)
      callback(null, response)
    })
    .catch(err => {
      console.log(err)
      callback(err)
    })
}

const createGroup = (
  parentReference,
  linkName,
  groupType,
  facetName,
  attName
) => {
  const params = {
    DirectoryArn: directory_arn,
    SchemaFacets: [
      /* required */
      {
        FacetName: facetName,
        SchemaArn: schemaArn
      }
    ],
    LinkName: linkName,
    ObjectAttributeList: [
      {
        Key: {
          /* required */
          FacetName: facetName /* required */,
          Name: attName /* required */,
          SchemaArn: schemaArn
        },
        Value: {
          /* required */
          StringValue: groupType
        }
      }
      /* more items */
    ],
    ParentReference: {
      Selector: parentReference
    }
  }
  return clouddirectory.createObject(params).promise()
}

const createPolicyObject = (
  parentReference,
  linkName,
  groupType,
  facetName,
  attName
) => {
  const params = {
    DirectoryArn: directory_arn,
    SchemaFacets: [
      /* required */
      {
        FacetName: facetName,
        SchemaArn: schemaArn
      }
    ],
    LinkName: linkName,
    ObjectAttributeList: [
      {
        Key: {
          /* required */
          FacetName: facetName /* required */,
          Name: attName /* required */,
          SchemaArn: schemaArn
        },
        Value: {
          /* required */
          StringValue: groupType
        }
      },
      {
        Key: {
          /* required */
          FacetName: facetName /* required */,
          Name: 'policy_type' /* required */,
          SchemaArn: schemaArn
        },
        Value: {
          /* required */
          StringValue: 'app_policy'
        }
      },
      {
        Key: {
          /* required */
          FacetName: facetName /* required */,
          Name: 'policy_document' /* required */,
          SchemaArn: schemaArn
        },
        Value: {
          /* required */
          BinaryValue: new Buffer(['read'])
        }
      }
      /* more items */
    ],
    ParentReference: {
      Selector: parentReference
    }
  }
  return clouddirectory.createObject(params).promise()
}

const getObject = path => {
  const params = {
    DirectoryArn: directory_arn,
    ObjectReference: {
      Selector: path
    },
    ConsistencyLevel: 'SERIALIZABLE'
  }
  return clouddirectory.getObjectInformation(params).promise()
}

const listObjectChildren = path => {
  const params = {
    DirectoryArn: directory_arn,
    ObjectReference: {
      Selector: path
    },
    ConsistencyLevel: 'SERIALIZABLE',
    MaxResults: 10
  }
  return clouddirectory.listObjectChildren(params).promise()
}
