import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendPurchaseEmail = (
  userEmail: string,
  userName: string,
  orderId: string,
  paymentMethod: string,
  total: number
) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return Promise.reject(new Error("EmailJS não configurado: defina as variáveis VITE_EMAILJS_* no .env"));
  }

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      user_email: userEmail,
      user_name: userName,
      order_id: orderId,
      payment_method: paymentMethod,
      total: total,
    },
    PUBLIC_KEY
  );
};
