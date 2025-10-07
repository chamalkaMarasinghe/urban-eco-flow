/***
 * 
 * ============== AUTHENTICATION ENDPOINTS DOCUMENTATION =====================================================
 * 
 */

module.exports = {
    "/auth/signup/user": { 
        post: {
            summary: "Signup as User",
            description:
                "Signup a user to the system as a regular authenticated user",
            tags: ["Authentication-User"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                firstName: {
                                    type: "string",
                                    example: "Chamalka",
                                },
                                lastName: {
                                    type: "string",
                                    example: "Marasinghe",
                                },
                                phoneNumber: {
                                    type: "string",
                                    example: "0331232123",
                                },
                                email: {
                                    type: "string",
                                    example: "chamalkaauth@freesourcecodes.com",
                                },
                                password: {
                                    type: "string",
                                    example: "#taskerPassword99",
                                },
                                // profilePicture: {
                                //     type: "string",
                                //     example: "https://youtube.com",
                                // }
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    "/auth/signin/user": {
        post: {
            summary: "Signin as User",
            description:
                "Signin a user to the system as a regular authenticated user or tasker",
            tags: ["Authentication-User"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    example: "chamalkaauth@freesourcecodes.com",
                                },
                                password: {
                                    type: "string",
                                    example: "#taskerPassword99",
                                },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    "/auth/forgot-password/user": {
        post: {
            summary: "Forgot password Option for user",
            description:
                "Generates a authenticated link for change the user password",
            tags: ["Authentication-User"],
            // security: [
            //     {
            //         BearerAuth: []
            //     }
            // ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    example: "chamalkaauth@freesourcecodes.com",
                                },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    "/auth/verify-forgot/user/{id}/{token}": { 
        get: {
            summary: "Validate forgot password Option for user",
            description:
                "Validating the generated authenticated link for change the user password",
            tags: ["Authentication-User"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "user id"
                },
                {
                    name: "token",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "authentication token"
                }
            ],
            requestBody: {
                required: false,
                content: {
                    // "application/json": {
                    //     schema: {
                    //         type: "object",
                    //         properties: {
                    //             id: {
                    //                 type: "string",
                    //                 example: "<user id - object id>",
                    //             },
                    //             token: {
                    //                 type: "string",
                    //                 example: "<token fromm the authenticated link>",
                    //             },
                    //         },
                    //     },
                    // },
                },
            },
            responses: {},
        },
    },
    "/auth/change-password/user/{id}/{token}": {
        post: {
            summary: "Chnaging the password of user",
            description:
                "Changing the password via the generated authenticated link",
            tags: ["Authentication-User"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "user id"
                },
                {
                    name: "token",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "authentication token"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                password: {
                                    type: "string",
                                    example: "#taskerPassword99",
                                },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
};
