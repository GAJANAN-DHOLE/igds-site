export interface LegalSection {
  heading: string;
  body: readonly string[];
  list?: readonly string[];
}

export interface LegalDocument {
  id: 'privacy' | 'terms';
  title: string;
  intro: string;
  sections: readonly LegalSection[];
}

export const legalUpdated = '8 October 2026';

export const legal: readonly LegalDocument[] = [
  {
    id: 'privacy',
    title: 'Privacy policy',
    intro:
      'We use the information you submit for a single purpose: to respond to your enquiry and, if it leads somewhere, to discuss the engineering requirement you approached us about. We do not use it for marketing lists, we do not profile you, and we do not send newsletters unless you ask for them separately.',
    sections: [
      {
        heading: 'Who sees it',
        body: [
          'Enquiries sent through this website are delivered by email to our company mailbox and read by the IGDS staff who handle them. We do not sell personal information and we do not share it with third parties for their own purposes.',
          'Information may pass through the technical providers that run this website, our form service and our email, who process it on our instructions only. We may also disclose information where the law requires it.',
        ],
      },
      {
        heading: 'How long we keep it',
        body: [
          'Enquiry emails are kept for as long as the enquiry or the resulting business relationship is active, and for a reasonable period afterwards for our records. If an enquiry does not proceed, we delete the correspondence once it no longer serves a purpose.',
        ],
      },
      {
        heading: 'Cookies and tracking',
        body: [
          'This website does not use advertising cookies, analytics cookies or third-party tracking pixels, and it does not build a profile of your browsing.',
          'Some pages link to platforms run by other companies, such as the social media links in the footer. Once you follow such a link, that platform’s own privacy policy applies.',
        ],
      },
      {
        heading: 'Keeping it secure',
        body: [
          'The website is served over an encrypted HTTPS connection, and access to the mailbox that receives enquiries is restricted to authorised staff. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.',
          'Please do not send confidential technical or commercial information through the web form. Contact us first and we will agree a suitable route, including a non-disclosure agreement where the work calls for one.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You may ask us to confirm what personal information of yours we hold, to correct it if it is wrong, or to delete it where we have no continuing reason to keep it. You may also withdraw any consent you have given. Write to us at the address below and we will respond within a reasonable period.',
        ],
      },
      {
        heading: 'Children',
        body: ['This website addresses businesses and professional buyers. It is not directed at children, and we do not knowingly collect information from them.'],
      },
      {
        heading: 'Changes to this policy',
        body: ['We may update this policy as our practices or the law change. The revised version will be posted on this page with a new date.'],
      },
    ],
  },
  {
    id: 'terms',
    title: 'Terms of use',
    intro: 'You may view, download and print pages from this site for your own business evaluation of our products and services. You may not:',
    sections: [
      {
        heading: 'Acceptable use',
        body: [],
        list: [
          'Use the site for any unlawful or fraudulent purpose',
          'Attempt to gain unauthorised access to the site, its server or any connected system',
          'Introduce malicious code or interfere with the site’s operation',
          'Systematically extract content by scraping, harvesting or automated collection',
          'Submit enquiries containing unsolicited advertising, or another person’s personal data without their permission',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'The content of this website, including text, product designs and images, diagrams, layout and the IGDS name and logo, belongs to IG Drives and Systems or is used with permission, and is protected by law. You may not copy, republish or use it commercially without our written consent. Reasonable quotation with attribution is permitted.',
          'Where our engineering services produce designs, firmware or documentation for a client, ownership of that work product is set by the contract for that project, not by these terms.',
        ],
      },
      {
        heading: 'Confidentiality',
        body: [
          'Please do not send confidential drawings, specifications or commercial information through the enquiry form. Information submitted through a public web form is not treated as confidential unless we have signed a non-disclosure agreement with you. Contact us first and we will put one in place where the discussion needs it.',
        ],
      },
      {
        heading: 'External links',
        body: ['This site links to other websites, including our social media profiles. Those sites are run by other organisations. We do not control them and are not responsible for their content, products or practices. A link is not an endorsement.'],
      },
      {
        heading: 'Availability',
        body: ['We aim to keep the site available but do not guarantee uninterrupted access. We may suspend, withdraw or change any part of it without notice, for maintenance or any other business reason.'],
      },
      {
        heading: 'Representative 3D models',
        body: ['The 3D models on this site are representative illustrations built to explain how our products are organised. They are not engineering drawings and carry no dimensions or tolerances. Specifications in the text apply.'],
      },
      {
        heading: 'Liability',
        body: [
          'This website is provided “as is”. To the extent permitted by law, we exclude liability for any loss arising from reliance on the information on this site, from its unavailability, or from any virus or harmful component obtained through it.',
          'Nothing in these terms limits or excludes any liability that cannot lawfully be limited or excluded, including liability for death or personal injury caused by negligence, or for fraud.',
        ],
      },
      {
        heading: 'Privacy and changes',
        body: [
          'Personal information you submit through this site is handled in accordance with our privacy policy, which forms part of these terms.',
          'We may revise these terms from time to time. The version published on this page at the time you use the site is the one that applies.',
        ],
      },
      {
        heading: 'Governing law',
        body: ['These terms and any dispute arising out of them are governed by the laws of India, and the courts at Pune, Maharashtra have exclusive jurisdiction.'],
      },
    ],
  },
] as const;
