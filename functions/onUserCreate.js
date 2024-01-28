const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
    apiKey: functions.config().mailchimp.apiKey,
    server: "us11",
});

if (admin.apps.length === 0) {
    admin.initializeApp();
}

exports.onUserCreate = functions.firestore
    .document("users/{userId}")
    .onCreate(async (snap, context) => {
        const userData = snap.data();
        const email = userData.email;

        const listId = "632a95a2be";

        const subscribingUser = {
            firstName: userData.name.split(" ")[0],
            lastName: userData.name.split(" ")[1],
            email,
        };

        async function updateTags(subscriberHash, tags) {
            const response = await mailchimp.lists.updateListMemberTags(
                listId,
                subscriberHash,
                {
                    tags: [...tags],
                }
            );

            console.log(
                `The return type for this endpoint is null, so this should be true: ${response === null
                }`
            );
        }

        async function run() {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName,
                },
            });

            console.log(
                `Successfully added contact as an audience member. The contact's id is ${response.id}.`
            );

            return response.id;
        }

        // async function updateMember() {
        //   const response = await mailchimp.lists.updateListMember(
        //     "list_id",
        //     "subscriber_hash",
        //     {
        //       merge_fields: {
        //         PLAN: "PRO",
        //       },
        //     }
        //   );
        // }

        try {
            const subscriberHash = await run();
            await updateTags(subscriberHash, [
                { name: "teste", status: "active" },
                { name: "teste2", status: "active" },
            ]);
        } catch (error) {
            console.error("Erro ao adicionar usuário ao Mailchimp", error);
        }
    });