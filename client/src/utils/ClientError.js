class ClientError extends Error {
    constructor(data) {
        super(data.message);
        this.status = data.status;
        this.code = data.code;
        this.fields = data.fields
    }
}

export default ClientError