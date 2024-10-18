import nodemailer from "nodemailer"

export const sendEmail = async ({ to, subject, html  }) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER_NAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const info = await transporter.sendMail({
        from: 'e-commerce 👻', // sender address
        to, // list of receivers
        subject, // Subject line
        html // html body
    });
    
}