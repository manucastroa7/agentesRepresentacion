import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASS'),
            },
        });
    }

    async sendUserConfirmation(user: any, token: string) {
        const url = `example.com/auth/confirm?token=${token}`;

        await this.transporter.sendMail({
            to: user.email,
            from: '"Support Team" <support@example.com>', // override with env var if needed
            subject: 'Welcome to Nice App! Confirm your Email',
            html: `
        <p>Hey ${user.name},</p>
        <p>Please click below to confirm your email</p>
        <p>
            <a href="${url}">Confirm</a>
        </p>
        <p>If you did not request this email you can safely ignore it.</p>
      `,
        });
    }

    async sendDemoRequestConfirmation(email: string) {
        try {
            await this.transporter.sendMail({
                to: email,
                from: '"AgentPro Team" <no-reply@agentpro.com>',
                subject: 'Solicitud de Demo Recibida - AgentPro',
                html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>¡Gracias por tu interés en AgentPro!</h2>
            <p>Hemos recibido tu solicitud de demo.</p>
            <p>Nuestro equipo revisará tu información y se pondrá en contacto contigo a la brevedad para coordinar una demostración personalizada.</p>
            <br>
            <p>Atentamente,</p>
            <p><strong>El equipo de AgentPro</strong></p>
          </div>
        `,
            });
            console.log(`Demo confirmation email sent to ${email}`);
        } catch (error) {
            console.error(`Error sending demo confirmation email to ${email}:`, error);
            // Don't throw error to avoid blocking the user response, just log it
        }
    }
}
