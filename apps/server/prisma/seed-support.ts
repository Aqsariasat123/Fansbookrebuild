import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedSupport() {
  await prisma.faq.deleteMany();

  const faqs = [
    {
      question: 'How do I go live on FansBook?',
      answer:
        'To go live, navigate to your profile and click the "Go Live" button. You\'ll need to grant camera and microphone permissions. Make sure you have a stable internet connection for the best streaming experience.',
      order: 1,
    },
    {
      question: 'How can I withdraw my earnings?',
      answer:
        'Go to your Wallet page and click "Withdraw". You can withdraw to your bank account or PayPal. Minimum withdrawal amount is $20. Processing takes 3-5 business days.',
      order: 2,
    },
    {
      question: 'How do I reset my password?',
      answer:
        'Go to Settings > Password section. Enter your current password and your new password. Click "Change Password" to save. If you forgot your password, use the "Forgot Password" link on the login page.',
      order: 3,
    },
    {
      question: 'What kind of content is not allowed?',
      answer:
        'Content involving minors, non-consensual activities, violence, illegal substances, or any content that violates our Terms of Service is strictly prohibited. Violations may result in account suspension or ban.',
      order: 4,
    },
    {
      question: 'How do I become a verified creator?',
      answer:
        'To get verified, go to Settings > Verification. Submit a valid government-issued ID and a selfie holding the ID. Verification usually takes 24-48 hours.',
      order: 5,
    },
    {
      question: 'How do subscriptions work?',
      answer:
        'Creators set their own subscription prices. Once you subscribe, you get access to all their subscriber-only content. Subscriptions auto-renew monthly unless cancelled.',
      order: 6,
    },
    {
      question: 'Can I block or report a user?',
      answer:
        "Yes, visit the user's profile and click the three dots menu. You can block them to prevent all interaction, or report them if they're violating our community guidelines.",
      order: 7,
    },
    {
      question: 'How do I delete my account?',
      answer:
        'Go to Settings > Account Security and click "Delete my account". This action is permanent and cannot be undone. All your content, messages, and data will be permanently removed.',
      order: 8,
    },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq });
  }

  // eslint-disable-next-line no-console
  console.log('Seeded FAQs');
}
