// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
//
// /**
//  *
//  * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
//  * @param {Object} event - API Gateway Lambda Proxy Input Format
//  *
//  * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
//  * @returns {Object} object - API Gateway Lambda Proxy Output Format
//  *
//  */
//
// export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     try {
//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 message: 'hello world',
//             }),
//         };
//     } catch (err) {
//         console.log(err);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                 message: 'some error happened',
//             }),
//         };
//     }
// };


export const scheduledEventLoggerHandler = async (event:any, context:any) => {
    // All log statements are written to CloudWatch by default. For more information, see
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
    console.info(JSON.stringify(event));
}
