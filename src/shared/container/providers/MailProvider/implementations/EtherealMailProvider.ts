import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ){
    nodemailer.createTestAccount().then( account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      console.log(account);
      this.client = transporter;
    });
  }

  public async sendMail({ from, to, subject, templateData}: ISendMailDTO): Promise<void>{
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe Go Barber',
        address: from?.name || 'gobarber@gmail.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Mensagem Enviada: %s', message.messageId);
    console.log('Previer URL: %s', nodemailer.getTestMessageUrl(message));
  }
}