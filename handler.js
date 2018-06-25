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

module.exports.createGroup = (event, context, callback) => {
  //createGroup('/APP', 'WAY2HOME', 'WAY2HOME', 'Group', 'Name')
  //createGroup('/APP', 'MYHEALTH', 'MYHEALTH', 'Group', 'Name')
  createGroup('/APP', 'MYHEALTH', 'MYHEALTH', 'Group', 'Name')
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

module.exports.attachPolicy = (event, context, callback) => {
  attacObjectToPolicy('/APP/WAY2HOME', '/WAY2HOME')
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

module.exports.createPolicy = (event, context, callback) => {
  createPolicyObject(
    '/',
    'WAY2HOME',
    'WAY2HOME-POLICY',
    'AccessRole',
    'AccessLevel'
  )
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
  listObjectChildren('/APP/WAY2HOME')
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

module.exports.listIndex = (event, context, callback) => {
  listIndex()
    .then(data => {
      console.log(JSON.stringify(data))
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

module.exports.createIndex = (event, context, callback) => {
  createIndex('Group', 'Name', 'group-index', '/')
    .then(data => {
      console.log(data)
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

module.exports.attachToIndex = (event, context, callback) => {
  attachToIndex('/group-index', '/APP/WAY2HOME')
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

module.exports.listPolicyAttachments = (event, context, callback) => {
  listPolicyAttachments('/WAY2HOME')
    .then(data => {
      console.log(data)
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

module.exports.createPolicy = (event, context, callback) => {
  createPolicyObject(
    '/',
    'EHEALTH',
    'EHEALTH-POLICY',
    'AccessRole',
    'AccessLevel'
  )
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

module.exports.lookupPolicy = (event, context, callback) => {
  lookupPolicy('/WAY2HOME')
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

const attacObjectToPolicy = (node_path, policy_path) => {
  const params = {
    DirectoryArn: directory_arn,
    ObjectReference: {
      /* required */
      Selector: node_path
    },
    PolicyReference: {
      /* required */
      Selector: policy_path
    }
  }
  return clouddirectory.attachPolicy(params).promise()
}

const createIndex = (facet_name, att_name, link_name, parent_path) => {
  const params = {
    DirectoryArn: directory_arn,
    IsUnique: true /* required */,
    OrderedIndexedAttributeList: [
      /* required */
      {
        FacetName: facet_name /* required */,
        Name: att_name /* required */,
        SchemaArn: schemaArn /* required */
      }
    ],
    LinkName: link_name,
    ParentReference: {
      Selector: parent_path
    }
  }
  return clouddirectory.createIndex(params).promise()
}

const attachToIndex = (index, path) => {
  const params = {
    DirectoryArn: directory_arn /* required */,
    IndexReference: {
      /* required */
      Selector: index
    },
    TargetReference: {
      /* required */
      Selector: path
    }
  }

  return clouddirectory.attachToIndex(params).promise()
}

const lookupPolicy = path => {
  const params = {
    DirectoryArn: directory_arn,
    ObjectReference: {
      Selector: path
    },
    MaxResults: 3
  }

  return clouddirectory.lookupPolicy(params).promise()
}

const listPolicyAttachments = path => {
  const params = {
    DirectoryArn: directory_arn /* required */,
    PolicyReference: {
      /* required */
      Selector: path
    },
    //ConsistencyLevel: SERIALIZABLE | EVENTUAL,
    MaxResults: 10
    //NextToken: 'STRING_VALUE'
  }

  return clouddirectory.listPolicyAttachments(params).promise()
}

const listIndex = () => {
  var params = {
    DirectoryArn: directory_arn /* required */,
    IndexReference: {
      /* required */
      Selector: '/group-index'
    },
    //ConsistencyLevel: SERIALIZABLE | EVENTUAL,
    MaxResults: 10,
    //NextToken: 'STRING_VALUE',
    RangesOnIndexedValues: [
      {
        AttributeKey: {
          FacetName: 'Group',
          Name: 'Name',
          SchemaArn: schemaArn
        },
        Range: {
          EndMode: 'INCLUSIVE',
          StartMode: 'INCLUSIVE',
          EndValue: {
            StringValue: 'WAY2HOME'
          },
          StartValue: {
            StringValue: 'WAY2HOME'
          }
        }
      }
      /* more items */
    ]
  }
  return clouddirectory.listIndex(params).promise()
}
