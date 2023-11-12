export const handleSuccessResponse = (response, status, message, data=null, location=null) => {
    const responseData = {
        success: true,
        message,
        data
    };

    if (location) {
        response.location(location);
    }

    response.status(status).json(responseData);
};

export const handleErrorResponse = (response, status, message, data=null) => {
    const errorResponse = {
        success: false,
        message,
        data
    };

    response.status(status).json(errorResponse);
}
