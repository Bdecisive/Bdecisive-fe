export interface Vendor {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  approved: boolean;
  createdAt: string;
  address?: string;
  approvedDate: string;
}

// You could also add type for vendor creation/update
export type CreateVendorDto = Omit<Vendor, 'id' | 'createdAt'>;
export type UpdateVendorDto = Partial<CreateVendorDto>;