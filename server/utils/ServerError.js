class ServerError extends Error {
    constructor(code='SERVER_ERROR', message, status=500, fields=null) {
        super(message);
        this.status = status;
        this.code = code;
        this.fields = fields
    }
}

export default ServerError;