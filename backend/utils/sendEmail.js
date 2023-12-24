const nodeMailer = require("nodemailer");

const sendEmail = async(options)=>{

   const transporter = nodeMailer.createTransport({
    secure:false,
    debug:true,
    service:process.env.SMTP_SERVICE,
    auth:{
        user:process.env.SMTP_MAIL,
        pass:process.env.SMTP_PASSWORD,
    },
    tls:{
        rejectUnauthorized:true
    }
   });

//    console.log(process.env.SMPT_MAIL);

   const mailOptions = {
    from:process.env.SMTP_MAIL,
    to:options.email,
    subject:options.subject,
    text:options.message,
   };

   await transporter.sendMail(mailOptions);
    
};

module.exports = sendEmail;