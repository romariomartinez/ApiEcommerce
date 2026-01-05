import { resend, EMAIL_FROM } from '../config/email';

export async function sendOrderCreatedEmail(
  to: string,
  orderId: string,
  total: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: 'Pedido creado',
    html: `
      <h2>Pedido confirmado</h2>
      <p>Tu pedido <strong>${orderId}</strong> fue creado correctamente.</p>
      <p>Total: <strong>$${total}</strong></p>
    `,
  });
}

export async function sendOrderCancelledEmail(
  to: string,
  orderId: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: 'Pedido cancelado',
    html: `
      <h2>Pedido cancelado</h2>
      <p>Tu pedido <strong>${orderId}</strong> fue cancelado.</p>
    `,
  });
}

export async function sendPaymentConfirmedEmail(
  to: string,
  orderId: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: 'Pago confirmado',
    html: `
      <h2>Pago recibido</h2>
      <p>El pago de tu pedido <strong>${orderId}</strong> fue confirmado.</p>
    `,
  });
}

export async function sendOrderShippedEmail(
  to: string,
  orderId: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: 'Pedido enviado',
    html: `
      <h2>Pedido enviado</h2>
      <p>Tu pedido <strong>${orderId}</strong> fue enviado.</p>
    `,
  });
}
