export const RELATION_MAP: Record<number, string> = {
  0: "Head of the Family",
  4: "Father",
  5: "Mother",
  6: "Brother",
  7: "Sister",
  2: "Son",
  3: "Daughter",
  1: "Spouse",
  99: "Other",
};

export const RELATION_CHOICES = [
  { value: 4, label: "Father" },
  { value: 5, label: "Mother" },
  { value: 6, label: "Brother" },
  { value: 7, label: "Sister" },
  { value: 2, label: "Son" },
  { value: 3, label: "Daughter" },
  { value: 1, label: "Spouse" },
  { value: 8, label: "Mother in Law" },
  { value: 9, label: "Father in Law" },
  { value: 99, label: "Other" },
];

export const ACTIVITY_EMAIL = 1;
export const ACTIVITY_PHONE = 2;
export const ACTIVITY_F2F = 3;

export const ACTIVITY_CHOICES = [
  { label: "Phone", value: ACTIVITY_PHONE },
  { label: "Email", value: ACTIVITY_EMAIL },
  { label: "Face to Face Meeting", value: ACTIVITY_F2F },
];

export const ACTIVITY_MAP: Record<number, string> = {
  [ACTIVITY_PHONE]: 'Phone Call',
  [ACTIVITY_EMAIL]: 'Email',
  [ACTIVITY_F2F]: 'Face to Face',
};
