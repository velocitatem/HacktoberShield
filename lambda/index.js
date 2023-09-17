const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { userId, action } = event.queryStringParameters || {}; // 'report' or 'getCount'
    if (!userId || !action) {
        return {
            statusCode: 400,
            body: "Missing userId or action"
        };
    } else if (action !== "report" && action !== "getCount") {
        return {
            statusCode: 400,
            body: "Invalid action"
        };
    }



    if (action === "report") {
        await dynamo.update({
            TableName: "UserReports",
            Key: { userId },
            UpdateExpression: "ADD reports :inc",
            ExpressionAttributeValues: { ":inc": 1 },
            ReturnValues: "UPDATED_NEW"
        }).promise();

        return {
            statusCode: 200,
            body: "Report added."
        };
    }

    if (action === "getCount") {
        const result = await dynamo.get({
            TableName: "UserReports",
            Key: { userId }
        }).promise();

        return {
            statusCode: 200,
            body: `Report count: ${result.Item?.reports || 0}`
        };

    }
};
