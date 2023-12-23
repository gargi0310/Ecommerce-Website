const nodeMailer = require("nodemailer");

const sendEmail = async()=>{

    const transporter = nodeMailer.createTransport({
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            password:process.env.SMTP_PASSWORD
        }
    })   
    
    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;