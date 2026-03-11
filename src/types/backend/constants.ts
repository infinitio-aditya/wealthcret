export const ORG_TYPE_AD = '0';
export const ORG_TYPE_RP = '1';
export const ORG_TYPE_SP = '2';
export const ORG_TYPE_CL = '3';

export const ORG_TYPE_LABEL = {
    [ORG_TYPE_RP]: 'Referral Partner',
    [ORG_TYPE_SP]: 'Service Provider',
    [ORG_TYPE_CL]: 'Client',
    [ORG_TYPE_AD]: 'Admin',
};

export const DOCUMENT_PAN = 1;
export const DOCUMENT_ADHAAR = 2;
export const DOCUMENT_CHEQUE = 3;
export const DOCUMENT_SIGNATURE = 4;
export const DOCUMENT_NDA = 5;
export const DOCUMENT_DISCLAIMER = 6;
export const DOCUMENT_RP_AGREEMENT = 7;
export const DOCUMENT_SP_AGREEMENT = 8;
export const DOCUMENT_CL_DECLARATION = 9;
export const DOCUMENT_CL_DEMAT_DISC = 10;
export const DOCUMENT_CL_ADVISORY = 11;
export const DOCUMENT_CL_DISTRI = 12;
export const DOCUMENT_CL_DOS_DONTS = 13;
export const DOCUMENT_CL_PM_DISC = 14;
export const DOCUMENT_CL_UNLISTED = 15;
export const DOCUMENT_CL_RISK_DECLARATION = 16;

export const DOCUMENT_TYPE_LABEL_MAP: Record<number, string> = {
  [DOCUMENT_PAN]: 'Pan Card',
  [DOCUMENT_ADHAAR]: 'Adhaar Card',
  [DOCUMENT_CHEQUE]: 'Cancelled Cheque',
  [DOCUMENT_SIGNATURE]: 'Signature',
  [DOCUMENT_NDA]: 'Non Disclosure Agreement',
  [DOCUMENT_DISCLAIMER]: 'Disclaimer',
  [DOCUMENT_RP_AGREEMENT]: 'Referral Partner Agreement',
  [DOCUMENT_SP_AGREEMENT]: 'Service Provider Agreement',
  [DOCUMENT_CL_DECLARATION]: 'Client Document Declaration',
  [DOCUMENT_CL_DEMAT_DISC]: 'Demateralization Disclosure',
  [DOCUMENT_CL_ADVISORY]: 'Advisory Disclaimer',
  [DOCUMENT_CL_DISTRI]: 'Distribution Disclosure',
  [DOCUMENT_CL_DOS_DONTS]: 'Dos and Donts',
  [DOCUMENT_CL_PM_DISC]: 'Portfolio Management Disclaimer',
  [DOCUMENT_CL_UNLISTED]: 'Unlisted Risk Disclosure',
  [DOCUMENT_CL_RISK_DECLARATION]: 'Portfolio Risk Declaration',
};