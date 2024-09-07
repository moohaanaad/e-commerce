import nodemailer from "nodemailer"

export const sendEmail = async ({ to, subject, html  }) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mohanadahmed266@gmail.com",
            pass: "aizsntqrfhbfzgox",
        },
    });
    const info = await transporter.sendMail({
        from: 'e-commerce 👻', // sender address
        to, // list of receivers
        subject, // Subject line
        html // html body
    });
    
}