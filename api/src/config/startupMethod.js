const mongoose = require("mongoose");
const {
    roles,
    writerExperience,
    documentCounters,
    documentCountersMountingCount
} = require("../constants/commonConstants");
const DocumentCounter = require("../models/documentCounter");

const currentEnvironment = require('./environmentConfig')
const ADMIN_FIRST_NAME = currentEnvironment.ADMIN_FIRST_NAME;
const ADMIN_LAST_NAME = currentEnvironment.ADMIN_LAST_NAME;
const ADMIN_EMAIL = currentEnvironment.ADMIN_EMAIL;
const ADMIN_PASSWORD = currentEnvironment.ADMIN_PASSWORD;
const { getNewID } = require("../utils/genCustomID/getNewID");
const { FailureOccurredError } = require("../utils/errors/CustomErrors");
// const ServiceProvider = require("../models/serviceProvider");

exports.startupMethod = async () => {
    try {
        /* 1). ================================== CREATING THE DOCUMENT COUNTERS IF THIS NOT EXISTS IN THE DATABASE =======================================*/
        
        const documentCountersAll = Object.values(documentCounters); // all document count values those must be in the database
        
        const documentCountersList = await DocumentCounter.find({}); // document count values this exists in the database at current moment

        if (!documentCountersList || documentCountersList?.length < documentCountersAll?.length) {

            for (const document of documentCountersAll) {

                let isExists = false;

                // skip the operation if any document counter exits in the database
                for (const documentInDB of documentCountersList) {
                    if (documentInDB?.collection === document) {
                        isExists = true;
                        break;
                    }
                }

                if (!isExists) {
                    const doc = new DocumentCounter({collection: document, count: documentCountersMountingCount});
                    await doc.save();
                }
            }

            console.log("Found some missing document counters and created new entries for those document counters.")
        } else {
            console.log("All document counters found in this database")
        }

        /* 2). ================================== CREATING THE SUPER ADMIN USER IF THIS NOT EXISTS IN THE DATABASE =======================================*/
        /*
        // checking if the super admin record is already exists or not
        const superAdminUser = await ServiceProvider.findOne({roles: { $in: [`${roles.ADMIN}`]}});

        // if the super admin record is already not exists in the database..
        // creating the new super admin user according to the provided information in the .env file         
        if (!superAdminUser) {

            const newId = await getNewID(documentCounters.SERVICE_PRO);

            if(!newId){
                console.log("ID Generation");
            }

            const newSuperAdmin = await ServiceProvider.create({
                id: newId,
                firstName: ADMIN_FIRST_NAME,
                lastName: ADMIN_LAST_NAME,
                email: ADMIN_EMAIL,
                roles: [roles.ADMIN],
                password: ADMIN_PASSWORD,
            })

            if (newSuperAdmin) {
                console.log("SUPER ADMIN not exists in this database. New Admin user was created");
            } else {
                console.log("SUPER ADMIN not exists in this database. New Admin user was created. But error Occurred during fetching the newly created admin user");
            }
        } else {
            console.log("SUPER ADMIN already exists in this database");
        }
        */
    } catch (error) {
        console.log("Error Occurred In Startup Method");
        console.log(error);
    }
}