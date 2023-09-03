import { registerAs } from '@nestjs/config';
import { SmtpOptions } from 'src/shared/modules/smtp/smtp.config';

export default registerAs('SMTP_CONFIG', (): SmtpOptions => {
  return {
    from: process.env.SMTP_FROM,
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
});
