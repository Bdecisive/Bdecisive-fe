export interface Vendor {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  isApproved: boolean;
  createdAt: string;
  address?: string;
  approvedDate: string;
}

// You could also add type for vendor creation/update
export type CreateVendorDto = Omit<Vendor, 'id' | 'createdAt' | 'lastLogin'>;
export type UpdateVendorDto = Partial<CreateVendorDto>;