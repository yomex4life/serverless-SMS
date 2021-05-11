const Responses = require('../common/responseBuilder')
const AWS = require('aws-sdk')

const SNS = new AWS.SNS({apiVersion: '2010-03-31'})

exports.handler  = async event =>{
    console.log('event', event)

    const body = JSON.parse(event.body);

    if(!body || !body.phoneNumber || !body.message){
        return Responses.buildResponse(400, {
            message: 'Missing phone number'
        })
    }

    const AttributeParams = {
        attributes: {
            DefaultSMSType: 'Promotional'
        }
    }

    const messageParams = {
        Message: body.message,
        PhoneNumber: body.phoneNumber
    }

    try {
        console.log('We are here now')
        await SNS.setSMSAttributes(AttributeParams).promise()
        await SNS.publish(messageParams).promise()

        console.log('We got here')

        return Responses.buildResponse(200, {
            message: 'Text has been sent to phone number'
        })
    } catch (error) {
        console.log('error', error)
        return Responses.buildResponse(400, {
            message: 'Unable to send message'
        })
    }
}