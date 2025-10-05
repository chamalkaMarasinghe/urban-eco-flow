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
    
    "/auth/signup/servicepro": { 
        post: {
            summary: "Signup as Service Provider",
            description:
                "Signup a user to the system as a regular authenticated user",
            tags: ["Authentication-Service provider"],
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
    "/auth/signin/servicepro": {
        post: {
            summary: "Signin as Service Provider",
            description:
                "Signin a user to the system as a regular authenticated user or tasker",
            tags: ["Authentication-Service provider"],
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
    "/auth/forgot-password/servicepro": {
        post: {
            summary: "Forgot password Option for service pro",
            description:
                "Generates a authenticated link for change the user password",
            tags: ["Authentication-Service provider"],
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
    "/auth/verify-forgot/servicepro/{id}/{token}": { 
        get: {
            summary: "Validate forgot password Option for service pro",
            description:
                "Validating the generated authenticated link for change the user password",
            tags: ["Authentication-Service provider"],
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
    "/auth/change-password/servicepro/{id}/{token}": {
        post: {
            summary: "Chnaging the password of service pro",
            description:
                "Changing the password via the generated authenticated link",
            tags: ["Authentication-Service provider"],
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

    "/auth/signin/admin": { // documentation for auth/signin/user - signin to the systema as an user or tasker
        post: {
            summary: "Signin as Admin",
            description:
                "Signin the admin",
            tags: ["Authentication Admin"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    example: "admin@kidsplan.com",
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
    // "/auth/signin/user/verify-otp": { // documentation for auth/signin/user/verify-otp - verify signin otp code
    //     post: {
    //         summary: "Verify signin otp code",
    //         description:
    //             "Verify the recieved otp code of the sign in process and make the signin proccess successfull if the provided otp code is authenticated and accurate",
    //         tags: ["Authentication"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: true,
    //             content: {
    //                 "application/json": {
    //                     schema: {
    //                         type: "object",
    //                         properties: {
    //                             otp: {
    //                                 type: "string",
    //                                 example: "123456",
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //         responses: {},
    //     },
    // },

};
