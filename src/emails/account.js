const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'oguzhankukul@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    });
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'oguzhankukul@gmail.com',
        subject: "We're sorry that you're leaving",
        text: `Hey ${name},\nIt looks like you're leaving us. Please let us know if there's anything gone wrong or anything we can do to change your mind`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}