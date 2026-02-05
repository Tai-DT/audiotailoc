export interface ContactInfo {
  phone: {
    hotline: string;
    display: string;
  };
  email: string;
  address: {
    full: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    country: string;
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    zalo: string;
  };
  businessHours: {
    display: string;
  };
  zalo: {
    phoneNumber: string;
    displayName: string;
  };
}

