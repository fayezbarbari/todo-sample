class Api {
  constructor(event) {
    this.event = event;

    this.params = this.event.pathParameters || {};
    if (this.event.queryStringParameters)
      this.params = Object.assign(this.params, this.event.queryStringParameters);
  }

  // Request params
  get payload() {
    return typeof (this.event.body) == "string" ? JSON.parse(this.event.body) : this.event.body;
  }

  get userid() {
    return this.params.userid;
  }

  // Responses
  successResponse(body) {
    return this._buildResponse(200, body);
  }

  failureResponse(body) {
    return this._buildResponse(500, body);
  }

  forbiddenResponse() {
    return this._buildResponse(403, "Access denied");
  }

  // private functions
  _buildResponse(statusCode, body) {
    let resp = (typeof (body) == "string") ? body : JSON.stringify(body);
    if (body instanceof Error && statusCode === 500)
      resp = (body || { message: "Unexpected error" }).message;

    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: resp
    };
  }
}

module.exports = Api;