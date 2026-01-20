import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    // Construct the reset link (adjust URL as needed for frontend)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Soporte AgentSport" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Recuperación de Contraseña',
      html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Recuperación de Contraseña</h2>
                    <p>Hola,</p>
                    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
                    <a href="${resetLink}" style="display: inline-block; background-color: #39FF14; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Establecer Nueva Contraseña</a>
                    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                    <p>El enlace es válido por 30 minutos.</p>
                </div>
            `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
  async sendDemoRequestConfirmation(to: string) {
    const mailOptions = {
      from: `"Soporte AgentSport" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Solicitud de Demo Recibida - AgentSport',
      html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>¡Gracias por tu interés en AgentSport!</h2>
                    <p>Hola,</p>
                    <p>Hemos recibido tu solicitud para una demo. Nuestro equipo revisará tu información y se pondrá en contacto contigo a la brevedad para coordinar una reunión.</p>
                    <p>Si tienes alguna consulta urgente, no dudes en responder a este correo.</p>
                    <br>
                    <p>Atentamente,</p>
                    <p><strong>El equipo de AgentSport</strong></p>
                </div>
            `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Demo confirmation email sent to ${to}`);
    } catch (error) {
      console.error('Error sending demo confirmation email:', error);
    }
  }
}
