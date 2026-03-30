export type MembershipType = 'full_member' | 'friend';
export type MembershipStatus = 'pending' | 'active' | 'lapsed' | 'resigned' | 'removed';
export type PaymentStatus = 'paid' | 'unpaid' | 'pending' | 'failed' | 'exempt';
export type PaymentMethod = 'stripe' | 'bank_transfer' | 'cash' | 'other';
export type AdminRole = 'super_admin' | 'membership_admin' | 'communications_admin';

export interface Member {
  id: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  phone?: string;
  membership_type: MembershipType;
  membership_status: MembershipStatus;
  household_id?: string;
  is_primary_household_member: boolean;
  date_joined?: string;
  consent_given: boolean;
  created_at: string;
}

export interface Household {
  id: string;
  raw_address: string;
  normalized_address: string;
  suburb?: string;
  is_validated: boolean;
}

export interface Payment {
  id: string;
  member_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_date?: string;
}
